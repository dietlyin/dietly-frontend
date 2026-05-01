import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLogin() {
  const { login, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const from = location.state?.from || '/admin/dashboard';

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const result = await login(form.email, form.password);
    if (!result.success) {
      setError(result.message || 'Unable to login');
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(160deg, #F4FBE8 0%, #FAFAF8 100%)' }}>
      <div className="card w-full max-w-md p-8" style={{ borderColor: 'rgba(3,54,3,0.12)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(176,234,32,0.18)', border: '1px solid rgba(176,234,32,0.35)' }}
          >
            <ShieldCheck className="w-6 h-6" style={{ color: '#033603' }} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: '#033603' }}>Admin Login</h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>Dietly control panel access</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: '#374151' }}>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl px-3 py-3 border outline-none"
              style={{ borderColor: 'rgba(0,0,0,0.12)', background: '#fff' }}
              placeholder="admin@dietly.in"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: '#374151' }}>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl px-3 py-3 border outline-none"
              style={{ borderColor: 'rgba(0,0,0,0.12)', background: '#fff' }}
              placeholder="Enter admin password"
            />
          </label>

          {error ? (
            <div className="rounded-xl px-3 py-2 text-sm" style={{ color: '#991B1B', background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.16)' }}>
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold"
            style={{
              background: '#b0ea20',
              color: '#033603',
              border: '1.5px solid #8cc418',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in as Admin'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
