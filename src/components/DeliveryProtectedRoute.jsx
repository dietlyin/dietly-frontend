import { Navigate, useLocation } from 'react-router-dom';
import { Bike } from 'lucide-react';
import { useDeliveryAuth } from '../context/DeliveryAuthContext';

export default function DeliveryProtectedRoute({ children }) {
  const location = useLocation();
  const { deliveryAgent, hydrating } = useDeliveryAuth();

  if (hydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
        <div className="card max-w-sm w-full p-8 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(176,234,32,0.18)', border: '1px solid rgba(176,234,32,0.35)' }}
          >
            <Bike className="w-7 h-7" style={{ color: '#033603' }} />
          </div>
          <h1 className="font-display text-xl font-bold mb-2" style={{ color: '#033603' }}>Loading delivery access</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>Checking your rider session and assigned deliveries.</p>
        </div>
      </div>
    );
  }

  if (!deliveryAgent) {
    return <Navigate to="/delivery-login" replace state={{ from: location.pathname }} />;
  }

  return children;
}