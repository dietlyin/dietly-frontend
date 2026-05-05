import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dietly_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('dietly_token', data.token);
      localStorage.setItem('dietly_user', JSON.stringify(data.data));
      setUser(data.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password, phone });
      localStorage.setItem('dietly_token', data.token);
      localStorage.setItem('dietly_user', JSON.stringify(data.data));
      setUser(data.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dietly_token');
    localStorage.removeItem('dietly_user');
    setUser(null);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('dietly_token');
    if (token && !user) {
      authAPI.getMe()
        .then(({ data }) => {
          setUser(data.data);
          localStorage.setItem('dietly_user', JSON.stringify(data.data));
        })
        .catch(() => {
          localStorage.removeItem('dietly_token');
          localStorage.removeItem('dietly_user');
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
