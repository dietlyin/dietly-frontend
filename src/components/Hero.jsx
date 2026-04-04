import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import logo from '../assets/dietly-logo.png';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container w-full pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge mb-8 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              India&apos;s #1 Fitness Meal Subscription
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6"
          >
            Fuel Your{' '}
            <span className="text-brand-green">Fitness</span>
            <br />
            Journey
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-neutral-400 leading-relaxed mb-10 max-w-xl"
          >
            Chef-crafted, macro-balanced meals delivered to your door daily.
            Zero cooking. Zero counting. Only results.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#plans" className="btn-primary text-base px-8 py-4">
              Start Your Plan
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
              <Play className="w-4 h-4" />
              How It Works
            </a>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-8 sm:gap-12 mt-16 pt-8 border-t border-white/[0.06]"
          >
            {[
              { value: '10,000+', label: 'Meals Delivered' },
              { value: '5,000+', label: 'Happy Members' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
