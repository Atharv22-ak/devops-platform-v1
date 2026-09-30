import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const TOKEN_KEY = 'token';

// Send the login token with every API call
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired / invalid token anywhere in the app logs the user out
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthForm = url.includes('/api/auth/login') || url.includes('/api/auth/signup');
    if (err.response?.status === 401 && !isAuthForm) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(err);
  }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  // While a saved token is being checked, show a splash instead of flashing the login page
  const [initializing, setInitializing] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return undefined;
    let cancelled = false;
    axios
      .get('/api/auth/me')
      .then((res) => !cancelled && setUser(res.data.data))
      .catch((err) => {
        // Only a rejected token ends the session; a network blip keeps it
        if (!cancelled && err.response?.status === 401) clearSession();
      })
      .finally(() => !cancelled && setInitializing(false));
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener('auth:expired', clearSession);
    return () => window.removeEventListener('auth:expired', clearSession);
  }, [clearSession]);

  const startSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    startSession(res.data.data);
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password });
    startSession(res.data.data);
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      // token is dropped locally either way
    }
    clearSession();
  };

  const value = useMemo(
    () => ({ user, initializing, isAdmin: user?.role === 'admin', login, signup, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export const getApiError = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || (err?.request ? 'Cannot reach the server. Please try again.' : fallback);
