import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeliveryAuthProvider } from './context/DeliveryAuthContext';
import DeliveryProtectedRoute from './components/DeliveryProtectedRoute';
import Home from './pages/Home';
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryDashboard from './pages/DeliveryDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DeliveryAuthProvider>
          <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-2)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/delivery-login" element={<DeliveryLogin />} />
              <Route
                path="/delivery-dashboard"
                element={(
                  <DeliveryProtectedRoute>
                    <DeliveryDashboard />
                  </DeliveryProtectedRoute>
                )}
              />
            </Routes>
          </div>
        </DeliveryAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
