import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthModal from './AuthModal';
import OrderCheckoutModal from './OrderCheckoutModal';
import { useAuth } from '../context/AuthContext';
import useAPI from '../hooks/useAPI';
import { plansAPI } from '../services/api';

import imgBasic from '../assets/dietly/plan-basic.webp';
import imgStandard from '../assets/dietly/plan-standard.webp';
import imgPremium from '../assets/dietly/plan-premium.webp';

const PLAN_IMAGES = [imgBasic, imgStandard, imgPremium];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919000000000';
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I want to subscribe to a Dietly diet plan')}`;

const fallbackPlans = [
  {
    name: 'Basic',
    price: 1299,
    period: '/month',
    description: 'Get started with clean eating.',
    popular: false,
    features: [
      '1 meal per day',
      'Fixed delivery time',
      'Standard diet plan',
      'Weekly menu rotation',
      'WhatsApp support',
    ],
  },
  {
    name: 'Standard',
    price: 1500,
    period: '/month',
    description: 'Most popular. Tailored to your goals.',
    popular: true,
    features: [
      'Everything in Basic',
      'Custom delivery time',
      'Personalized diet plan',
      'Daily food variation',
      '2 free extra deliveries/mo',
      'Priority support',
    ],
  },
  {
    name: 'Premium',
    price: 2999,
    period: '/month',
    description: 'The ultimate nutrition experience.',
    popular: false,
    features: [
      'Everything in Standard',
      'Full day meals (B/L/D)',
      'Fully customized diet',
      'Protein & supplement support',
      'On-demand food ordering',
      'Dedicated nutritionist',
    ],
  },
];

function PlanCard({ plan, index, inView, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.1 * index }}
      className="card overflow-hidden flex flex-col relative group"
      style={plan.popular
        ? { borderColor: 'rgba(176,234,32,0.50)', background: '#F4FBE8', boxShadow: '0 8px 32px rgba(176,234,32,0.16)' }
        : {}
      }
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: '#b0ea20' }} />
      )}
      <div className="p-3 pb-0 sm:p-4 sm:pb-0">
        <div className="aspect-[16/6] overflow-hidden rounded-[22px] shadow-[0_16px_34px_rgba(0,0,0,0.12)]">
          <img
            src={PLAN_IMAGES[index]}
            alt={`${plan.name} plan meal preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        {plan.popular && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: '#b0ea20', color: '#033603', border: '1px solid #8cc418' }}>
              MOST POPULAR
            </span>
          </div>
        )}
        <h3 className="font-display font-bold text-xl mb-1" style={{ color: '#033603' }}>{plan.name}</h3>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{plan.description}</p>
        <div className="flex items-baseline gap-1 mb-5">
          <span className="font-semibold" style={{ color: '#6B7280' }}>Rs.</span>
          <span className="font-display font-bold text-4xl tracking-tight" style={{ color: '#033603' }}>
            {typeof plan.price === 'number' ? plan.price.toLocaleString('en-IN') : plan.price}
          </span>
          <span style={{ color: '#6B7280' }}>{plan.period}</span>
        </div>
        <div className="h-px mb-4" style={{ background: 'rgba(0,0,0,0.07)' }} />
        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: '#F4FBE8', border: '1px solid rgba(176,234,32,0.35)' }}>
                <Check className="w-3 h-3" style={{ color: '#033603' }} />
              </div>
              <span style={{ color: '#374151' }}>{f}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onSelect(plan)}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
          style={plan.popular
            ? { background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418', boxShadow: '0 4px 14px rgba(176,234,32,0.30)' }
            : { border: '1.5px solid rgba(0,0,0,0.14)', color: '#374151', background: 'transparent' }
          }
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function PlansSlider() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: apiPlans } = useAPI(plansAPI.getAll, fallbackPlans);
  const { user } = useAuth();
  const [active, setActive] = useState(1);
  const [direction, setDirection] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pendingPlan, setPendingPlan] = useState(null);
  const plans = apiPlans;

  const goTo = useCallback((idx) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % plans.length);
  }, [plans.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + plans.length) % plans.length);
  }, [plans.length]);

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [inView, next]);

  const handleSelectPlan = useCallback((selected) => {
    if (!user) {
      setPendingPlan(selected);
      setAuthOpen(true);
      return;
    }

    setSelectedPlan(selected);
  }, [user]);

  const handleAuthClose = useCallback(() => {
    setAuthOpen(false);
    if (!user) {
      setPendingPlan(null);
    }
  }, [user]);

  const handleAuthSuccess = useCallback(() => {
    if (pendingPlan) {
      setSelectedPlan(pendingPlan);
      setPendingPlan(null);
    }
  }, [pendingPlan]);

  const plan = plans[active];
  if (!plan) return null;

  const variants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section id="plans" className="section-spacing overflow-hidden scroll-mt-20">
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="badge mb-5 inline-flex">Pricing</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4" style={{ color: '#033603' }}>
            Choose Your <span style={{ color: '#b0ea20', WebkitTextStroke: '1px #8cc418' }}>Plan</span>
          </h2>
          <p className="max-w-lg mx-auto text-sm sm:text-lg" style={{ color: '#374151' }}>
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((p, i) => (
            <PlanCard key={p.name} plan={p} index={i} inView={inView} onSelect={handleSelectPlan} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative max-w-md mx-auto md:hidden"
        >
          <button onClick={prev} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ border: '1.5px solid rgba(0,0,0,0.12)', color: '#6B7280' }} aria-label="Previous plan">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ border: '1.5px solid rgba(0,0,0,0.12)', color: '#6B7280' }} aria-label="Next plan">
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="min-h-[560px] relative mx-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={active} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: 'easeInOut' }} className="absolute inset-0">
                <div className="card h-full overflow-hidden flex flex-col" style={plan.popular ? { borderColor: 'rgba(176,234,32,0.50)', background: '#F4FBE8', boxShadow: '0 4px 24px rgba(176,234,32,0.12)' } : {}}>
                  <div className="p-3 pb-0">
                    <div className="aspect-[16/6] overflow-hidden rounded-[22px] shadow-[0_14px_28px_rgba(0,0,0,0.10)]">
                      <img src={PLAN_IMAGES[active] || PLAN_IMAGES[0]} alt={`${plan.name} plan meal preview`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {plan.popular && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: '#b0ea20', color: '#033603', border: '1px solid #8cc418' }}>MOST POPULAR</span>
                      </div>
                    )}
                    <h3 className="font-display font-bold text-xl mb-1" style={{ color: '#033603' }}>{plan.name}</h3>
                    <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{plan.description}</p>
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="font-semibold" style={{ color: '#6B7280' }}>Rs.</span>
                      <span className="font-display font-bold text-4xl tracking-tight" style={{ color: '#033603' }}>{typeof plan.price === 'number' ? plan.price.toLocaleString('en-IN') : plan.price}</span>
                      <span style={{ color: '#6B7280' }}>{plan.period}</span>
                    </div>
                    <div className="h-px mb-4" style={{ background: 'rgba(0,0,0,0.07)' }} />
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <div className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: '#F4FBE8', border: '1px solid rgba(176,234,32,0.35)' }}>
                            <Check className="w-3 h-3" style={{ color: '#033603' }} />
                          </div>
                          <span style={{ color: '#374151' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => handleSelectPlan(plan)} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300" style={plan.popular ? { background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418' } : { border: '1.5px solid rgba(0,0,0,0.14)', color: '#374151', background: 'transparent' }}>
                      Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            {plans.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="h-2.5 rounded-full transition-all duration-300" style={{ background: i === active ? '#b0ea20' : 'rgba(0,0,0,0.14)', width: i === active ? '1.5rem' : '0.625rem' }} aria-label={`Go to plan ${i + 1}`} />
            ))}
          </div>
        </motion.div>

        <AuthModal isOpen={authOpen} onClose={handleAuthClose} onSuccess={handleAuthSuccess} />
        <OrderCheckoutModal isOpen={Boolean(selectedPlan)} onClose={() => setSelectedPlan(null)} plan={selectedPlan} />

        {/* WhatsApp CTA — single button below all plans */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex justify-center mt-10 sm:mt-14"
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300"
            style={{
              background: '#b0ea20',
              color: '#033603',
              border: '1.5px solid #8cc418',
              boxShadow: '0 4px 20px rgba(176,234,32,0.28)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8cc418';
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(176,234,32,0.42)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#b0ea20';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(176,234,32,0.28)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
