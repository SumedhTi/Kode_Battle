import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateMatchCreation } from '../utils/validation.js';
import {
  getMatches,
  getMatchById,
  createMatch,
  matchmake,
  joinMatch,
  submitSolution,
  deleteMatch,
} from '../controllers/matchController.js';

const router = express.Router();

// All match routes require authentication
router.use(authenticateToken);

router.get('/', getMatches);
router.get('/:id', getMatchById);
router.post('/create', validateMatchCreation, createMatch);
router.post('/find', matchmake);
router.post('/join', joinMatch);
router.post('/submit', submitSolution);
router.delete('/:id', deleteMatch);

export default router;