import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Plans from './components/Plans';
import FoodMenu from './components/FoodMenu';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import GymPartnership from './components/GymPartnership';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';

/* ── Cursor Glow: follows mouse for ambient interactivity ── */
function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const smoothX = useSpring(x, { stiffness: 60, damping: 35 });
  const smoothY = useSpring(y, { stiffness: 60, damping: 35 });

  useEffect(() => {
    const handleMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  return (
    <>
      <motion.div
        className="cursor-glow hidden lg:block"
        style={{ left: smoothX, top: smoothY }}
      />
      <motion.div
        className="fixed pointer-events-none z-[9997] hidden lg:block w-[200px] h-[200px] rounded-full"
        style={{
          left: smoothX,
          top: smoothY,
          background: 'radial-gradient(circle, rgba(0,232,108,0.03) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}

/* ── Page loader ── */
function PageLoader({ onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-brand-dark flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="w-12 h-12 rounded-full border-2 border-brand-green/20 border-t-brand-green animate-spin" />
        <div className="absolute inset-0 rounded-full bg-brand-green/10 blur-xl animate-pulse" />
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <AuthProvider>
    <div className="relative min-h-screen bg-brand-dark text-white overflow-x-hidden">
      {/* Page loader */}
      <AnimatePresence>
        {!loaded && <PageLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* Global grain texture overlay */}
      <div className="grain-overlay" />

      {/* Mouse-following ambient glow */}
      <CursorGlow />

      <Navbar />
      <Hero />

      {/* Divider */}
      <div className="section-divider" />

      <Stats />
      <HowItWorks />

      <div className="section-divider" />

      <Plans />

      <div className="section-divider" />

      <FoodMenu />
      <Testimonials />

      <div className="section-divider" />

      <GymPartnership />
      <FAQ />
      <Footer />
      <FloatingCTA />
    </div>
    </AuthProvider>
  );
}
