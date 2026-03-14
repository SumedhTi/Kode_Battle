import axios from 'axios';
import { io } from 'socket.io-client';

// Create a centralized axios instance for backend communication
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  // If backend relies on cookies you could set withCredentials: true
});

// Attach auth token from localStorage on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic error handling interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        // invalid or expired token
        console.warn('API unauthorized, clearing local credentials');
        localStorage.removeItem('auth_token');
        // optionally force a reload to send user back to login / refresh context
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// Socket.IO client
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  auth: {
    token: localStorage.getItem('auth_token'),
  },
});

// --- API helper functions ---
export const getCurrentUser = async () => {
  const res = await api.get('/api/auth/me');
  return res.data.user;
};

export const getLeaderboard = async (page = 1, limit = 50) => {
  const res = await api.get('/api/leaderboard', {
    params: { page, limit },
  });
  return res.data.leaderboard;
};

// `userId` should be the current user's Mongo ObjectId string
export const getMatchHistory = async (userId, page = 1, limit = 20) => {
  const res = await api.get('/api/matches', {
    params: { player: userId, page, limit },
  });
  return res.data.matches;
};

export const createMatch = async (problemId) => {
  const res = await api.post('/api/matches/create', { problemId });
  return res.data;
};

export const findMatch = async () => {
  const res = await api.post('/api/matches/find');
  return res.data;
};

export const joinMatch = async (matchId) => {
  const res = await api.post('/api/matches/join', { matchId });
  return res.data;
};

export const submitSolution = async (matchId, language, code) => {
  const res = await api.post('/api/matches/submit', { matchId, language, code });
  return res.data;
};

export const getProblem = async (problemId) => {
  const res = await api.get(`/api/problems/${problemId}`);
  return res.data.problem;
};

export { api, socket };

