import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flame } from 'lucide-react';

import paneerBhurji from '../assets/dietly/paneer bhurji.jpg';
import masalaChanaSprouts from '../assets/dietly/masala chana sprouts.jpg';
import chocolateBananaShake from '../assets/dietly/chocolate banana shake.jpg';
import boiledMixSprouts from '../assets/dietly/boiled mix sprouts.jpg';
import paneerParatha from '../assets/dietly/paneer paratha.jpg';
import malaiDahi from '../assets/dietly/Malai Dahi.jpg';
import kacchaChivda from '../assets/dietly/kaccha chivda.jpg';
import masalaMashedPotato from '../assets/dietly/masala mashed potato.jpg';
import bananaShake from '../assets/dietly/banana shake.jpg';

const galleryItems = [
  { src: paneerBhurji, alt: 'Paneer Bhurji', label: 'Paneer Bhurji', cal: 285, tag: 'High Protein' },
  { src: chocolateBananaShake, alt: 'Chocolate Banana Shake', label: 'Chocolate Banana Shake', cal: 320, tag: 'High Protein' },
  { src: masalaChanaSprouts, alt: 'Masala Chana Sprouts', label: 'Masala Chana Sprouts', cal: 175, tag: 'Keto' },
  { src: boiledMixSprouts, alt: 'Boiled Mix Sprouts', label: 'Boiled Mix Sprouts', cal: 135, tag: 'Keto' },
  { src: paneerParatha, alt: 'Paneer Paratha', label: 'Paneer Paratha', cal: 420, tag: 'Standard' },
  { src: malaiDahi, alt: 'Malai Dahi', label: 'Malai Dahi', cal: 165, tag: 'High Protein' },
  { src: kacchaChivda, alt: 'Kaccha Chivda', label: 'Kaccha Chivda', cal: 210, tag: 'Light' },
  { src: masalaMashedPotato, alt: 'Masala Mashed Potato', label: 'Masala Mashed Potato', cal: 190, tag: 'Light' },
  { src: bananaShake, alt: 'Banana Shake', label: 'Banana Shake', cal: 290, tag: 'High Protein' },
];

const FILTERS = ['All', 'High Protein', 'Keto', 'Light', 'Standard'];

const TAG_COLORS = {
  'High Protein': { bg: 'rgba(176,234,32,0.18)', color: '#1a6600', border: 'rgba(176,234,32,0.55)' },
  'Keto':         { bg: 'rgba(3,54,3,0.10)',    color: '#033603', border: 'rgba(3,54,3,0.30)' },
  'Light':        { bg: 'rgba(255,229,134,0.30)', color: '#7a5800', border: 'rgba(255,200,0,0.40)' },
  'Standard':     { bg: 'rgba(0,0,0,0.06)',      color: '#374151', border: 'rgba(0,0,0,0.14)' },
};

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [active, setActive] = useState('All');

  const visible = active === 'All' ? galleryItems : galleryItems.filter(i => i.tag === active);

  return (
    <section id="menu" className="section-spacing section-alt overflow-hidden scroll-mt-20">
      <div className="section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="badge mb-5 inline-flex">Our Menu</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4" style={{ color: '#033603' }}>
            Meals That <span style={{ color: '#b0ea20', WebkitTextStroke: '1px #8cc418' }}>Fuel</span> You
          </h2>
          <p className="max-w-lg mx-auto text-sm sm:text-lg" style={{ color: '#374151' }}>
            Freshly prepared, macro-balanced dishes crafted for your fitness journey.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={active === f
                ? { background: '#b0ea20', color: '#033603', border: '1.5px solid #8cc418' }
                : { background: 'white', color: '#374151', border: '1.5px solid rgba(0,0,0,0.12)' }
              }
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Meal card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visible.map((item, i) => {
            const tagStyle = TAG_COLORS[item.tag] || TAG_COLORS['Standard'];
            return (
              <motion.div
                key={item.label}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                className="card card-hover overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Tag badge over image */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                    style={{ background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}` }}
                  >
                    {item.tag}
                  </span>
                  {/* Veg dot */}
                  <span className="absolute top-3 right-3 w-6 h-6 rounded flex items-center justify-center bg-white" style={{ border: '2px solid #22a722' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22a722' }} />
                  </span>
                </div>

                {/* Card body */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm sm:text-base" style={{ color: '#033603' }}>
                    {item.label}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1" style={{ background: 'rgba(255,229,134,0.35)', color: '#7a5800', border: '1px solid rgba(255,200,0,0.35)' }}>
                    <Flame className="w-3 h-3" />
                    {item.cal} kcal
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

