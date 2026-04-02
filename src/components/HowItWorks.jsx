import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ClipboardList, Truck, Utensils, Dumbbell } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    num: '01',
    title: 'Choose Your Plan',
    desc: 'Pick the plan that matches your fitness goals — from basic to fully custom.',
    gradient: 'from-brand-green to-emerald-400',
    glow: 'rgba(0,232,108,0.15)',
  },
  {
    icon: Utensils,
    num: '02',
    title: 'We Craft Your Meals',
    desc: 'Chefs prepare macro-balanced meals with fresh, locally sourced ingredients daily.',
    gradient: 'from-brand-orange to-amber-400',
    glow: 'rgba(255,107,44,0.15)',
  },
  {
    icon: Truck,
    num: '03',
    title: 'Delivered Fresh',
    desc: 'Meals arrive hot at your door on time — every single day, rain or shine.',
    gradient: 'from-cyan-400 to-blue-400',
    glow: 'rgba(34,211,238,0.15)',
  },
  {
    icon: Dumbbell,
    num: '04',
    title: 'Crush Your Goals',
    desc: 'Stay fueled, hit your macros, and watch your body transform week after week.',
    gradient: 'from-purple-400 to-pink-400',
    glow: 'rgba(192,132,252,0.15)',
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="how-it-works" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-green/[0.03] rounded-full blur-[160px] pointer-events-none animate-blob" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/[0.025] rounded-full blur-[140px] pointer-events-none animate-blob-delayed" />

      <div className="relative max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20 sm:mb-24"
        >
          <span className="badge-pill text-brand-green mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            Simple Process
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.5rem] tracking-tight mb-5 leading-[1.1]">
            How <span className="gradient-text">Dietly</span> Works
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-base sm:text-lg font-light">
            Four simple steps to transform your nutrition — and your physique.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 70, scale: 0.88, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: 0.15 + 0.14 * i, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Desktop connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[60%] w-[80%] h-px">
                  <div className="w-full h-full bg-gradient-to-r from-white/[0.04] to-transparent" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.9 + i * 0.25, duration: 0.7 }}
                    className="absolute inset-0 origin-left bg-gradient-to-r from-brand-green/20 to-transparent"
                  />
                </div>
              )}

              <div className="relative h-full rounded-3xl glass-card p-7 sm:p-8 transition-all duration-600 group-hover:-translate-y-4 group-hover:shadow-premium-lg overflow-hidden border border-white/[0.04] group-hover:border-white/[0.08] spotlight-card"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: step.glow }}
                />

                {/* Shimmer on hover */}
                <div className="absolute inset-0 shimmer-bg rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Step number */}
                <div className="absolute -top-0.5 -right-0.5">
                  <div className="px-3 py-1.5 rounded-bl-2xl rounded-tr-3xl bg-white/[0.02] border-l border-b border-white/[0.04] text-[11px] font-mono font-bold text-white/15 group-hover:text-white/35 transition-colors duration-500">
                    {step.num}
                  </div>
                </div>

                {/* Icon */}
                <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} mb-7 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl transition-all duration-500`}>
                  <step.icon className="w-6 h-6 text-white" />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`} />
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl mb-3 text-white/90 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-white/30 leading-relaxed group-hover:text-white/45 transition-colors duration-500">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
