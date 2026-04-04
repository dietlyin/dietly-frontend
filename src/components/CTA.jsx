import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="section-spacing" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative card p-10 sm:p-16 text-center overflow-hidden"
        >
          {/* Subtle accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-brand-green/[0.06] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-5">
              Ready to Transform Your{' '}
              <span className="text-brand-green">Nutrition?</span>
            </h2>
            <p className="text-neutral-400 max-w-md mx-auto mb-10 text-base sm:text-lg">
              Join thousands who&apos;ve already made the switch. Start fueling your fitness today.
            </p>
            <a href="#plans" className="btn-primary text-base px-10 py-4">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
