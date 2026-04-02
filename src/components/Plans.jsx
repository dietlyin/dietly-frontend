import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Zap, Star, Crown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import { plansAPI } from '../services/api';

const iconMap = { Zap, Star, Crown };

const fallbackPlans = [
  {
    name: 'Basic',
    price: 1299,
    period: '/month',
    icon: 'Zap',
    description: 'Get started with clean eating.',
    gradient: 'from-slate-400 to-slate-300',
    popular: false,
    features: [
      '1 diet meal per day',
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
    icon: 'Star',
    description: 'Most popular. Tailored to your goals.',
    gradient: 'from-brand-green to-brand-green-light',
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
    icon: 'Crown',
    description: 'The ultimate nutrition experience.',
    gradient: 'from-brand-orange to-brand-orange-light',
    popular: false,
    features: [
      'Everything in Standard',
      'Full day meals (B/L/D)',
      'Fully customized diet',
      'Protein & supplement support',
      'On-demand food ordering',
      'Dedicated nutritionist',
      'Premium packaging',
    ],
  },
];

const gradientMap = {
  Basic: 'from-slate-400 to-slate-300',
  Standard: 'from-brand-green to-brand-green-light',
  Premium: 'from-brand-orange to-brand-orange-light',
};

/* ── 3D Tilt Card with spotlight ── */
function TiltCard({ children, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 250, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 250, damping: 30 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
    ref.current.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    ref.current.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const reset = () => { x.set(0.5); y.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Carousel dot indicator ── */
function CarouselDots({ count, active, onSelect }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative group p-1"
          aria-label={`Go to plan ${i + 1}`}
        >
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
            i === active
              ? 'bg-brand-green scale-110 shadow-glow-green'
              : 'bg-white/10 group-hover:bg-white/20'
          }`} />
          {i === active && (
            <motion.div
              layoutId="activeDot"
              className="absolute inset-0 m-auto w-6 h-6 rounded-full border border-brand-green/30"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Progress bar for auto-rotation timer ── */
function AutoPlayBar({ active, duration }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-16 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
          {i === active && (
            <motion.div
              key={`bar-${active}`}
              className="h-full bg-gradient-to-r from-brand-green to-brand-green-light rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          )}
          {i < active && (
            <div className="h-full w-full bg-brand-green/20 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92, filter: 'blur(8px)' }),
  center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92, filter: 'blur(8px)' }),
};

export default function Plans() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: apiPlans } = useAPI(plansAPI.getAll, fallbackPlans);
  const [active, setActive] = useState(1); // Start on Standard (most popular)
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayDuration = 4000;

  const plans = apiPlans.map((p) => ({
    ...p,
    icon: iconMap[p.icon] || Zap,
    gradient: gradientMap[p.name] || 'from-slate-400 to-slate-300',
    price: typeof p.price === 'number' ? p.price.toLocaleString('en-IN') : p.price,
  }));

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

  // Auto-rotate
  useEffect(() => {
    if (isPaused || !inView) return;
    const timer = setInterval(next, autoPlayDuration);
    return () => clearInterval(timer);
  }, [isPaused, inView, next, autoPlayDuration]);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
  };

  const plan = plans[active];
  if (!plan) return null;

  const glowColor = plan.popular
    ? 'rgba(0,232,108,0.08)'
    : plan.name === 'Premium'
      ? 'rgba(255,107,44,0.06)'
      : 'rgba(255,255,255,0.03)';

  return (
    <section id="plans" className="relative section-padding overflow-hidden scroll-mt-24">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-brand-green/[0.03] rounded-full blur-[200px] pointer-events-none animate-morph" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-orange/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 sm:mb-18"
        >
          <span className="badge-pill text-brand-orange mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            Pricing Plans
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.5rem] tracking-tight mb-5 leading-[1.1]">
            Choose Your <span className="gradient-text-warm">Fuel Plan</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-base sm:text-lg font-light">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Side plan previews (desktop) */}
          <div className="hidden lg:block">
            {plans.map((p, i) => {
              if (i === active) return null;
              const isLeft = i < active || (active === 0 && i === plans.length - 1);
              return (
                <motion.div
                  key={p.name + '-preview'}
                  className={`absolute top-1/2 -translate-y-1/2 w-64 cursor-pointer z-0 ${
                    isLeft ? '-left-4' : '-right-4'
                  }`}
                  initial={false}
                  animate={{ opacity: 0.3, scale: 0.85 }}
                  whileHover={{ opacity: 0.5, scale: 0.88 }}
                  onClick={() => goTo(i)}
                >
                  <div className="glass rounded-3xl p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} mb-4`}>
                      <p.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="font-display font-bold text-lg">{p.name}</div>
                    <div className="text-white/30 text-sm mt-1">₹{p.price}{p.period}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Arrow buttons (desktop) */}
          <button
            onClick={prev}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 w-12 h-12 rounded-full glass items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
            aria-label="Previous plan"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 w-12 h-12 rounded-full glass items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
            aria-label="Next plan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Active card */}
          <div className="relative max-w-lg mx-auto min-h-[520px] sm:min-h-[560px]">
            {/* Ambient glow behind card */}
            <motion.div
              key={`glow-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none"
              style={{ background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 60%)` }}
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-brand-green to-brand-green-light text-xs font-bold text-brand-dark shadow-glow-green tracking-wide animate-breathe">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <TiltCard
                  className={`relative h-full rounded-[2rem] overflow-hidden spotlight-card ${
                    plan.popular
                      ? 'glass-strong bg-gradient-to-b from-brand-green/[0.06] to-transparent neon-border-green shadow-glow-green'
                      : plan.name === 'Premium'
                        ? 'glass-card border border-white/[0.04] shadow-glow-orange'
                        : 'glass-card border border-white/[0.04]'
                  }`}
                >
                  {plan.popular && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}

                  <div className="relative p-8 sm:p-10" style={{ transform: 'translateZ(20px)' }}>
                    {/* Icon + Name row */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                        <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-2xl sm:text-3xl">{plan.name}</h3>
                        <p className="text-xs text-white/30">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mb-8">
                      <span className="text-lg text-white/30 font-light">₹</span>
                      <span className={`font-display font-bold text-5xl sm:text-6xl tracking-tight ${
                        plan.popular ? 'gradient-text' : plan.name === 'Premium' ? 'gradient-text-warm' : 'text-white'
                      }`}>
                        {plan.price}
                      </span>
                      <span className="text-sm text-white/25">{plan.period}</span>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-7" />

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + j * 0.04, duration: 0.3 }}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                            plan.popular ? 'bg-brand-green/15 text-brand-green' : 'bg-white/[0.04] text-white/30'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-white/45">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-500 group/btn overflow-hidden relative ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-green to-brand-green-light text-brand-dark shadow-lg shadow-brand-green/20 hover:shadow-glow-green hover:scale-[1.03] active:scale-[0.97]'
                        : 'glass text-white/60 hover:text-white hover:bg-white/[0.06] hover:scale-[1.03] active:scale-[0.97]'
                    }`}>
                      <span className="relative z-10">Get Started</span>
                      <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-400" />
                      {plan.popular && <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />}
                    </button>
                  </div>
                </TiltCard>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile nav arrows */}
          <div className="flex lg:hidden items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/40 hover:text-white active:scale-95 transition-all"
              aria-label="Previous plan"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-white/30 font-medium min-w-[80px] text-center">
              {active + 1} / {plans.length}
            </span>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/40 hover:text-white active:scale-95 transition-all"
              aria-label="Next plan"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots + Progress */}
          <CarouselDots count={plans.length} active={active} onSelect={goTo} />
          <AutoPlayBar active={active} duration={autoPlayDuration} />
        </motion.div>
      </div>
    </section>
  );
}
