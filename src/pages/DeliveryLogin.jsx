import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bike, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/dietly-logo.png';

export default function DeliveryLogin() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    // Placeholder — wire to backend when ready
    setTimeout(() => {
      setLoading(false);
      setError('Backend not connected yet. Coming soon.');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <a href="/" className="flex justify-center mb-8">
          <img src={logo} alt="Dietly" className="h-8 w-auto object-contain" />
        </a>

        {/* Header */}
        <div
          className="rounded-2xl p-7 sm:p-9"
          style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 mx-auto"
            style={{ background: 'rgba(176,234,32,0.15)', border: '1px solid rgba(176,234,32,0.35)' }}
          >
            <Bike className="w-6 h-6" style={{ color: '#033603' }} />
          </div>

          <h1 className="font-display font-bold text-xl sm:text-2xl text-center mb-1" style={{ color: '#033603' }}>
            Delivery Partner Login
          </h1>
          <p className="text-sm text-center mb-7" style={{ color: '#6B7280' }}>
            Sign in to your delivery dashboard
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Phone */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Phone Number
              </label>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(0,0,0,0.12)', background: '#FAFAF8' }}>
                <span className="pl-3.5 pr-2 text-sm font-semibold shrink-0" style={{ color: '#6B7280' }}>+91</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="9876543210"
                  className="flex-1 py-3 pr-3.5 bg-transparent text-sm outline-none"
                  style={{ color: '#033603' }}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
                Password
              </label>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(0,0,0,0.12)', background: '#FAFAF8' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="flex-1 pl-3.5 py-3 bg-transparent text-sm outline-none"
                  style={{ color: '#033603' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="px-3.5 transition-colors"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => e.currentTarget.style.color='#374151'}
                  onMouseLeave={e => e.currentTarget.style.color='#9CA3AF'}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs mb-4 rounded-lg px-3 py-2.5" style={{ color: '#b91c1c', background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.15)' }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
              style={{ background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418', boxShadow: '0 4px 14px rgba(176,234,32,0.25)', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background='#C8F530'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background='#b0ea20'; }}
            >
              {loading ? 'Signing in…' : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-5 text-sm" style={{ color: '#6B7280' }}>
          Not a delivery partner?{' '}
          <a href="/" className="font-semibold" style={{ color: '#8cc418' }}
            onMouseEnter={e => e.currentTarget.style.color='#033603'}
            onMouseLeave={e => e.currentTarget.style.color='#8cc418'}
          >
            Back to home
          </a>
        </p>
      </motion.div>
    </div>
  );
}
