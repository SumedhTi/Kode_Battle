import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  googleAuth,
  googleAuthCallback,
  logout,
  getCurrentUser,
} from '../controllers/authController.js';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL;
const OAUTH_FAILURE_REDIRECT = `${FRONTEND_URL}/?authError=1`; // adjust as needed

// Google OAuth routes (no server-side sessions needed for JWT flow)
router.get(
  '/google',
  authLimiter,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: OAUTH_FAILURE_REDIRECT, session: false }),
  googleAuthCallback
);

// Other auth routes
router.post('/logout', logout);
router.get('/me', authenticateToken, getCurrentUser);

export default router;