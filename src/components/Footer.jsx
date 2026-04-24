import { Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/dietly-logo.png';

const footerLinks = {
  Explore: ['Pricing', 'Menu', 'How It Works', 'For Gyms'],
  Support: ['Help Center', 'Contact', 'Refund Policy', 'Terms', 'Delivery Partner Login'],
};

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    /* Dark green footer (#033603) — strong visual anchor at page bottom.
       Logo cream (#ffe586) and lime (#b0ea20) used for text and icon accents. */
    <footer style={{ background: '#111713', borderTop: '1px solid rgba(255,229,134,0.20)' }}>
      <div className="section-container py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column — logo shows naturally (dark green on dark bg needs invert) */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Dietly" className="h-8 w-auto object-contain brightness-0 invert mb-5" />
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,241,134,0.60)' }}>
              Chef-crafted, macro-balanced meals delivered to your door daily. Supporting your fitness goals.
            </p>

            <div className="space-y-2.5 text-sm" style={{ color: 'rgba(255,241,134,0.60)' }}>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: '#b0ea20' }} />
                <span>hello@dietly.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" style={{ color: '#b0ea20' }} />
                <span>+91 90111 54118</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" style={{ color: '#b0ea20' }} />
                <span>Nagpur, India</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs uppercase tracking-widest mb-4 font-bold" style={{ color: '#b0ea20', letterSpacing: '0.10em' }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={link === 'Delivery Partner Login' ? '/delivery-login' : '#'}
                      className="text-sm transition-colors"
                      style={{ color: 'rgba(255,241,134,0.55)' }}
                      onMouseEnter={e => e.currentTarget.style.color='#ffe586'}
                      onMouseLeave={e => e.currentTarget.style.color='rgba(255,241,134,0.55)'}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t" style={{ borderColor: 'rgba(176,234,32,0.10)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,241,134,0.40)' }}>
            &copy; {new Date().getFullYear()} Dietly. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{ border: '1px solid rgba(176,234,32,0.22)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(176,234,32,0.12)'; e.currentTarget.style.borderColor='rgba(176,234,32,0.50)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(176,234,32,0.22)'; }}
              >
                <s.icon className="w-4 h-4" style={{ color: '#b0ea20' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
