import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getProblem } from '../controllers/problemController.js';

const router = express.Router();

// Problem endpoints require authentication
router.use(authenticateToken);

router.get('/:id', getProblem);

export default router;
