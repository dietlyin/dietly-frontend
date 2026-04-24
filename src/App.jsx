import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import DeliveryLogin from './pages/DeliveryLogin';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-2)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/delivery-login" element={<DeliveryLogin />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
