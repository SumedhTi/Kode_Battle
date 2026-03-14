import Match from '../models/Match.js';
import MatchManager from '../services/matchManager.js';

let matchManagerInstance = null;

const getMatchManager = (io) => {
  if (!matchManagerInstance) {
    matchManagerInstance = new MatchManager(io);
  }
  return matchManagerInstance;
};

const getMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.player) {
      query.$or = [
        { player1: req.query.player },
        { player2: req.query.player },
      ];
    }

    const matches = await Match.find(query)
      .populate('player1', 'name')
      .populate('player2', 'name')
      .populate('winner', 'name')
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Match.countDocuments(query);

    res.json({
      matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.id })
      .populate('player1', 'name')
      .populate('player2', 'name')
      .populate('winner', 'name')
      .populate('submissions.player', 'name');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ match });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createMatch = async (req, res) => {
  try {
    const player1 = req.user._id;
    const { problemId } = req.body;
    const matchManager = getMatchManager(req.app.get('io'));
    const matchId = await matchManager.createMatch(player1, problemId);

    res.status(201).json({ matchId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const matchmake = async (req, res) => {
  try {
    const playerId = req.user._id;
    const matchManager = getMatchManager(req.app.get('io'));
    const { matchId, isCreator } = await matchManager.matchmake(playerId);

    res.status(200).json({ matchId, isCreator });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const joinMatch = async (req, res) => {
  try {
    const player2 = req.user._id;
    const { matchId } = req.body;
    const matchManager = getMatchManager(req.app.get('io'));
    const match = await matchManager.joinMatch(matchId, player2);

    res.json({ matchId, status: match.status });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const submitSolution = async (req, res) => {
  try {
    const playerId = req.user._id;
    const { matchId, language, code } = req.body;
    const matchManager = getMatchManager(req.app.get('io'));
    const submission = await matchManager.createSubmission(matchId, playerId, language, code);

    res.status(201).json({ submission });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const deleteMatch = async (req, res) => {
  try {
    // Only admin can delete matches
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const match = await Match.findOne({ matchId: req.params.id });
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    await Match.findOneAndDelete({ matchId: req.params.id });
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  getMatches,
  getMatchById,
  createMatch,
  matchmake,
  joinMatch,
  submitSolution,
  deleteMatch,
  getMatchManager,
};

export {
  getMatches,
  getMatchById,
  createMatch,
  joinMatch,
  submitSolution,
  deleteMatch,
  getMatchManager,
};