import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import HeroImage from './HeroImage';
import heroImg from '../assets/dietly/paneer bhurji.jpg';

const stats = [
  { value: '10,000+', label: 'Meals Delivered' },
  { value: '5,000+', label: 'Happy Members' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-brand-green/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container w-full pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text column */}
          <div className="flex-1 max-w-xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge mb-6 sm:mb-8 inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                India&apos;s #1 Fitness Meal Subscription
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-5 sm:mb-6"
            >
              Fuel Your <span className="text-brand-green">Fitness</span>
              <br />
              Journey
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl text-neutral-400 leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Chef-crafted, macro-balanced meals delivered to your door daily.
              Zero cooking. Zero counting. Only results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-6 sm:gap-12 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/[0.06] justify-center lg:justify-start"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display font-bold text-xl sm:text-2xl text-white">{s.value}</div>
                  <div className="text-xs sm:text-sm text-neutral-500 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image column */}
          <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none">
            <HeroImage src={heroImg} alt="Chef-crafted fitness meal" />
          </div>
        </div>
      </div>
    </section>
  );
}
