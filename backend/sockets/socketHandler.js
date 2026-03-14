import { getMatchManager } from '../controllers/matchController.js';

export default (io) => {
  const matchManager = getMatchManager(io);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create_match', async (data, callback) => {
      try {
        const { playerId, problemId } = data;
        const matchId = await matchManager.createMatch(playerId, problemId);
        socket.join(`match_room_${matchId}`);
        callback?.({ matchId });
      } catch (error) {
        console.error('create_match failed', error);
        callback?.({ error: error.message });
      }
    });

    socket.on('join_match_room', (data, callback) => {
      const { matchId } = data;
      socket.join(`match_room_${matchId}`);
      callback?.({ matchId });
    });

    socket.on('join_match', async (data, callback) => {
      try {
        const { matchId, playerId } = data;
        socket.join(`match_room_${matchId}`);
        await matchManager.joinMatch(matchId, playerId);
        callback?.({ matchId });
      } catch (error) {
        console.error('join_match failed', error);
        callback?.({ error: error.message });
      }
    });

    socket.on('leave_match', (data) => {
      const { matchId } = data;
      socket.leave(`match_room_${matchId}`);
    });

    socket.on('start_match', (data) => {
      const { matchId } = data;
      matchManager.startMatch(matchId);
    });

    socket.on('player_status', (data) => {
      const { matchId, playerId, status } = data;
      matchManager.updatePlayerStatus(matchId, playerId, status);
    });

    socket.on('cheat_event', (data) => {
      const { matchId, playerId, type } = data;
      matchManager.recordCheatEvent(matchId, playerId, type);
    });

    socket.on('code_submit', async (data, callback) => {
      try {
        const { matchId, playerId, language, code } = data;
        const submission = await matchManager.createSubmission(matchId, playerId, language, code);
        callback?.({ submission });
      } catch (error) {
        console.error('code_submit failed', error);
        callback?.({ error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
