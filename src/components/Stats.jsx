import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, UtensilsCrossed, MapPin, Star } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import { statsAPI } from '../services/api';

const iconMap = { Users, UtensilsCrossed, MapPin, Star };

const colorMap = {
  'brand-green': { text: 'text-brand-green', gradient: 'from-brand-green/20 to-transparent', glow: 'rgba(0,232,108,0.15)' },
  'brand-orange': { text: 'text-brand-orange', gradient: 'from-brand-orange/20 to-transparent', glow: 'rgba(255,107,44,0.15)' },
  'purple': { text: 'text-cyan-400', gradient: 'from-cyan-400/20 to-transparent', glow: 'rgba(34,211,238,0.15)' },
  'yellow': { text: 'text-amber-400', gradient: 'from-amber-400/20 to-transparent', glow: 'rgba(251,191,36,0.15)' },
};

const fallbackStats = [
  { icon: 'Users', value: 5000, suffix: '+', label: 'Active Subscribers', color: 'brand-green', decimals: 0 },
  { icon: 'UtensilsCrossed', value: 10000, suffix: '+', label: 'Meals Delivered', color: 'brand-orange', decimals: 0 },
  { icon: 'MapPin', value: 15, suffix: '+', label: 'Cities Covered', color: 'purple', decimals: 0 },
  { icon: 'Star', value: 4.9, suffix: '', label: 'Average Rating', color: 'yellow', decimals: 1 },
];

function AnimatedCounter({ target, decimals = 0, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 2400;
    const steps = 80;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(current);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const { data: apiStats } = useAPI(statsAPI.getAll, fallbackStats);

  const stats = apiStats.map((s) => {
    const colors = colorMap[s.color] || colorMap['brand-green'];
    return {
      ...s,
      icon: iconMap[s.icon] || Users,
      color: colors.text,
      gradient: colors.gradient,
      glowColor: colors.glow,
    };
  });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Rich background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-surface/20 to-transparent" />
      <div className="absolute inset-0 dot-grid opacity-15" />

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green/[0.03] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-brand-orange/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 60, scale: 0.85, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group text-center"
            >
              <div
                className="relative glass-card rounded-3xl p-7 sm:p-9 transition-all duration-600 hover:-translate-y-4 hover:shadow-premium-lg overflow-hidden spotlight-card"
                style={{ '--glow-color': stat.glowColor }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                {/* Hover glow orb */}
                <div
                  className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: stat.glowColor }}
                />

                {/* Icon with gradient bg */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={inView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-white/[0.04] mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg transition-all duration-500`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </motion.div>

                {/* Value */}
                <div className={`font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-2 tracking-tight ${stat.color}`}>
                  <AnimatedCounter target={stat.value} decimals={stat.decimals || 0} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-sm text-white/25 font-medium tracking-wide">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
