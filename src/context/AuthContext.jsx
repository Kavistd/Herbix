import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { AUTH_TOKEN_KEY, UNAUTHORIZED_EVENT } from '../services/api';

const AuthContext = createContext(null);

/**
 * Centralized authentication state for the whole app.
 *
 * - Only the JWT is ever persisted (localStorage) — no password is ever
 *   stored on the frontend, not even momentarily beyond the login form's
 *   own state.
 * - On mount, if a token exists, it's verified against the real backend
 *   (GET /api/auth/me) rather than trusted blindly — an expired/tampered
 *   token is cleared immediately.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until the initial /me check resolves
  const [authError, setAuthError] = useState(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  }, []);

  // Verify any stored token against the backend on first load.
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    api
      .get('/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.data.data);
      })
      .catch(() => {
        // Invalid/expired token — the response interceptor already clears
        // localStorage; just make sure local state matches.
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // React to a 401 raised anywhere in the app (e.g. token expired mid-session).
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, token } = res.data.data;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async ({ name, email, password, phone }) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      const { user: newUser, token } = res.data.data;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setUser(newUser);
      return newUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create account';
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = {
    user,
    isLoading,
    authError,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    clearAuthError: () => setAuthError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
