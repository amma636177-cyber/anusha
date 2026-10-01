import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';
import socket from '../utils/socket.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('poolbuy_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and fetch user info
  const loadUser = async () => {
    const savedToken = localStorage.getItem('poolbuy_token');
    if (!savedToken) {
      // Default to guest or pre-login as Anusha for instant demonstration
      await quickLoginAs('anusha@customer.com', 'customer123');
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        socket.emit('join:user', res.user._id);
        if (['admin', 'manager', 'super_admin'].includes(res.user.role)) {
          socket.emit('join:admin');
        }
      }
    } catch (err) {
      console.warn('Auth check session expired:', err.message);
      localStorage.removeItem('poolbuy_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('poolbuy_token', res.token);
      setToken(res.token);
      setUser(res.user);
      socket.emit('join:user', res.user.id || res.user._id);
      if (['admin', 'manager', 'super_admin'].includes(res.user.role)) {
        socket.emit('join:admin');
      }
      return res.user;
    }
  };

  const register = async (name, email, password, referralCode) => {
    const res = await api.post('/auth/register', { name, email, password, referralCode });
    if (res.success) {
      localStorage.setItem('poolbuy_token', res.token);
      setToken(res.token);
      setUser(res.user);
      socket.emit('join:user', res.user.id || res.user._id);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('poolbuy_token');
    setToken(null);
    setUser(null);
  };

  // Demo switch helper
  const quickLoginAs = async (email, password) => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      console.warn('Quick login fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'manager',
      login,
      register,
      logout,
      quickLoginAs,
      refreshUser: loadUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
