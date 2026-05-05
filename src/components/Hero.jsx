import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import heroDesktopWebp from '../assets/dietly/hero-meal-prep-desktop.webp';
import heroMobileWebp from '../assets/dietly/hero-meal-prep-mobile.webp';
import heroDesktopJpg from '../assets/dietly/hero-meal-prep-desktop.jpg';
import heroMobileJpg from '../assets/dietly/hero-meal-prep-mobile.jpg';

const stats = [
  { value: '10,000+', label: 'Meals Delivered' },
  { value: '5,000+', label: 'Happy Members' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden hero-bg">
      {/* Soft lime accent glow — upper-right corner */}
      <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] rounded-full blur-[180px] pointer-events-none" style={{ background: 'rgba(255,229,134,0.22)' }} />

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
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#b0ea20' }} />
                India&apos;s #1 Fitness Meal Subscription
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-5 sm:mb-6"
              style={{ color: '#033603' }}
            >
              Fuel Your <span style={{ color: '#b0ea20', WebkitTextStroke: '1px #8cc418' }}>Fitness</span>
              <br />
              Journey
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0"
              style={{ color: '#374151' }}
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
              className="flex flex-wrap gap-6 sm:gap-12 mt-12 sm:mt-16 pt-6 sm:pt-8 border-t justify-center lg:justify-start"
              style={{ borderColor: 'rgba(0,0,0,0.08)' }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display font-bold text-xl sm:text-2xl" style={{ color: '#033603' }}>{s.value}</div>
                  <div className="text-xs sm:text-sm mt-1" style={{ color: '#6B7280' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none relative"
          >
            {/* Subtle lime glow */}
            <div className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none" style={{ background: 'rgba(176,234,32,0.08)' }} />
            <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.10)' }}>
              <picture>
                {/* Mobile WebP */}
                <source media="(max-width: 639px)" srcSet={heroMobileWebp} type="image/webp" />
                {/* Mobile JPG fallback */}
                <source media="(max-width: 639px)" srcSet={heroMobileJpg} type="image/jpeg" />
                {/* Desktop WebP */}
                <source media="(min-width: 640px)" srcSet={heroDesktopWebp} type="image/webp" />
                {/* Desktop JPG fallback */}
                <source media="(min-width: 640px)" srcSet={heroDesktopJpg} type="image/jpeg" />
                <img
                  src={heroDesktopJpg}
                  alt="Chef-prepared macro-balanced meals — Dietly"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '16/10' }}
                  fetchPriority="high"
                  draggable={false}
                />
              </picture>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
