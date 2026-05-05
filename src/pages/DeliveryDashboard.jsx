import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bike, LogOut, Package, RefreshCw, Route, ShieldCheck } from 'lucide-react';
import { useDeliveryAuth } from '../context/DeliveryAuthContext';
import DeliveryOrderCard from '../components/DeliveryOrderCard';
import { deliveryAPI } from '../services/api';

const DELIVERY_ORDERS_CACHE_KEY = 'dietly_delivery_orders_cache';

const readCachedOrders = () => {
  const cached = localStorage.getItem(DELIVERY_ORDERS_CACHE_KEY);
  if (!cached) return [];

  try {
    return JSON.parse(cached);
  } catch {
    localStorage.removeItem(DELIVERY_ORDERS_CACHE_KEY);
    return [];
  }
};

export default function DeliveryDashboard() {
  const { deliveryAgent, logout } = useDeliveryAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [error, setError] = useState('');
  const [usingCache, setUsingCache] = useState(false);

  const syncCache = (nextOrders) => {
    localStorage.setItem(DELIVERY_ORDERS_CACHE_KEY, JSON.stringify(nextOrders));
  };

  const loadOrders = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data } = await deliveryAPI.getOrders();
      setOrders(data.data || []);
      syncCache(data.data || []);
      setUsingCache(false);
      setError('');
    } catch (err) {
      const cachedOrders = readCachedOrders();
      if (cachedOrders.length) {
        setOrders(cachedOrders);
        setUsingCache(true);
        setError('Live delivery data is unavailable. Showing your last synced assignments.');
      } else {
        setOrders([]);
        setUsingCache(false);
        setError(err.response?.data?.message || 'Unable to load assigned orders right now.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAdvanceStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await deliveryAPI.updateOrderStatus({ orderId, status });
      const nextOrders = orders.map((order) => (
        order._id === orderId ? data.data : order
      ));
      setOrders(nextOrders);
      syncCache(nextOrders);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update delivery status.');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const assignedCount = orders.length;
  const inTransitCount = orders.filter((order) => order.status === 'out-for-delivery').length;
  const deliveredCount = orders.filter((order) => order.status === 'delivered').length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FEFCE8 0%, #FAFAF8 100%)' }}>
      <div className="section-container py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-4 sm:gap-5"
        >
          <header className="card p-5 sm:p-6" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ background: 'rgba(176,234,32,0.18)', color: '#476107' }}>
                  <ShieldCheck className="w-4 h-4" />
                  Delivery Agent Dashboard
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#033603' }}>
                  Welcome back, {deliveryAgent?.name?.split(' ')[0] || 'Rider'}
                </h1>
                <p className="text-sm sm:text-base max-w-2xl leading-7" style={{ color: '#374151' }}>
                  View assigned orders, call customers, open navigation, and update delivery progress without touching the customer-facing site.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => loadOrders({ silent: true })}
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

            <div className="grid gap-3 mt-6 sm:grid-cols-3">
              {[
                { label: 'Assigned Orders', value: assignedCount, icon: Package },
                { label: 'Out for Delivery', value: inTransitCount, icon: Route },
                { label: 'Completed Today', value: deliveredCount, icon: Bike },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl p-4" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-sm font-semibold" style={{ color: '#374151' }}>{item.label}</span>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(176,234,32,0.18)' }}>
                        <Icon className="w-5 h-5" style={{ color: '#476107' }} />
                      </div>
                    </div>
                    <p className="font-display text-3xl font-bold" style={{ color: '#033603' }}>{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 mt-5 text-sm" style={{ color: '#6B7280' }}>
              <span>Zone: {deliveryAgent?.zone || 'Assigned zone pending'}</span>
              <span>Vehicle: {deliveryAgent?.vehicleType || 'bike'}</span>
              {usingCache ? <span style={{ color: '#7C5A00' }}>Offline fallback active</span> : null}
            </div>
          </header>

          {error ? (
            <div className="rounded-2xl px-4 py-3 text-sm" style={{ color: usingCache ? '#7C5A00' : '#991B1B', background: usingCache ? 'rgba(255,229,134,0.35)' : 'rgba(185,28,28,0.08)', border: usingCache ? '1px solid rgba(255,229,134,0.85)' : '1px solid rgba(185,28,28,0.16)' }}>
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="card p-10 text-center" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(176,234,32,0.18)' }}>
                <RefreshCw className="w-6 h-6 animate-spin" style={{ color: '#476107' }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#033603' }}>Loading assigned deliveries</h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>Fetching the latest customer addresses, payment state, and delivery tasks.</p>
            </div>
          ) : orders.length ? (
            <div className="grid gap-5">
              {orders.map((order) => (
                <DeliveryOrderCard
                  key={order._id}
                  order={order}
                  updating={updatingOrderId === order._id}
                  onAdvanceStatus={handleAdvanceStatus}
                />
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center" style={{ borderColor: 'rgba(3,54,3,0.08)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(176,234,32,0.18)' }}>
                <Package className="w-6 h-6" style={{ color: '#476107' }} />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#033603' }}>No deliveries assigned yet</h2>
              <p className="text-sm max-w-lg mx-auto leading-7" style={{ color: '#6B7280' }}>
                New orders assigned to your rider account will appear here with customer phone, address, map preview, and action buttons.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}