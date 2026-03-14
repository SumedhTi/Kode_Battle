import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true,
  },
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  problemId: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // in seconds
    default: 30 * 60,
  },
  status: {
    type: String,
    enum: ['waiting', 'ready', 'running', 'finished'],
    default: 'waiting',
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cheatEvents: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  submissions: [
    {
      submissionId: {
        type: String,
        required: true,
        unique: true,
      },
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      language: {
        type: String,
        required: true,
      },
      filePath: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['PENDING', 'RUNNING', 'COMPLETED'],
        default: 'PENDING',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  eloChange: {
    player1: Number,
    player2: Number,
  },
});

export default mongoose.model('Match', matchSchema);