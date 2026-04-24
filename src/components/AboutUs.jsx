import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Microscope, Leaf, Users } from 'lucide-react';

const pillars = [
  {
    icon: Leaf,
    title: 'Real Ingredients',
    description:
      'We source fresh, locally grown produce daily. No frozen, no preservatives — just honest food prepared the same morning it reaches you.',
  },
  {
    icon: Microscope,
    title: 'Science-Backed Nutrition',
    description:
      'Every meal is designed by certified nutritionists and calorie-counted to fit your macro goals — whether you\'re building muscle, losing fat, or simply eating cleaner.',
  },
  {
    icon: Heart,
    title: 'Built for Nagpur',
    description:
      'We understand the pace of city life. Dietly was built for people in Nagpur who want to eat well without spending hours in the kitchen or compromising on flavour.',
  },
  {
    icon: Users,
    title: '5,000+ Members Strong',
    description:
      'From fitness beginners to competitive athletes, our community spans all fitness levels. We grow by results — members who see change, refer friends.',
  },
];

export default function AboutUs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="about" className="section-spacing section-cream overflow-hidden scroll-mt-20">
      <div className="section-container" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <span className="badge mb-5 inline-flex">Our Story</span>
            <h2
              className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-6 leading-[1.1]"
              style={{ color: '#033603' }}
            >
              We Cook So You Can{' '}
              <span style={{ color: '#b0ea20', WebkitTextStroke: '1px #8cc418' }}>Focus</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-5" style={{ color: '#374151' }}>
              Dietly started in 2022 with a single kitchen in Manewada and a belief that eating
              healthy shouldn't require hours of prep, expensive groceries, or a nutrition
              degree.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: '#374151' }}>
              Today we serve thousands of meals daily across Nagpur — each one tracked for
              macros, freshly made, and delivered before your workout ends.
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                { value: '2022', label: 'Founded' },
                { value: '10K+', label: 'Meals/Month' },
                { value: '4.9★', label: 'Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display font-bold text-2xl sm:text-3xl" style={{ color: '#033603' }}>
                    {s.value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + 0.08 * i }}
                  className="card p-5 sm:p-6"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: '#F4F3EE', border: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#033603' }} />
                  </div>
                  <h3 className="font-display font-semibold text-sm sm:text-base mb-2" style={{ color: '#033603' }}>
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {p.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
