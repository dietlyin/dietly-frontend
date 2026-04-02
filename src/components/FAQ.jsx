import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import { faqsAPI } from '../services/api';

const fallbackFaqs = [
  { q: 'How does the subscription work?', a: 'Choose a plan, tell us your dietary preferences, and we deliver fresh meals to your door daily. You can pause, skip, or cancel anytime from your dashboard.' },
  { q: 'Can I customize my meals?', a: 'Absolutely! Standard and Premium plans include full meal customization based on your goals, dietary restrictions, and taste preferences.' },
  { q: 'What areas do you deliver to?', a: 'We currently deliver across 15+ cities in India. Enter your pincode at checkout to confirm availability in your area.' },
  { q: 'Are the meals suitable for vegetarians?', a: 'Yes! We offer both vegetarian and non-vegetarian options across all plans. You can set your preference during onboarding.' },
  { q: 'How is the food packaged?', a: 'All meals are packed in eco-friendly, microwave-safe containers. Premium plan members get insulated packaging to keep food at the perfect temperature.' },
  { q: 'Can I change my plan later?', a: 'Yes, you can upgrade, downgrade, or switch plans at any time. Changes take effect from your next billing cycle.' },
  { q: "What if I don't like a meal?", a: "If you're unsatisfied with any meal, let us know within 24 hours and we'll either replace it or credit your account. Satisfaction guaranteed." },
];

function FAQItem({ faq, isOpen, onToggle, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        onClick={onToggle}
        className={`w-full text-left p-6 sm:p-8 rounded-2xl transition-all duration-500 group border spotlight-card ${
          isOpen
            ? 'glass-strong shadow-premium border-white/[0.06]'
            : 'glass-card border-white/[0.03] hover:border-white/[0.06] hover:bg-white/[0.04]'
        }`}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
          e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-white/15 w-5">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-display font-semibold text-sm sm:text-[15px] text-white/70 group-hover:text-white/90 transition-colors duration-400">
              {faq.q}
            </span>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
            isOpen
              ? 'bg-brand-green/15 text-brand-green rotate-0 shadow-inner-glow-green'
              : 'bg-white/[0.03] text-white/25 group-hover:bg-white/[0.06]'
          }`}>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-5 ml-9 text-sm sm:text-base text-white/30 leading-relaxed pr-14 font-light">
                {faq.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: apiFaqs } = useAPI(faqsAPI.getAll, fallbackFaqs);

  // Normalize API shape (question/answer) to component shape (q/a)
  const faqs = apiFaqs.map((f) => ({
    q: f.question || f.q,
    a: f.answer || f.a,
  }));

  return (
    <section id="faq" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-green/[0.02] rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="badge-pill text-brand-orange mb-7 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            FAQ
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.5rem] tracking-tight mb-5 leading-[1.1]">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-base sm:text-lg font-light">
            Everything you need to know about Dietly.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
