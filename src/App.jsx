import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeliveryAuthProvider } from './context/DeliveryAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import DeliveryProtectedRoute from './components/DeliveryProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Home from './pages/Home';
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DeliveryAuthProvider>
          <AdminAuthProvider>
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
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={(
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  )}
                />
              </Routes>
            </div>
          </AdminAuthProvider>
        </DeliveryAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
