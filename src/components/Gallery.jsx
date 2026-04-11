import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ImageCard from './ImageCard';

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
  { src: paneerBhurji, alt: 'Paneer Bhurji', label: 'Paneer Bhurji' },
  { src: chocolateBananaShake, alt: 'Chocolate Banana Shake', label: 'Chocolate Banana Shake' },
  { src: masalaChanaSprouts, alt: 'Masala Chana Sprouts', label: 'Masala Chana Sprouts' },
  { src: boiledMixSprouts, alt: 'Boiled Mix Sprouts', label: 'Boiled Mix Sprouts' },
  { src: paneerParatha, alt: 'Paneer Paratha', label: 'Paneer Paratha' },
  { src: malaiDahi, alt: 'Malai Dahi', label: 'Malai Dahi' },
  { src: kacchaChivda, alt: 'Kaccha Chivda', label: 'Kaccha Chivda' },
  { src: masalaMashedPotato, alt: 'Masala Mashed Potato', label: 'Masala Mashed Potato' },
  { src: bananaShake, alt: 'Banana Shake', label: 'Banana Shake' },
];

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="menu" className="section-spacing overflow-hidden scroll-mt-20">
      <div className="section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="badge mb-5 inline-flex">Our Menu</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Meals That <span className="text-brand-green">Fuel</span> You
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm sm:text-lg">
            Freshly prepared, macro-balanced dishes crafted for your fitness journey.
          </p>
        </motion.div>

        {/* Responsive grid: 1 → 2 → 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.06 * i }}
              className="group relative"
            >
              <ImageCard
                src={item.src}
                alt={item.alt}
                className="aspect-[4/3]"
              />
              {/* Label overlay — always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-end pointer-events-none">
                <span className="px-4 sm:px-5 pb-3 sm:pb-4 font-display font-semibold text-white text-xs sm:text-sm">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
