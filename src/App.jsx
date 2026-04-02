import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

const Stats = lazy(() => import('./components/Stats'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Plans = lazy(() => import('./components/Plans'));
const FoodMenu = lazy(() => import('./components/FoodMenu'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const GymPartnership = lazy(() => import('./components/GymPartnership'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));
const FloatingCTA = lazy(() => import('./components/FloatingCTA'));

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

      <Suspense fallback={null}>
        <Stats />
        <HowItWorks />
        <Plans />
        <FoodMenu />
        <Testimonials />
        <GymPartnership />
        <FAQ />
        <Footer />
        <FloatingCTA />
      </Suspense>
    </div>
    </AuthProvider>
  );
}
