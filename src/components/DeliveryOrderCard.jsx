import {
  CircleCheckBig,
  Clock3,
  IndianRupee,
  MapPinned,
  Navigation,
  Phone,
  UserRound,
} from 'lucide-react';

const STATUS_STYLES = {
  pending: { background: 'rgba(255,229,134,0.35)', color: '#7C5A00', border: '1px solid rgba(255,229,134,0.85)' },
  confirmed: { background: 'rgba(255,229,134,0.35)', color: '#7C5A00', border: '1px solid rgba(255,229,134,0.85)' },
  preparing: { background: 'rgba(255,229,134,0.35)', color: '#7C5A00', border: '1px solid rgba(255,229,134,0.85)' },
  'out-for-delivery': { background: 'rgba(176,234,32,0.20)', color: '#476107', border: '1px solid rgba(176,234,32,0.55)' },
  delivered: { background: 'rgba(3,54,3,0.08)', color: '#033603', border: '1px solid rgba(3,54,3,0.12)' },
  cancelled: { background: 'rgba(185,28,28,0.08)', color: '#991B1B', border: '1px solid rgba(185,28,28,0.18)' },
};

const PAYMENT_STYLES = {
  pending: { background: 'rgba(255,229,134,0.35)', color: '#7C5A00' },
  paid: { background: 'rgba(176,234,32,0.18)', color: '#476107' },
  failed: { background: 'rgba(185,28,28,0.08)', color: '#991B1B' },
  refunded: { background: 'rgba(55,65,81,0.08)', color: '#374151' },
};

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value || 0);

const formatStatus = (status) => String(status || 'pending').replace(/-/g, ' ');

const getAddressText = (order) => (
  [
    order.addressText,
    order.deliveryAddress?.street,
    order.deliveryAddress?.city,
    order.deliveryAddress?.state,
    order.deliveryAddress?.pincode,
  ].filter(Boolean).join(', ')
);

const getMapsData = (order) => {
  const lat = order.latitude ?? order.deliveryLocation?.lat;
  const lng = order.longitude ?? order.deliveryLocation?.lng;
  const address = getAddressText(order);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return {
      embedSrc: `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`,
      viewHref: `https://www.google.com/maps?q=${lat},${lng}`,
      directionsHref: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      hasCoordinates: true,
    };
  }

  const query = encodeURIComponent(address || order.customerName || 'Dietly delivery customer');
  return {
    embedSrc: `https://www.google.com/maps?q=${query}&z=15&output=embed`,
    viewHref: `https://www.google.com/maps/search/?api=1&query=${query}`,
    directionsHref: `https://www.google.com/maps/search/?api=1&query=${query}`,
    hasCoordinates: false,
  };
};

const getCallHref = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;

const getDeliveryPricing = (order) => ({
  planAmount: order.pricing?.planAmount ?? Math.max((order.amount || 0) - (order.pricing?.deliveryCharge || 0), 0),
  deliveryCharge: order.pricing?.deliveryCharge ?? 0,
  totalAmount: order.pricing?.totalAmount ?? order.amount ?? 0,
  distanceKm: order.pricing?.distanceKm,
  freeDeliveryRadiusKm: order.pricing?.freeDeliveryRadiusKm ?? 2,
  isFreeDelivery: order.pricing?.isFreeDelivery ?? !(order.pricing?.deliveryCharge > 0),
});

export default function DeliveryOrderCard({ order, updating, onAdvanceStatus }) {
  const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
  const paymentStyle = PAYMENT_STYLES[order.paymentStatus] || PAYMENT_STYLES.pending;
  const addressText = getAddressText(order) || 'Delivery address not added yet';
  const mapsData = getMapsData(order);
  const customerPhone = order.customerPhone || order.user?.phone || 'Not available';
  const customerName = order.customerName || order.user?.name || 'Dietly customer';
  const canStartDelivery = ['pending', 'confirmed', 'preparing'].includes(order.status);
  const canMarkDelivered = order.status === 'out-for-delivery';
  const isDelivered = order.status === 'delivered';
  const deliveryPricing = getDeliveryPricing(order);
  const coordinateText = mapsData.hasCoordinates
    ? `${order.latitude ?? order.deliveryLocation?.lat}, ${order.longitude ?? order.deliveryLocation?.lng}`
    : 'Location not available';

  return (
    <article
      className="card p-5 sm:p-6 flex flex-col gap-5"
      style={{ borderColor: 'rgba(3,54,3,0.08)', boxShadow: '0 10px 30px rgba(3,54,3,0.06)' }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: '#8cc418' }}>
            Order #{String(order._id).slice(-6).toUpperCase()}
          </p>
          <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#033603' }}>
            {order.orderDetails?.mealPlanName || order.plan?.name || 'Diet Plan Subscription'}
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Quantity: {order.orderDetails?.quantity || 1} • Delivery time: {order.deliverySlot || 'To be confirmed'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize" style={statusStyle}>
            {formatStatus(order.status)}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize" style={paymentStyle}>
            Payment {formatStatus(order.paymentStatus)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <UserRound className="w-4 h-4" style={{ color: '#8cc418' }} />
              <h3 className="text-sm font-bold" style={{ color: '#033603' }}>Customer Details</h3>
            </div>
            <p className="font-semibold text-base" style={{ color: '#033603' }}>{customerName}</p>
            <p className="text-sm mt-1" style={{ color: '#374151' }}>{customerPhone}</p>
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock3 className="w-4 h-4" style={{ color: '#8cc418' }} />
              <h3 className="text-sm font-bold" style={{ color: '#033603' }}>Delivery Info</h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="rounded-xl px-3 py-2.5" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#8cc418' }}>Location Name</p>
                <p className="mt-1 font-medium" style={{ color: '#033603' }}>{order.deliveryLocationName || 'Not provided'}</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#8cc418' }}>Address</p>
                <p className="mt-1 leading-6" style={{ color: '#374151' }}>{addressText}</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#8cc418' }}>GPS & Notes</p>
                <p className="mt-1" style={{ color: mapsData.hasCoordinates ? '#6B7280' : '#991B1B' }}>Coordinates: {coordinateText}</p>
                <p className="mt-2" style={{ color: '#6B7280' }}>Instructions: {order.orderDetails?.specialInstructions || order.notes || 'No special instructions'}</p>
              </div>
            </div>
            {!mapsData.hasCoordinates ? (
              <div className="mt-3 rounded-2xl px-3 py-2.5 text-xs" style={{ background: 'rgba(255,229,134,0.35)', color: '#7C5A00', border: '1px solid rgba(255,229,134,0.85)' }}>
                Location not available. Delivery can still use the text address, but GPS precision is missing for this order.
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-4 h-4" style={{ color: '#8cc418' }} />
              <h3 className="text-sm font-bold" style={{ color: '#033603' }}>Pricing</h3>
            </div>
            <div className="space-y-2 text-sm" style={{ color: '#374151' }}>
              <div className="flex items-center justify-between gap-3">
                <span>Subscription</span>
                <span className="font-semibold" style={{ color: '#033603' }}>{formatCurrency(deliveryPricing.planAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{deliveryPricing.isFreeDelivery ? `Delivery within ${deliveryPricing.freeDeliveryRadiusKm} km` : 'Delivery charge'}</span>
                <span className="font-semibold" style={{ color: deliveryPricing.isFreeDelivery ? '#476107' : '#7C5A00' }}>
                  {deliveryPricing.isFreeDelivery ? 'Free' : formatCurrency(deliveryPricing.deliveryCharge)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Distance from kitchen</span>
                <span className="font-semibold" style={{ color: '#033603' }}>{deliveryPricing.distanceKm != null ? `${deliveryPricing.distanceKm} km` : 'Not calculated'}</span>
              </div>
            </div>
            <p className="text-2xl font-display font-bold mt-4" style={{ color: '#033603' }}>{formatCurrency(deliveryPricing.totalAmount)}</p>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Collected status: {formatStatus(order.paymentStatus)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#F4FBE8' }}>
              <MapPinned className="w-4 h-4" style={{ color: '#476107' }} />
              <h3 className="text-sm font-bold" style={{ color: '#033603' }}>Location Preview</h3>
            </div>
            <iframe
              title={`Map for ${customerName}`}
              src={mapsData.embedSrc}
              className="w-full h-56 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href={getCallHref(customerPhone)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-semibold text-sm transition-all duration-300"
              style={{ background: '#FFFFFF', color: '#033603', border: '1px solid rgba(3,54,3,0.14)' }}
            >
              <Phone className="w-4 h-4" />
              Call Customer
            </a>

            <a
              href={mapsData.viewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-semibold text-sm transition-all duration-300"
              style={{ background: '#FFFFFF', color: '#033603', border: '1px solid rgba(3,54,3,0.14)' }}
            >
              <MapPinned className="w-4 h-4" />
              View on Map
            </a>

            <a
              href={mapsData.directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-semibold text-sm transition-all duration-300"
              style={{ background: '#FFFFFF', color: '#033603', border: '1px solid rgba(3,54,3,0.14)' }}
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!canStartDelivery || updating}
              onClick={() => onAdvanceStatus(order._id, 'out-for-delivery')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-4 font-semibold text-sm transition-all duration-300"
              style={{
                background: canStartDelivery ? '#FFFFFF' : 'rgba(3,54,3,0.05)',
                color: '#033603',
                border: '1px solid rgba(3,54,3,0.14)',
                opacity: !canStartDelivery || updating ? 0.6 : 1,
              }}
            >
              <Navigation className="w-4 h-4" />
              {canStartDelivery ? 'Move to Out for Delivery' : 'Out for Delivery'}
            </button>

            <button
              type="button"
              disabled={!canMarkDelivered || updating || isDelivered}
              onClick={() => onAdvanceStatus(order._id, 'delivered')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-4 font-bold text-sm transition-all duration-300"
              style={{
                background: canMarkDelivered ? '#b0ea20' : (isDelivered ? 'rgba(3,54,3,0.06)' : 'rgba(176,234,32,0.10)'),
                color: '#033603',
                border: canMarkDelivered ? '1.5px solid #8cc418' : '1px solid rgba(3,54,3,0.1)',
                boxShadow: canMarkDelivered ? '0 6px 18px rgba(176,234,32,0.28)' : 'none',
                opacity: !canMarkDelivered || updating ? 0.7 : 1,
              }}
            >
              <CircleCheckBig className="w-4 h-4" />
              {isDelivered ? 'Delivered' : (updating && canMarkDelivered ? 'Updating status...' : 'Mark as Delivered')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}