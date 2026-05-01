import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarClock, CreditCard, LogOut, RefreshCw, ShieldCheck, ShoppingCart, Users } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useAdminAuth } from '../context/AdminAuthContext';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value || 0);

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminDashboard() {
  const { adminUser, logout } = useAdminAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data } = await adminAPI.getDashboard();
      setDashboard(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = useMemo(() => {
    const kpis = dashboard?.kpis || {};
    return [
      { label: 'Total Users', value: kpis.totalUsers || 0, icon: Users },
      { label: 'Active Users', value: kpis.activeUsers || 0, icon: ShieldCheck },
      { label: 'Total Orders', value: kpis.totalOrders || 0, icon: ShoppingCart },
      { label: 'Delivered Orders', value: kpis.deliveredOrders || 0, icon: CalendarClock },
      { label: 'Total Revenue', value: formatCurrency(kpis.totalRevenue || 0), icon: CreditCard },
      { label: 'Active Plans', value: kpis.activePlans || 0, icon: BarChart3 },
    ];
  }, [dashboard]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FEFCE8 0%, #FAFAF8 100%)' }}>
      <div className="section-container py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-5"
        >
          <header className="card p-5 sm:p-6" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ background: 'rgba(176,234,32,0.18)', color: '#476107' }}>
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#033603' }}>
                  Welcome, {adminUser?.name || 'Admin'}
                </h1>
                <p className="text-sm sm:text-base max-w-2xl leading-7" style={{ color: '#374151' }}>
                  Monitor registrations, active subscribers, orders, plan purchases, revenue, contacts, and partnership pipeline in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => loadDashboard({ silent: true })}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-semibold text-sm"
                  style={{ background: '#FFFFFF', color: '#033603', border: '1px solid rgba(3,54,3,0.12)' }}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-semibold text-sm"
                  style={{ background: '#FFFFFF', color: '#033603', border: '1px solid rgba(3,54,3,0.12)' }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          {error ? (
            <div className="rounded-2xl px-4 py-3 text-sm" style={{ color: '#991B1B', background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.16)' }}>
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="card p-10 text-center" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(176,234,32,0.18)' }}>
                <RefreshCw className="w-6 h-6 animate-spin" style={{ color: '#476107' }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#033603' }}>Loading admin analytics</h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>Pulling latest users, subscriptions, orders, and revenue metrics.</p>
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="card p-5" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium" style={{ color: '#6B7280' }}>{item.label}</p>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(176,234,32,0.16)' }}>
                          <Icon className="w-5 h-5" style={{ color: '#476107' }} />
                        </div>
                      </div>
                      <p className="font-display text-3xl font-bold" style={{ color: '#033603' }}>{item.value}</p>
                    </div>
                  );
                })}
              </section>

              <section className="grid gap-5 lg:grid-cols-2">
                <div className="card p-5" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
                  <h2 className="font-display text-xl font-bold mb-4" style={{ color: '#033603' }}>Plan Purchases</h2>
                  <div className="space-y-3">
                    {(dashboard?.planPerformance || []).length ? (
                      dashboard.planPerformance.map((plan) => (
                        <div key={plan._id || plan.slug || plan.name} className="rounded-xl px-3 py-3 flex items-center justify-between" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                          <div>
                            <p className="font-semibold" style={{ color: '#033603' }}>{plan.name || 'Unknown Plan'}</p>
                            <p className="text-xs" style={{ color: '#6B7280' }}>{plan.purchases} purchases</p>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: '#374151' }}>{formatCurrency(plan.revenue)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: '#6B7280' }}>No plan purchases found yet.</p>
                    )}
                  </div>
                </div>

                <div className="card p-5" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
                  <h2 className="font-display text-xl font-bold mb-4" style={{ color: '#033603' }}>Order Pipeline</h2>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl p-3" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <p style={{ color: '#6B7280' }}>Pending</p>
                      <p className="font-display text-2xl font-bold" style={{ color: '#033603' }}>{dashboard?.kpis?.pendingOrders || 0}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <p style={{ color: '#6B7280' }}>Preparing</p>
                      <p className="font-display text-2xl font-bold" style={{ color: '#033603' }}>{dashboard?.kpis?.preparingOrders || 0}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <p style={{ color: '#6B7280' }}>Out for Delivery</p>
                      <p className="font-display text-2xl font-bold" style={{ color: '#033603' }}>{dashboard?.kpis?.outForDeliveryOrders || 0}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <p style={{ color: '#6B7280' }}>Cancelled</p>
                      <p className="font-display text-2xl font-bold" style={{ color: '#033603' }}>{dashboard?.kpis?.cancelledOrders || 0}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: 'rgba(176,234,32,0.12)', border: '1px solid rgba(176,234,32,0.35)' }}>
                    <p style={{ color: '#374151' }}>
                      Contacts pending: <strong>{dashboard?.kpis?.newContacts || 0}</strong> | Gym applications pending: <strong>{dashboard?.kpis?.pendingGymApplications || 0}</strong>
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-2">
                <div className="card p-5" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
                  <h2 className="font-display text-xl font-bold mb-4" style={{ color: '#033603' }}>Recent Users</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: '#6B7280' }}>
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Role</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dashboard?.recentUsers || []).map((user) => (
                          <tr key={user._id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                            <td className="py-2" style={{ color: '#374151' }}>{user.name || '-'}</td>
                            <td className="py-2" style={{ color: '#374151' }}>{user.role || 'user'}</td>
                            <td className="py-2" style={{ color: '#374151' }}>{user.subscriptionStatus || 'none'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card p-5" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
                  <h2 className="font-display text-xl font-bold mb-4" style={{ color: '#033603' }}>Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: '#6B7280' }}>
                          <th className="text-left py-2">Customer</th>
                          <th className="text-left py-2">Plan</th>
                          <th className="text-left py-2">Amount</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dashboard?.recentOrders || []).map((order) => (
                          <tr key={order._id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                            <td className="py-2" style={{ color: '#374151' }}>
                              <p>{order.user?.name || '-'}</p>
                              <p className="text-xs" style={{ color: '#6B7280' }}>{formatDateTime(order.createdAt)}</p>
                            </td>
                            <td className="py-2" style={{ color: '#374151' }}>{order.plan?.name || '-'}</td>
                            <td className="py-2" style={{ color: '#374151' }}>{formatCurrency(order.amount)}</td>
                            <td className="py-2" style={{ color: '#374151' }}>{order.status || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
