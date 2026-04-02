import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ChevronRight } from 'lucide-react';

export default function FloatingCTA() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Floating pill — mobile only ── */}
      <AnimatePresence>
        {showScroll && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 left-4 right-4 z-40 sm:hidden"
          >
            <div className="absolute -inset-2 rounded-3xl bg-brand-green/15 blur-2xl pointer-events-none" />
            <a
              href="#plans"
              className="relative flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-brand-green to-emerald-500 text-white font-semibold text-base shadow-glow-green active:scale-[0.97] transition-transform overflow-hidden"
            >
              Choose Your Plan
              <ChevronRight className="w-5 h-5" />
              <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll to top — desktop ── */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-7 right-7 z-40 hidden sm:flex w-12 h-12 rounded-xl glass-card border border-white/[0.04] items-center justify-center hover:bg-white/[0.06] hover:border-white/[0.08] hover:scale-110 hover:-translate-y-1 active:scale-90 transition-all duration-400 shadow-premium group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-white/30 group-hover:text-brand-green transition-colors duration-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
