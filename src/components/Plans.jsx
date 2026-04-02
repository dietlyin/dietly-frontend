import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Zap, Star, Crown, ArrowRight } from 'lucide-react';
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
function TiltCard({ children, className, popular }) {
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

export default function Plans() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: apiPlans } = useAPI(plansAPI.getAll, fallbackPlans);

  const plans = apiPlans.map((p) => ({
    ...p,
    icon: iconMap[p.icon] || Zap,
    gradient: gradientMap[p.name] || 'from-slate-400 to-slate-300',
    price: typeof p.price === 'number' ? p.price.toLocaleString('en-IN') : p.price,
  }));

  return (
    <section id="plans" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-brand-green/[0.04] rounded-full blur-[200px] pointer-events-none animate-morph" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-orange/[0.025] rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-18 sm:mb-22"
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-5 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 80, scale: 0.88, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: 0.15 + 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
              className={`relative group ${plan.popular ? 'md:-mt-8 md:mb-0 z-10' : ''}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                >
                  <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-brand-green to-brand-green-light text-xs font-bold text-brand-dark shadow-glow-green tracking-wide animate-breathe">
                    MOST POPULAR
                  </div>
                </motion.div>
              )}

              <TiltCard
                popular={plan.popular}
                className={`relative h-full rounded-[2rem] overflow-hidden transition-all duration-700 group-hover:-translate-y-4 spotlight-card ${
                  plan.popular
                    ? 'glass-strong bg-gradient-to-b from-brand-green/[0.06] to-transparent neon-border-green shadow-glow-green'
                    : 'glass-card border border-white/[0.04] group-hover:border-white/[0.08]'
                } ${i === 2 ? 'group-hover:shadow-glow-orange' : ''}`}
              >
                {/* Shimmer for popular */}
                {plan.popular && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}

                {/* Glow orb */}
                <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                  plan.popular ? 'bg-brand-green/10' : i === 2 ? 'bg-brand-orange/8' : 'bg-white/[0.03]'
                }`} />

                <div className="relative p-8 sm:p-9" style={{ transform: 'translateZ(20px)' }}>
                  {/* Icon with scale-in */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={inView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} mb-7 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-lg`}
                  >
                    <plan.icon className="w-5 h-5 text-white" />
                  </motion.div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl mb-1 group-hover:text-white transition-colors duration-400">{plan.name}</h3>
                  <p className="text-xs text-white/25 mb-7">{plan.description}</p>

                  {/* Price with animated entrance */}
                  <div className="flex items-baseline gap-1.5 mb-9">
                    <span className="text-base text-white/30 font-light">₹</span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                      className={`font-display font-bold text-5xl sm:text-6xl tracking-tight ${
                        plan.popular ? 'gradient-text' : i === 2 ? 'gradient-text-warm' : 'text-white'
                      }`}
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-sm text-white/25">{plan.period}</span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent mb-8" />

                  {/* Features with staggered reveal */}
                  <ul className="space-y-3.5 mb-10">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -15 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.6 + i * 0.1 + j * 0.05, duration: 0.4 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all duration-400 ${
                          plan.popular ? 'bg-brand-green/15 text-brand-green group-hover:bg-brand-green/25' : 'bg-white/[0.03] text-white/25 group-hover:bg-white/[0.06]'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-white/40 group-hover:text-white/55 transition-colors duration-400">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA with enhanced hover */}
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
          ))}
        </div>
      </div>
    </section>
  );
}
