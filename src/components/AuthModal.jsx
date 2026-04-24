import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (mode === 'login') {
      result = await login(form.email, form.password);
    } else {
      result = await register(form.name, form.email, form.password, form.phone);
    }

    if (result.success) {
      onClose();
      setForm({ name: '', email: '', password: '', phone: '' });
    } else {
      setError(result.message);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const inputClass = 'w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all';
  const inputStyle = { background: '#FAFAF8', border: '1.5px solid rgba(0,0,0,0.12)', color: '#033603' };
  const inputFocusClass = 'focus:border-[rgba(3,54,3,0.40)] placeholder:text-[#9CA3AF]';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(3,54,3,0.60)', backdropFilter: 'blur(6px)' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md p-8 sm:p-10"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1rem', boxShadow: '0 24px 60px rgba(0,0,0,0.14)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
              style={{ color: 'rgba(3,54,3,0.45)' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(3,54,3,0.06)'; e.currentTarget.style.color='#033603'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(3,54,3,0.45)'; }}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-2xl mb-2" style={{ color: '#033603' }}>
              {mode === 'login' ? 'Welcome Back' : 'Join Dietly'}
            </h2>
            <p className="text-sm mb-7" style={{ color: '#6B7280' }}>
              {mode === 'login' ? 'Sign in to manage your subscription' : 'Create your account to get started'}
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl border text-sm" style={{ background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.25)', color: '#b91c1c' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(3,54,3,0.45)' }} />
                  <input type="text" placeholder="Full Name" value={form.name} onChange={set('name')} required className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(3,54,3,0.45)' }} />
                <input type="email" placeholder="Email Address" value={form.email} onChange={set('email')} required className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(3,54,3,0.45)' }} />
                <input type="password" placeholder="Password" value={form.password} onChange={set('password')} required minLength={6} className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
              </div>
              {mode === 'register' && (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(3,54,3,0.45)' }} />
                  <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} className={`${inputClass} ${inputFocusClass}`} style={inputStyle} />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418', boxShadow: '0 4px 14px rgba(176,234,32,0.35)' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#6B7280' }}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="font-bold transition-colors"
                style={{ color: '#8cc418' }}
                onMouseEnter={e => e.currentTarget.style.color='#033603'}
                onMouseLeave={e => e.currentTarget.style.color='#8cc418'}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
