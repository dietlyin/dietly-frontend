import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import { plansAPI } from '../services/api';

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

export default function PlansSlider() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: apiPlans } = useAPI(plansAPI.getAll, fallbackPlans);
  const [active, setActive] = useState(1);
  const [direction, setDirection] = useState(0);

  const plans = apiPlans.map((p) => ({
    ...p,
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

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [inView, next]);

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="badge mb-5 inline-flex">Pricing</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Choose Your <span className="text-brand-green">Plan</span>
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-base sm:text-lg">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        {/* Rotating card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative max-w-md mx-auto"
        >
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all"
            aria-label="Previous plan"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all"
            aria-label="Next plan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="min-h-[480px] sm:min-h-[520px] relative mx-8 sm:mx-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <div
                  className={`card h-full p-8 sm:p-10 ${
                    plan.popular ? 'border-brand-green/30' : ''
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="mb-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-green text-neutral-950">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <h3 className="font-display font-bold text-2xl mb-1">{plan.name}</h3>
                  <p className="text-sm text-neutral-500 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-neutral-500">₹</span>
                    <span className="font-display font-bold text-5xl tracking-tight">{plan.price}</span>
                    <span className="text-neutral-500">{plan.period}</span>
                  </div>

                  <div className="h-px bg-white/[0.06] mb-6" />

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 w-5 h-5 rounded-md bg-brand-green/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-brand-green" />
                        </div>
                        <span className="text-neutral-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                      plan.popular
                        ? 'bg-brand-green text-neutral-950 hover:bg-brand-green-light'
                        : 'border border-white/10 text-neutral-300 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-brand-green scale-110' : 'bg-white/15 hover:bg-white/25'
                }`}
                aria-label={`Go to plan ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
