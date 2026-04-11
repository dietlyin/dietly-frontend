import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Leaf, Truck, Dumbbell, ShieldCheck } from 'lucide-react';

import imgFresh from '../assets/dietly/boiled mix sprouts.jpg';
import imgMacro from '../assets/dietly/masala chana sprouts.jpg';
import imgDelivery from '../assets/dietly/paneer paratha.jpg';
import imgDiet from '../assets/dietly/Malai Dahi.jpg';

const features = [
  {
    icon: Leaf,
    title: 'Fresh & Healthy',
    description:
      'Every meal is prepared fresh daily with locally sourced, preservative-free ingredients.',
    image: imgFresh,
  },
  {
    icon: Dumbbell,
    title: 'Macro Balanced',
    description:
      'Each dish is calorie-counted and macro-balanced to support your specific fitness goals.',
    image: imgMacro,
  },
  {
    icon: Truck,
    title: 'Daily Delivery',
    description:
      'Hot meals delivered to your doorstep every single day — rain or shine, always on time.',
    image: imgDelivery,
  },
  {
    icon: ShieldCheck,
    title: 'Diet Compliant',
    description:
      'Choose from Keto, High Protein, Vegan, and more. We match your diet perfectly.',
    image: imgDiet,
  },
];

export default function Features() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="section-spacing overflow-hidden">
      <div className="section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="badge mb-5 inline-flex">Why Dietly</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Built for <span className="text-brand-green">Results</span>
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm sm:text-lg">
            Everything you need to eat clean and hit your goals — without the hassle.
          </p>
        </motion.div>

        {/* Feature cards — 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="card card-hover overflow-hidden"
              >
                <div className="h-32 sm:h-36 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 sm:p-7">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4 sm:mb-5">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
                  </div>
                  <h3 className="font-display font-semibold text-base sm:text-lg mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
