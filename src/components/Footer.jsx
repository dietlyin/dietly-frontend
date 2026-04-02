import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import logo from '../assets/dietly-logo.png';

const footerLinks = {
  Product: ['Pricing', 'Menu', 'How It Works', 'For Gyms'],
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Contact', 'Refund Policy', 'Terms'],
};

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <footer className="relative" ref={ref}>
      {/* ── CTA Banner ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/[0.04] via-transparent to-brand-orange/[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-green/[0.03] rounded-full blur-[160px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.25rem] mb-6 tracking-tight leading-[1.1]">
            Ready to Transform Your{' '}
            <span className="gradient-text-mixed">Nutrition?</span>
          </h2>
          <p className="text-white/30 max-w-md mx-auto mb-11 text-sm sm:text-base font-light">
            Join thousands who&apos;ve already made the switch. Start fueling your
            fitness today.
          </p>
          <a
            href="#plans"
            className="btn-primary text-base sm:text-lg group"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </a>
        </motion.div>
      </div>

      {/* ── Divider line ── */}
      <div className="section-divider" />

      {/* ── Main footer ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-6">
              <img src={logo} alt="Dietly" className="h-8 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sm text-white/25 leading-relaxed mb-7 max-w-xs font-light">
              Supporting your fitness goals daily with chef-crafted, macro-balanced
              meals delivered to your door.
            </p>

            <div className="space-y-3 text-sm text-white/25">
              {[
                { icon: Mail, text: 'hello@dietly.in' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: MapPin, text: 'Mumbai, India' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <item.icon className="w-4 h-4 text-brand-green/30 group-hover:text-brand-green/60 transition-colors duration-400" />
                  <span className="group-hover:text-white/45 transition-colors duration-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/20 hover:text-white/50 transition-colors duration-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-white/[0.03]">
          <p className="text-xs text-white/15 font-mono">
            &copy; {new Date().getFullYear()} Dietly. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/[0.06] hover:scale-110 transition-all duration-400 group"
              >
                <s.icon className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors duration-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
