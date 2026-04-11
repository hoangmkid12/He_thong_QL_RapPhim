import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    return data;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const loginAsGuest = async (guestData) => {
    const { data } = await api.post('/auth/guest', guestData);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser({ ...data.data.user, isGuest: true });
    return data.data.user;
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  const isAdmin = user && user.vai_tro >= 1;
  const isSystemAdmin = user && user.vai_tro === 2;
  const isCinemaManager = user && user.vai_tro === 3;
  const isClusterManager = user && user.vai_tro === 4;
  const isStaff = user && user.vai_tro === 1;
  const isCustomer = user && user.vai_tro === 0;
  const isGuest = user && user.vai_tro === -1;

  return (
    <AuthContext.Provider value={{
      user, loading, isAdmin, isSystemAdmin, isCinemaManager,
      isClusterManager, isStaff, isCustomer, isGuest,
      isAuthenticated: !!user,
      login, register, logout, loginAsGuest, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
