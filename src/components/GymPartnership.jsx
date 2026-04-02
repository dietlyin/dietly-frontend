import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Handshake, ArrowRight, Building2, Users, TrendingUp } from 'lucide-react';

const perks = [
  { icon: Users, text: 'Exclusive rates for gym members' },
  { icon: Building2, text: 'Co-branded meal plans' },
  { icon: TrendingUp, text: 'Revenue sharing partnership' },
];

export default function GymPartnership() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="gym-partnership" className="relative section-padding overflow-hidden">
      {/* Background — warm mesh-gradient with edge fades */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-25" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-brand-orange/[0.025] rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-dark to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left — content */}
          <motion.div
            initial={{ opacity: 0, x: -70, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="badge-pill text-brand-orange mb-7 inline-flex">
              <Handshake className="w-4 h-4" /> For Gym Owners
            </span>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.1] mb-6 tracking-tight">
              Partner With{' '}
              <span className="gradient-text-mixed">Dietly</span>
            </h2>

            <p className="text-base sm:text-lg text-white/30 mb-10 leading-relaxed font-light max-w-md">
              Join India&apos;s fastest-growing fitness nutrition network. Offer your
              members premium meals — and earn while doing it.
            </p>

            <ul className="space-y-5 mb-11">
              {perks.map((perk, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.12 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-orange/10 border border-brand-orange/8 flex items-center justify-center shrink-0 group-hover:bg-brand-orange/15 group-hover:scale-110 transition-all duration-400">
                    <perk.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <span className="text-white/40 font-medium text-sm sm:text-base group-hover:text-white/60 transition-colors duration-400">
                    {perk.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-orange-light text-white font-semibold shadow-xl shadow-brand-orange/15 hover:shadow-glow-orange-lg hover:scale-105 hover:-translate-y-2 active:scale-95 transition-all duration-500 overflow-hidden relative"
            >
              <span className="relative z-10">Become a Partner</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.a>
          </motion.div>

          {/* Right — visual card */}
          <motion.div
            initial={{ opacity: 0, x: 70, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative glass-card rounded-[2rem] p-9 sm:p-11 overflow-hidden neon-border-orange spotlight-card"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              }}
            >
              <div className="absolute top-0 right-0 w-52 h-52 bg-brand-orange/[0.05] rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-brand-green/[0.04] rounded-full blur-[90px] pointer-events-none" />

              <div className="relative text-center">
                <div className="text-7xl mb-7">🏋️‍♂️</div>
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-3">Gym + Dietly</h3>
                <p className="text-sm text-white/30 mb-9 max-w-xs mx-auto font-light">
                  Give your members the missing piece — nutrition. Together, we build champions.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '50+', label: 'Gym Partners' },
                    { value: '92%', label: 'Retention' },
                    { value: '3x', label: 'Engagement' },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                      className="py-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] group/stat hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-400"
                    >
                      <div className="font-display font-bold text-xl gradient-text-mixed">{s.value}</div>
                      <div className="text-[10px] text-white/25 mt-1 font-mono">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
