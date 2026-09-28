import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser();
    else setLoading(false);
  }, []);
  const fetchUser = async () => {
    try { const res = await api.get('/auth/me'); setUser(res.data); } catch { logout(); }
    setLoading(false);
  };
  const login = (token, userData) => { localStorage.setItem('token', token); setUser(userData); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); window.location.href = '/'; };
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);