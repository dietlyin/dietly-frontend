import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const ADMIN_TOKEN_KEY = 'dietly_admin_token';
const ADMIN_USER_KEY = 'dietly_admin_user';

const AdminAuthContext = createContext(null);

const readStoredAdmin = () => {
  const stored = localStorage.getItem(ADMIN_USER_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
};

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(readStoredAdmin);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  const clearAdminSession = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdminUser(null);
  }, []);

  const persistAdminSession = useCallback((token, adminData) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));
    setAdminUser(adminData);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.login({ email, password });

      if (data?.data?.role !== 'admin') {
        return { success: false, message: 'This account does not have admin access.' };
      }

      persistAdminSession(data.token, data.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Admin login failed' };
    } finally {
      setLoading(false);
    }
  }, [persistAdminSession]);

  const logout = useCallback(() => {
    clearAdminSession();
  }, [clearAdminSession]);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setHydrating(false);
      return;
    }

    adminAPI.getMe()
      .then(({ data }) => {
        if (data?.data?.role !== 'admin') {
          clearAdminSession();
          return;
        }

        setAdminUser(data.data);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.data));
      })
      .catch(() => {
        clearAdminSession();
      })
      .finally(() => {
        setHydrating(false);
      });
  }, [clearAdminSession]);

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, hydrating, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}
