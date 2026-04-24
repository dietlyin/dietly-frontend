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
          className="relative card p-10 sm:p-16 text-center overflow-hidden cta-mesh"
          style={{ border: '1.5px solid rgba(176,234,32,0.40)', boxShadow: '0 4px 30px rgba(176,234,32,0.10)' }}
        >
          {/* No separate glow needed — cta-mesh handles background depth */}

          <div className="relative">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-5" style={{ color: '#033603' }}>
              Ready to Transform Your{' '}
              <span style={{ color: '#b0ea20', WebkitTextStroke: '1px #8cc418' }}>Nutrition?</span>
            </h2>
            <p className="max-w-md mx-auto mb-10 text-base sm:text-lg" style={{ color: '#374151' }}>
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
