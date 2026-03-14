import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30y' });
};

const googleAuth = (req, res) => {
  // This will be handled by Passport
};

const googleAuthCallback = (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed' });
  }
};

const logout = (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
};

const getCurrentUser = (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      eloRating: req.user.eloRating,
      matchesPlayed: req.user.matchesPlayed,
      wins: req.user.wins,
      losses: req.user.losses,
    },
  });
};

export {
  googleAuth,
  googleAuthCallback,
  logout,
  getCurrentUser,
};