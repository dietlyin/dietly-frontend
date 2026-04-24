import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut, UserCircle } from 'lucide-react';
import logo from '../assets/dietly-logo.png';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const navLinks = [
  { label: 'Menu', href: '#menu' },
  { label: 'Plans', href: '#plans' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why Dietly', href: '#features' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md border-b'
            : 'bg-transparent'
        }`}
        style={scrolled ? { backgroundColor: 'rgba(250,250,248,0.97)', borderColor: 'rgba(0,0,0,0.08)' } : {}}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <a href="#home" className="flex items-center">
              <img src={logo} alt="Dietly" className="h-8 w-auto object-contain" />
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold transition-colors"
                  style={{ color: '#374151' }}
                  onMouseEnter={e => e.currentTarget.style.color='#033603'}
                  onMouseLeave={e => e.currentTarget.style.color='#374151'}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'rgba(3,54,3,0.65)' }}>
                    <UserCircle className="w-4 h-4 text-brand-green" />
                    {user.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border font-medium transition-all"
                    style={{ borderColor: 'rgba(0,0,0,0.12)', color: '#374151' }}
                    onMouseEnter={e => { e.currentTarget.style.color='#033603'; e.currentTarget.style.background='rgba(0,0,0,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color='#374151'; e.currentTarget.style.background='transparent'; }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden sm:inline-flex btn-primary text-sm py-2.5 px-5"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: '#FAFAF8' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-display font-semibold transition-colors" style={{ color: '#374151' }}
                  onMouseEnter={e => e.currentTarget.style.color='#033603'}
                  onMouseLeave={e => e.currentTarget.style.color='#374151'}
                >
                  {link.label}
                </a>
              ))}

              {user ? (
                <div className="flex flex-col items-center gap-3 mt-4">
                  <span className="flex items-center gap-2 text-sm" style={{ color: 'rgba(3,54,3,0.60)' }}>
                    <UserCircle className="w-5 h-5 text-brand-green" />
                    {user.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-6 py-3 text-sm rounded-xl border font-medium transition-all"
                    style={{ border: '1.5px solid rgba(0,0,0,0.12)', color: '#374151' }}
                    onMouseEnter={e => { e.currentTarget.style.color='#033603'; e.currentTarget.style.background='rgba(0,0,0,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color='#374151'; e.currentTarget.style.background='transparent'; }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  className="mt-4 btn-primary text-base px-8 py-3.5"
                >
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
