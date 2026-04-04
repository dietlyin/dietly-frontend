import { Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
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
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="section-container py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Dietly" className="h-8 w-auto object-contain brightness-0 invert mb-5" />
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-xs">
              Chef-crafted, macro-balanced meals delivered to your door daily. Supporting your fitness goals.
            </p>

            <div className="space-y-2.5 text-sm text-neutral-500">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neutral-600" />
                <span>hello@dietly.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-600" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-600" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-4 font-medium">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Dietly. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/[0.06] hover:bg-white/5 hover:border-white/10 transition-all"
              >
                <s.icon className="w-4 h-4 text-neutral-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
