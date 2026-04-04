import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Leaf, Truck, Dumbbell, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Fresh & Healthy',
    description: 'Every meal is prepared fresh daily with locally sourced, preservative-free ingredients.',
  },
  {
    icon: Dumbbell,
    title: 'Macro Balanced',
    description: 'Each dish is calorie-counted and macro-balanced to support your specific fitness goals.',
  },
  {
    icon: Truck,
    title: 'Daily Delivery',
    description: 'Hot meals delivered to your doorstep every single day — rain or shine, always on time.',
  },
  {
    icon: ShieldCheck,
    title: 'Diet Compliant',
    description: 'Choose from Keto, High Protein, Vegan, and more. We match your diet perfectly.',
  },
];

export default function Features() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="section-spacing overflow-hidden">
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge mb-5 inline-flex">Why Dietly</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Built for <span className="text-brand-green">Results</span>
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-base sm:text-lg">
            Everything you need to eat clean and hit your goals — without the hassle.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="card card-hover p-7"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
