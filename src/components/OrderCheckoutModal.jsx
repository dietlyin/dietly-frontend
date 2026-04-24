import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Crosshair,
  Loader2,
  MapPinned,
  Navigation,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const PHONE_PATTERN = /^[+]?[\d\s-]{10,15}$/;
const PINCODE_PATTERN = /^\d{6}$/;

const INITIAL_LOCATION = {
  latitude: null,
  longitude: null,
  loading: false,
  error: '',
};

function buildInitialForm(user, plan) {
  return {
    customerName: user?.name || '',
    phone: user?.phone || '',
    addressText: '',
    city: '',
    state: '',
    pincode: '',
    deliverySlot: 'Lunch • 12 PM to 3 PM',
    quantity: 1,
    notes: '',
    planName: plan?.name || '',
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function readGeolocationError(error) {
  if (!error) return 'Unable to capture your location right now.';

  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Please allow location permission and try again.';
    case error.POSITION_UNAVAILABLE:
      return 'Your device could not determine the current location.';
    case error.TIMEOUT:
      return 'Location capture timed out. Please try again.';
    default:
      return 'Unable to capture your location right now.';
  }
}

export default function OrderCheckoutModal({ isOpen, onClose, plan }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => buildInitialForm(user, plan));
  const [location, setLocation] = useState(INITIAL_LOCATION);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successState, setSuccessState] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm(buildInitialForm(user, plan));
    setLocation(INITIAL_LOCATION);
    setError('');
    setSuccessState(null);
  }, [isOpen, user, plan]);

  const totalPrice = useMemo(() => {
    const numericPrice = typeof plan?.price === 'number'
      ? plan.price
      : Number(String(plan?.price || '').replace(/,/g, ''));

    return (Number.isFinite(numericPrice) ? numericPrice : 0) * Number(form.quantity || 1);
  }, [plan, form.quantity]);

  const mapQuery = location.latitude != null && location.longitude != null
    ? `${location.latitude},${location.longitude}`
    : encodeURIComponent(form.addressText || form.planName || 'Dietly order location');

  const embedSrc = `https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`;
  const mapsHref = `https://www.google.com/maps?q=${mapQuery}`;

  const setField = (field) => (event) => {
    const value = field === 'quantity'
      ? Math.max(1, Number(event.target.value || 1))
      : event.target.value;

    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ ...INITIAL_LOCATION, error: 'Geolocation is not supported in this browser.' });
      return;
    }

    setLocation((current) => ({ ...current, loading: true, error: '' }));
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          loading: false,
          error: '',
        });
      },
      (geoError) => {
        setLocation({
          ...INITIAL_LOCATION,
          loading: false,
          error: readGeolocationError(geoError),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!plan?._id) {
      setError('Live plan data is not synced yet. Refresh and try again once the backend plans load.');
      return;
    }

    if (!form.customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    if (!PHONE_PATTERN.test(form.phone.trim())) {
      setError('Enter a valid phone number.');
      return;
    }

    if (!form.addressText.trim()) {
      setError('Address is required for delivery.');
      return;
    }

    if (!form.city.trim() || !form.state.trim() || !PINCODE_PATTERN.test(form.pincode.trim())) {
      setError('City, state, and a valid 6-digit pincode are required.');
      return;
    }

    if (location.latitude == null || location.longitude == null) {
      setError('Please capture your delivery location before placing the order.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        planId: plan._id,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        addressText: form.addressText.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        deliveryLocation: {
          lat: location.latitude,
          lng: location.longitude,
        },
        deliveryAddress: {
          street: form.addressText.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },
        orderDetails: {
          mealPlanName: plan.name,
          quantity: Number(form.quantity || 1),
          specialInstructions: form.notes.trim(),
        },
        quantity: Number(form.quantity || 1),
        deliverySlot: form.deliverySlot,
        notes: form.notes.trim(),
        price: totalPrice,
      };

      const { data } = await ordersAPI.create(payload);
      setSuccessState({
        orderId: data?.data?._id,
        amount: data?.data?.amount ?? totalPrice,
      });
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to place the order right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && plan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(3,54,3,0.60)', backdropFilter: 'blur(8px)' }} />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.24 }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] p-6 sm:p-8"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl transition-colors"
              style={{ color: 'rgba(3,54,3,0.48)' }}
            >
              <X className="w-5 h-5" />
            </button>

            {successState ? (
              <div className="py-6 sm:py-10 text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(176,234,32,0.18)', border: '1px solid rgba(176,234,32,0.40)' }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: '#476107' }} />
                </div>
                <h2 className="font-display text-3xl font-bold mb-3" style={{ color: '#033603' }}>Order placed successfully</h2>
                <p className="text-sm sm:text-base max-w-lg mx-auto leading-7" style={{ color: '#374151' }}>
                  Your order for the {plan.name} plan is captured with GPS coordinates and will be visible to the assigned delivery agent.
                </p>
                <div className="rounded-2xl px-5 py-4 mt-6 max-w-md mx-auto text-left" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Order ID</p>
                  <p className="font-semibold mt-1" style={{ color: '#033603' }}>{successState.orderId || 'Created'}</p>
                  <p className="text-sm mt-4" style={{ color: '#6B7280' }}>Total</p>
                  <p className="font-display text-2xl font-bold mt-1" style={{ color: '#033603' }}>{formatCurrency(successState.amount)}</p>
                </div>
                <div className="flex justify-center mt-7">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-sm"
                    style={{ background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="pr-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: '#8cc418' }}>Checkout</p>
                  <h2 className="font-display text-3xl font-bold mb-2" style={{ color: '#033603' }}>Complete your {plan.name} order</h2>
                  <p className="text-sm sm:text-base leading-7" style={{ color: '#6B7280' }}>
                    Share your delivery location so the rider can navigate accurately. Address text is still required as a fallback.
                  </p>
                </div>

                {error ? (
                  <div className="mt-5 rounded-2xl px-4 py-3 text-sm" style={{ background: 'rgba(185,28,28,0.08)', color: '#991B1B', border: '1px solid rgba(185,28,28,0.16)' }}>
                    {error}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="grid gap-6 mt-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Customer Name</label>
                        <input value={form.customerName} onChange={setField('customerName')} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Phone Number</label>
                        <input value={form.phone} onChange={setField('phone')} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} placeholder="+91 9876543210" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Delivery Address</label>
                      <textarea value={form.addressText} onChange={setField('addressText')} rows={4} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none resize-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} placeholder="House / flat, street, landmark" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>City</label>
                        <input value={form.city} onChange={setField('city')} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>State</label>
                        <input value={form.state} onChange={setField('state')} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Pincode</label>
                        <input value={form.pincode} onChange={setField('pincode')} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} maxLength={6} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Delivery Slot</label>
                        <select value={form.deliverySlot} onChange={setField('deliverySlot')} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }}>
                          <option>Breakfast • 7 AM to 10 AM</option>
                          <option>Lunch • 12 PM to 3 PM</option>
                          <option>Dinner • 7 PM to 10 PM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Quantity</label>
                        <input type="number" min="1" max="30" value={form.quantity} onChange={setField('quantity')} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Total Price</label>
                        <div className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold" style={{ background: '#F4FBE8', color: '#033603', border: '1.5px solid rgba(176,234,32,0.35)' }}>
                          {formatCurrency(totalPrice)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>Special Instructions</label>
                      <textarea value={form.notes} onChange={setField('notes')} rows={3} className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none resize-none" style={{ background: '#FAFAF8', color: '#033603', border: '1.5px solid rgba(0,0,0,0.10)' }} placeholder="Landmark, gate code, delivery preferences" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] p-5" style={{ background: '#FEFCE8', border: '1px solid rgba(255,229,134,0.55)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPinned className="w-4 h-4" style={{ color: '#476107' }} />
                        <h3 className="text-sm font-bold" style={{ color: '#033603' }}>Delivery Location</h3>
                      </div>
                      <p className="text-sm leading-6" style={{ color: '#6B7280' }}>
                        Use your device GPS so the delivery agent can view the exact pin and open navigation immediately.
                      </p>

                      <button
                        type="button"
                        onClick={captureLocation}
                        disabled={location.loading}
                        className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-bold text-sm"
                        style={{ background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418', opacity: location.loading ? 0.75 : 1 }}
                      >
                        {location.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
                        {location.latitude != null ? 'Update Location' : 'Use Current Location'}
                      </button>

                      {location.latitude != null && location.longitude != null ? (
                        <div className="mt-4 rounded-2xl px-4 py-3" style={{ background: '#FFFFFF', border: '1px solid rgba(176,234,32,0.40)' }}>
                          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#476107' }}>
                            <CheckCircle2 className="w-4 h-4" />
                            Location captured
                          </div>
                          <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                            Lat: {location.latitude} | Lng: {location.longitude}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-2xl px-4 py-3 text-sm" style={{ background: 'rgba(255,229,134,0.35)', color: '#7C5A00', border: '1px solid rgba(255,229,134,0.85)' }}>
                          Location is required for accurate delivery. Address text is still captured as fallback.
                        </div>
                      )}

                      {location.error ? (
                        <div className="mt-4 rounded-2xl px-4 py-3 text-sm" style={{ background: 'rgba(185,28,28,0.08)', color: '#991B1B', border: '1px solid rgba(185,28,28,0.16)' }}>
                          {location.error}
                        </div>
                      ) : null}

                      <div className="rounded-2xl overflow-hidden mt-4" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                        <iframe title="Customer location preview" src={embedSrc} className="w-full h-56 border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      </div>

                      <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold" style={{ background: '#FFFFFF', color: '#033603', border: '1px solid rgba(3,54,3,0.14)' }}>
                        <Navigation className="w-4 h-4" />
                        View on Map
                      </a>
                    </div>

                    <div className="rounded-[24px] p-5" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 mt-0.5" style={{ color: '#7C5A00' }} />
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: '#033603' }}>Location permission</h3>
                          <p className="text-sm mt-2 leading-6" style={{ color: '#6B7280' }}>
                            If you deny location access, the checkout stays usable and keeps your address text, but you will need to retry GPS capture before placing the order.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || location.loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-4 font-bold text-sm"
                      style={{ background: '#033603', color: '#FEFCE8', border: '1.5px solid rgba(3,54,3,0.92)', opacity: submitting || location.loading ? 0.75 : 1 }}
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}