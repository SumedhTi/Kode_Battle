import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

// Leaderboard might be public or require auth, depending on requirements
// For now, making it require auth
router.use(authenticateToken);

router.get('/', getLeaderboard);

export default router;