import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bike, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/dietly-logo.png';
import { useDeliveryAuth } from '../context/DeliveryAuthContext';

const isValidIdentifier = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes('@')) return /^\S+@\S+\.\S+$/.test(trimmed);
  return /^\+?[\d\s-]{10,15}$/.test(trimmed);
};

export default function DeliveryLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deliveryAgent, loading, login } = useDeliveryAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (deliveryAgent) {
      navigate('/delivery-dashboard', { replace: true });
    }
  }, [deliveryAgent, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidIdentifier(form.identifier)) {
      setError('Enter a valid delivery phone number or email.');
      return;
    }

    if (!form.password) {
      setError('Password is required.');
      return;
    }

    const result = await login(form.identifier.trim(), form.password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(location.state?.from || '/delivery-dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(180deg, #FEFCE8 0%, #FAFAF8 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex justify-center mb-8">
          <img src={logo} alt="Dietly" className="h-9 w-auto object-contain" />
        </Link>

        <div
          className="rounded-[28px] p-7 sm:p-9"
          style={{ background: '#FFFFFF', border: '1px solid rgba(3,54,3,0.08)', boxShadow: '0 16px 40px rgba(3,54,3,0.08)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(176,234,32,0.18)', border: '1px solid rgba(176,234,32,0.36)' }}
          >
            <Bike className="w-7 h-7" style={{ color: '#033603' }} />
          </div>

          <h1 className="font-display font-bold text-2xl text-center mb-2" style={{ color: '#033603' }}>
            Delivery Partner Login
          </h1>
          <p className="text-sm text-center mb-7 leading-6" style={{ color: '#6B7280' }}>
            Sign in with your assigned phone number or email to access deliveries, customer details, and navigation links.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>
                Phone Number or Email
              </label>
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                placeholder="9876543210 or rider@dietly.in"
                autoComplete="username"
                className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none"
                style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(3,54,3,0.12)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>
                Password
              </label>
              <div className="flex items-center rounded-2xl overflow-hidden" style={{ background: '#FAFAF8', border: '1.5px solid rgba(3,54,3,0.12)' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="flex-1 px-4 py-3.5 bg-transparent text-sm outline-none"
                  style={{ color: '#033603' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="px-4 py-3"
                  style={{ color: '#6B7280' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl px-4 py-3 text-sm" style={{ color: '#991B1B', background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.16)' }}>
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-4 font-bold text-sm transition-all duration-300"
              style={{ background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418', boxShadow: '0 8px 22px rgba(176,234,32,0.24)', opacity: loading ? 0.75 : 1 }}
            >
              {loading ? 'Signing in...' : 'Login to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between gap-3 mt-5 text-sm">
            <a
              href="mailto:support@dietly.in?subject=Delivery%20Partner%20Password%20Reset"
              className="inline-flex items-center gap-2 font-semibold"
              style={{ color: '#476107' }}
            >
              <KeyRound className="w-4 h-4" />
              Forgot Password
            </a>
            <Link to="/" className="font-semibold" style={{ color: '#033603' }}>
              Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
