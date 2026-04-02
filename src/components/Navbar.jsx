import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut, UserCircle } from 'lucide-react';
import logo from '../assets/dietly-logo.png';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Plans', href: '#plans' },
  { label: 'Menu', href: '#menu' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { scrollY } = useScroll();
  const [lastY, setLastY] = useState(0);
  const { user, logout } = useAuth();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 50);
    setHidden(y > lastY && y > 300);
    setLastY(y);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden && !mobileOpen ? -100 : 0, opacity: hidden && !mobileOpen ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-2' : 'py-4'}`}
      >
        <div className={`mx-3 sm:mx-6 lg:mx-8 rounded-2xl transition-all duration-700 ${scrolled ? 'glass-strong shadow-premium-lg border-white/[0.04]' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo */}
              <a href="#home" className="flex items-center gap-1 group relative">
                <img src={logo} alt="Dietly" className="h-8 sm:h-9 w-auto object-contain group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -inset-3 bg-brand-green/5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              </a>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                    className="relative px-4 py-2 text-[13px] font-medium text-white/40 hover:text-white/80 transition-all duration-400 group"
                  >
                    {link.label}
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full bg-gradient-to-r from-brand-green to-brand-green-light group-hover:w-3/5 transition-all duration-500 shadow-glow-green" />
                  </motion.a>
                ))}
              </div>

              {/* CTA + Hamburger */}
              <div className="flex items-center gap-3">
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="hidden sm:flex items-center gap-3"
                  >
                    <span className="flex items-center gap-1.5 text-[13px] text-white/45">
                      <UserCircle className="w-4 h-4 text-brand-green" />
                      {user.name?.split(' ')[0]}
                    </span>
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-xl glass text-white/50 hover:text-white/80 border border-white/[0.06] hover:border-white/10 transition-all duration-300"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setAuthOpen(true)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/15 hover:bg-brand-green hover:text-brand-dark hover:shadow-glow-green hover:scale-105 active:scale-95 transition-all duration-500"
                  >
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                )}

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden relative p-2.5 rounded-xl glass hover:bg-white/[0.06] transition-all duration-300"
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait">
                    {mobileOpen ? (
                      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <X size={20} />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Menu size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-brand-dark/[0.98] backdrop-blur-3xl" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-brand-green/[0.08] rounded-full blur-[120px] animate-blob" />
            <div className="absolute bottom-20 right-10 w-56 h-56 bg-brand-orange/[0.06] rounded-full blur-[100px] animate-blob-delayed" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center justify-center h-full gap-6"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.06 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl font-display font-bold text-white/60 hover:text-brand-green transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#plans"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-8 btn-primary text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.a>

              {user ? (
                <motion.button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mt-2 flex items-center gap-2 text-white/30 hover:text-white/60 text-base transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout ({user.name?.split(' ')[0]})
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mt-2 text-white/30 hover:text-brand-green text-base transition-colors"
                >
                  Sign In
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
