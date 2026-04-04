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

  const inputClass = 'w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-white/[0.08] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-green/40 transition-colors';

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
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md card p-8 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <X className="w-5 h-5 text-neutral-500" />
            </button>

            <h2 className="font-display font-bold text-2xl mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join Dietly'}
            </h2>
            <p className="text-sm text-neutral-500 mb-7">
              {mode === 'login' ? 'Sign in to manage your subscription' : 'Create your account to get started'}
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="text" placeholder="Full Name" value={form.name} onChange={set('name')} required className={inputClass} />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input type="email" placeholder="Email Address" value={form.email} onChange={set('email')} required className={inputClass} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input type="password" placeholder="Password" value={form.password} onChange={set('password')} required minLength={6} className={inputClass} />
              </div>
              {mode === 'register' && (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} className={inputClass} />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-green text-neutral-950 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-green-light transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-neutral-500 mt-6">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-brand-green hover:text-brand-green-light transition-colors font-medium"
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
