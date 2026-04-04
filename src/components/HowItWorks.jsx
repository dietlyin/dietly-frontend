import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ClipboardList, Truck, Utensils, Dumbbell } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    num: '01',
    title: 'Choose Your Plan',
    desc: 'Pick the plan that matches your fitness goals — basic nutrition to fully custom.',
  },
  {
    icon: Utensils,
    num: '02',
    title: 'We Craft Your Meals',
    desc: 'Chefs prepare macro-balanced meals with fresh, locally sourced ingredients daily.',
  },
  {
    icon: Truck,
    num: '03',
    title: 'Delivered Fresh',
    desc: 'Meals arrive hot at your door on time — every single day, rain or shine.',
  },
  {
    icon: Dumbbell,
    num: '04',
    title: 'Crush Your Goals',
    desc: 'Stay fueled, hit your macros, and watch your body transform week after week.',
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="how-it-works" className="section-spacing overflow-hidden scroll-mt-20">
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="badge mb-5 inline-flex">Simple Process</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            How <span className="text-brand-green">Dietly</span> Works
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-base sm:text-lg">
            Four simple steps to transform your nutrition.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="relative"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-white/[0.06]" />
              )}

              <div className="card card-hover p-7 h-full">
                {/* Step number */}
                <span className="text-xs font-mono text-neutral-600 mb-4 block">{step.num}</span>

                <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-brand-green" />
                </div>

                <h3 className="font-display font-semibold text-lg mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
