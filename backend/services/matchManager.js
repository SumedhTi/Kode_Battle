import Match from '../models/Match.js';
import User from '../models/User.js';
import { calculateNewRatings } from './eloCalculator.js';
import { v4 as uuidv4 } from 'uuid';
import { getProblemById, getRandomProblemId } from './problemService.js';
import { saveSubmissionFile, buildSubmissionRecord } from './submissionService.js';

class MatchManager {
  constructor(io) {
    this.io = io;
    this.activeMatches = new Map(); // matchId -> { match, players, timeRemaining }
    this.timers = new Map(); // matchId -> timer interval
  }

  async createMatch(player1Id, problemId) {
    const matchId = uuidv4();
    const match = new Match({
      matchId,
      player1: player1Id,
      problemId,
      status: 'waiting',
      duration: 30 * 60,
    });

    await match.save();

    this.activeMatches.set(matchId, {
      match,
      players: [player1Id],
      timeRemaining: match.duration,
    });

    return matchId;
  }

  async matchmake(playerId) {
    // Try to match against an existing waiting match from a different player
    const waitingMatch = await Match.findOne({
      status: 'waiting',
      player2: null,
      player1: { $ne: playerId },
    });

    if (waitingMatch) {
      await this.joinMatch(waitingMatch.matchId, playerId);
      return {
        matchId: waitingMatch.matchId,
        isCreator: false,
      };
    }

    // No available match, create a new one
    const problemId = await getRandomProblemId();
    const matchId = await this.createMatch(playerId, problemId);
    return {
      matchId,
      isCreator: true,
    };
  }

  async joinMatch(matchId, player2Id) {
    const matchData = this.activeMatches.get(matchId);
    const match = matchData ? matchData.match : await Match.findOne({ matchId });
    if (!match) throw new Error('Match not found');
    if (match.status === 'running' || match.status === 'finished') {
      throw new Error('Match already started or finished');
    }

    match.player2 = player2Id;
    match.status = 'ready';
    await match.save();

    const players = matchData ? matchData.players : [match.player1];
    const updatedPlayers = Array.from(new Set([...players, player2Id]));
    const timeRemaining = match.duration || 30 * 60;

    this.activeMatches.set(matchId, {
      match,
      players: updatedPlayers,
      timeRemaining,
    });

    this.io.to(`match_room_${matchId}`).emit('match_ready', {
      matchId,
      players: updatedPlayers,
    });

    // Auto-start the match once two players are present
    this.startMatch(matchId).catch((err) => {
      console.error('Failed to start match:', err);
    });

    return match;
  }

  async startMatch(matchId) {
    const matchData = this.activeMatches.get(matchId);
    const match = matchData ? matchData.match : await Match.findOne({ matchId });
    if (!match) return;
    if (match.status === 'running' || match.status === 'finished') return;

    match.status = 'running';
    match.startTime = new Date();
    await match.save();

    const timeRemaining = match.duration || 30 * 60;
    this.activeMatches.set(matchId, {
      match,
      players: matchData?.players || [match.player1, match.player2].filter(Boolean),
      timeRemaining,
    });

    // Send problem statement when match starts
    const problem = match.problemId ? await getProblemById(match.problemId) : null;

    this.io.to(`match_room_${matchId}`).emit('match_start', {
      matchId,
      startTime: match.startTime,
    });

    if (problem) {
      const { title, description, constraints, visibleTestcases, timeLimit } = problem;
      this.io.to(`match_room_${matchId}`).emit('match_problem', {
        matchId,
        problem: {
          title,
          description,
          constraints,
          visibleTestcases,
          timeLimit,
        },
      });
    }

    this.startTimer(matchId);
  }

  startTimer(matchId) {
    const matchData = this.activeMatches.get(matchId);
    if (!matchData) return;

    if (this.timers.has(matchId)) {
      clearInterval(this.timers.get(matchId));
    }

    const timer = setInterval(async () => {
      const current = this.activeMatches.get(matchId);
      if (!current) {
        clearInterval(timer);
        return;
      }

      current.timeRemaining = Math.max(0, current.timeRemaining - 1);

      this.io.to(`match_room_${matchId}`).emit('match_timer_update', {
        matchId,
        timeRemaining: current.timeRemaining,
      });

      if (current.timeRemaining <= 0) {
        clearInterval(timer);
        this.timers.delete(matchId);
        await this.endMatch(matchId, null);
      }
    }, 1000);

    this.timers.set(matchId, timer);
  }

  async endMatch(matchId, winnerId) {
    const matchData = this.activeMatches.get(matchId);
    const match = matchData ? matchData.match : await Match.findOne({ matchId });
    if (!match) return;

    const timer = this.timers.get(matchId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(matchId);
    }

    match.status = 'finished';
    match.endTime = new Date();
    match.winner = winnerId;

    // Update ELO ratings if possible
    if (match.player1 && match.player2) {
      const player1 = await User.findById(match.player1);
      const player2 = await User.findById(match.player2);

      if (winnerId) {
        const isPlayer1Winner = winnerId.toString() === match.player1.toString();
        const { newRating1, newRating2, change1, change2 } = calculateNewRatings(
          player1.eloRating,
          player2.eloRating,
          isPlayer1Winner,
        );

        player1.eloRating = newRating1;
        player2.eloRating = newRating2;

        match.eloChange = {
          player1: change1,
          player2: change2,
        };

        if (isPlayer1Winner) {
          player1.wins++;
          player2.losses++;
        } else {
          player2.wins++;
          player1.losses++;
        }
      } else {
        match.eloChange = {
          player1: 0,
          player2: 0,
        };
      }

      player1.matchesPlayed++;
      player2.matchesPlayed++;

      await player1.save();
      await player2.save();
    }

    await match.save();

    this.io.to(`match_room_${matchId}`).emit('match_end', {
      matchId,
      winner: winnerId,
      eloChange: match.eloChange,
    });

    this.activeMatches.delete(matchId);
  }

  async recordCheatEvent(matchId, playerId, type) {
    const match = await Match.findOne({ matchId });
    if (!match) return;

    match.cheatEvents = match.cheatEvents || [];
    match.cheatEvents.push({ playerId, type, timestamp: new Date() });
    await match.save();
  }

  async createSubmission(matchId, playerId, language, code) {
    const match = await Match.findOne({ matchId });
    if (!match) throw new Error('Match not found');

    const filePath = await saveSubmissionFile({ matchId, playerId, language, code });
    const submission = buildSubmissionRecord({ matchId, playerId, language, filePath });

    match.submissions = match.submissions || [];
    match.submissions.push(submission);
    await match.save();

    this.io.to(`match_room_${matchId}`).emit('code_submit', {
      matchId,
      submission,
    });

    return submission;
  }

  updatePlayerStatus(matchId, playerId, status) {
    this.io.to(`match_room_${matchId}`).emit('player_status', {
      matchId,
      playerId,
      status,
    });
  }

  getMatch(matchId) {
    const active = this.activeMatches.get(matchId);
    if (active) return active.match;
    return Match.findOne({ matchId });
  }
}

export default MatchManager;
