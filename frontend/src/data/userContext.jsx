import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../services/api';

const UserContext = createContext();

// Helper function to determine league from ELO
const getLeagueFromElo = (elo) => {
  if (elo >= 2000) return "Diamond";
  if (elo >= 1800) return "Platinum";
  if (elo >= 1600) return "Gold";
  if (elo >= 1400) return "Silver";
  if (elo >= 1200) return "Bronze";
  return "Iron";
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('app_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from backend using shared API client
  const fetchUserData = useCallback(async (authToken) => {
    try {
      setIsLoading(true);
      // we don't actually need to pass authToken since interceptor reads localStorage,
      // but keep for explicitness
      if (authToken) {
        localStorage.setItem('auth_token', authToken);
      }
      const data = await getCurrentUser();

      const userData = {
        ...data,
        // Map backend fields to frontend-friendly fields
        universityId: data.email.split('@')[0],
        university: "College University",
        league: getLeagueFromElo(data.eloRating),
        elo: data.eloRating,
        battleCoins: 1000,
        wins: data.wins,
        losses: data.losses,
        winStreak: 0,
        rank: 0,
        avatar: data.avatar || data.name.charAt(0).toUpperCase(),
        branch: "Computer Science",
        year: "3rd Year"
      };
      setUser(userData);
    } catch (error) {
      // Check if it's an auth error (401/403) - only then clear session
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.warn('Token invalid, clearing session');
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('app_user');
      } else {
        // Network error or other issue - keep the session (user might be offline)
        console.warn('Failed to fetch user data, but keeping session:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle OAuth callback and restore session on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('token');

    if (authToken) {
      // New login via OAuth callback
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch user data to validate and populate
      fetchUserData(authToken);
    } else {
      // No new token, but check if we have a saved session
      if (token && user) {
        // Session exists in localStorage, assume valid until proven otherwise
        setIsLoading(false);
      } else {
        // No session, stop loading
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('app_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('app_user');
    }
  }, [user]);

  const login = (data) => setUser(data);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('app_user');
    localStorage.removeItem('auth_token');
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user && !!token
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);