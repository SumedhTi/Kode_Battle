import User from '../models/User.js';

const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('name eloRating wins matchesPlayed')
      .sort({ eloRating: -1 })
      .skip(skip)
      .limit(limit);

    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      name: user.name,
      eloRating: user.eloRating,
      wins: user.wins,
      matchesPlayed: user.matchesPlayed,
    }));

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  getLeaderboard,
};