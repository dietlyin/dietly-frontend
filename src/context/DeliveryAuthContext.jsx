import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { deliveryAPI } from '../services/api';

const DELIVERY_TOKEN_KEY = 'dietly_delivery_token';
const DELIVERY_AGENT_KEY = 'dietly_delivery_agent';

const DeliveryAuthContext = createContext(null);

const readStoredAgent = () => {
  const stored = localStorage.getItem(DELIVERY_AGENT_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(DELIVERY_AGENT_KEY);
    return null;
  }
};

export function DeliveryAuthProvider({ children }) {
  const [deliveryAgent, setDeliveryAgent] = useState(readStoredAgent);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  const clearDeliverySession = useCallback(() => {
    localStorage.removeItem(DELIVERY_TOKEN_KEY);
    localStorage.removeItem(DELIVERY_AGENT_KEY);
    setDeliveryAgent(null);
  }, []);

  const persistDeliverySession = useCallback((token, deliveryAgentData) => {
    localStorage.setItem(DELIVERY_TOKEN_KEY, token);
    localStorage.setItem(DELIVERY_AGENT_KEY, JSON.stringify(deliveryAgentData));
    setDeliveryAgent(deliveryAgentData);
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    try {
      const { data } = await deliveryAPI.login({ identifier, password });
      persistDeliverySession(data.token, data.data);
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Delivery login failed' };
    } finally {
      setLoading(false);
    }
  }, [persistDeliverySession]);

  const logout = useCallback(() => {
    clearDeliverySession();
  }, [clearDeliverySession]);

  useEffect(() => {
    const token = localStorage.getItem(DELIVERY_TOKEN_KEY);
    if (!token) {
      setHydrating(false);
      return;
    }

    deliveryAPI.getMe()
      .then(({ data }) => {
        setDeliveryAgent(data.data);
        localStorage.setItem(DELIVERY_AGENT_KEY, JSON.stringify(data.data));
      })
      .catch(() => {
        clearDeliverySession();
      })
      .finally(() => {
        setHydrating(false);
      });
  }, [clearDeliverySession]);

  return (
    <DeliveryAuthContext.Provider value={{ deliveryAgent, loading, hydrating, login, logout }}>
      {children}
    </DeliveryAuthContext.Provider>
  );
}

export function useDeliveryAuth() {
  const context = useContext(DeliveryAuthContext);
  if (!context) throw new Error('useDeliveryAuth must be used within DeliveryAuthProvider');
  return context;
}