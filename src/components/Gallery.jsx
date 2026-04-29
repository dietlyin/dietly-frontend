import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flame, IndianRupee } from 'lucide-react';

import besanChilla from '../assets/dietly-menu/Besan Chilla.png';
import butterBesanChilla from '../assets/dietly-menu/Butter Besan Chilla.png';
import garlicBesanChilla from '../assets/dietly-menu/Garlic Besan Chilla.png';
import cheeseBesanChilla from '../assets/dietly-menu/Cheese Besan Chilla.png';
import cheeseGarlicBesanChilla from '../assets/dietly-menu/Cheese Garlic Besan Chilla.png';
import methiChilla from '../assets/dietly-menu/Methi Chilla.png';
import moongSproutsRaw from '../assets/dietly-menu/Moong Sprouts Raw.png';
import boiledMoongSprouts from '../assets/dietly-menu/Boiled Moong Sprouts.png';
import masalaMoongSprouts from '../assets/dietly-menu/Masala Moong Sprouts.png';
import masalaChanaSprouts from '../assets/dietly-menu/Masala Chana Sprouts.png';
import boiledMixedSprouts from '../assets/dietly-menu/Boiled Mixed Sprouts.png';
import masalaMatkiSprouts from '../assets/dietly-menu/Masala Matki Sprouts.png';
import masalaSoyaChunks from '../assets/dietly-menu/masala soya chunks.png';
import masalaMashedPotato from '../assets/dietly-menu/Masala Mashed Potato.png';
import paneerBhurji from '../assets/dietly-menu/Paneer Bhurji.png';
import bananaShake from '../assets/dietly-menu/banana shake.jpg';
import chocolateBananaShake from '../assets/dietly-menu/chocolate banana shake.jpg';
import specialGymShake from '../assets/dietly-menu/Special Gym Shake.jpg';
import appleMilkshake from '../assets/dietly-menu/Apple Milkshake.png';
import blackCoffee from '../assets/dietly-menu/Black Coffee.png';
import blackTea from '../assets/dietly-menu/black tea.png';
import chocolateCoffee from '../assets/dietly-menu/Hot Coffee (Chocolate flavour).png';
import hotMilk from '../assets/dietly-menu/Hot Milk.png';
import masalaMilk from '../assets/dietly-menu/Masala Milk.png';
import hotMilkWithDryFruits from '../assets/dietly-menu/Hot Milk with Dry Fruits.png';
import hotMilkWithFruits from '../assets/dietly-menu/Hot Milk with Fruits (Custard).png';

const galleryItems = [
  { src: besanChilla, alt: 'Besan Chilla', label: 'Besan Chilla', price: 52, tag: 'Chilla' },
  { src: butterBesanChilla, alt: 'Butter Besan Chilla', label: 'Butter Besan Chilla', price: 54, tag: 'Chilla' },
  { src: garlicBesanChilla, alt: 'Garlic Besan Chilla', label: 'Garlic Besan Chilla', price: 65, tag: 'Chilla' },
  { src: cheeseBesanChilla, alt: 'Cheese Besan Chilla', label: 'Cheese Besan Chilla', price: 63, tag: 'Chilla' },
  { src: cheeseGarlicBesanChilla, alt: 'Cheese Garlic Besan Chilla', label: 'Cheese Garlic Besan Chilla', price: 73, tag: 'Chilla' },
  { src: methiChilla, alt: 'Methi Chilla', label: 'Methi Chilla', price: 62, tag: 'Chilla' },
  { src: moongSproutsRaw, alt: 'Moong Sprouts Raw', label: 'Moong Sprouts Raw', portion: '100g', price: 43, tag: 'Sprouts' },
  { src: boiledMoongSprouts, alt: 'Boiled Moong Sprouts', label: 'Boiled Moong Sprouts', portion: '100g', price: 51, tag: 'Sprouts' },
  { src: masalaMoongSprouts, alt: 'Masala Moong Sprouts', label: 'Masala Moong Sprouts', portion: '100g', price: 57, tag: 'Sprouts' },
  { src: masalaChanaSprouts, alt: 'Masala Chana Sprouts', label: 'Masala Chana Sprouts', portion: '100g', price: 57, cal: 175, tag: 'Sprouts' },
  { src: boiledMixedSprouts, alt: 'Boiled Mixed Sprouts', label: 'Boiled Mix Sprouts', portion: '100g', price: 51, cal: 135, tag: 'Sprouts' },
  { src: masalaMatkiSprouts, alt: 'Masala Matki Sprouts', label: 'Matki Masala Sprout', portion: '100g', price: 57, tag: 'Sprouts' },
  { src: masalaSoyaChunks, alt: 'Soya Chunks Masala', label: 'Soya Chunks Masala', portion: '100g', price: 54, tag: 'Protein' },
  { src: masalaMashedPotato, alt: 'Masala Mashed Potato', label: 'Masala Mashed Potato', portion: '100g', price: 54, cal: 190, tag: 'Snacks' },
  { src: paneerBhurji, alt: 'Paneer Bhurji', label: 'Paneer Bhurji', portion: '100g', price: 97, cal: 285, tag: 'Protein' },
  { src: bananaShake, alt: 'Banana Milkshake', label: 'Banana Milkshake', portion: '350ml', price: 69, cal: 290, tag: 'Beverages' },
  { src: chocolateBananaShake, alt: 'Chocolate Banana Milkshake', label: 'Chocolate Banana Milkshake', portion: '350ml', price: 74, cal: 320, tag: 'Beverages' },
  { src: specialGymShake, alt: 'Special Gym Shake', label: 'Special Gym Shake', portion: '350ml', price: 79, tag: 'Beverages' },
  { src: appleMilkshake, alt: 'Apple Milkshake', label: 'Apple Milkshake', portion: '350ml', price: 102, tag: 'Beverages' },
  { src: blackCoffee, alt: 'Black Coffee', label: 'Black Coffee', portion: '350ml', price: 60, tag: 'Beverages' },
  { src: blackTea, alt: 'Black Tea', label: 'Black Tea', portion: '350ml', price: 60, tag: 'Beverages' },
  { src: chocolateCoffee, alt: 'Hot Coffee (Chocolate)', label: 'Hot Coffee (Chocolate)', portion: '350ml', price: 92, tag: 'Beverages' },
  { src: hotMilk, alt: 'Hot Milk', label: 'Hot Milk', portion: '350ml', price: 29, tag: 'Beverages' },
  { src: masalaMilk, alt: 'Masala Milk', label: 'Masala Milk', portion: '350ml', price: 95, tag: 'Beverages' },
  { src: hotMilkWithDryFruits, alt: 'Hot Milk with Dry Fruits', label: 'Hot Milk with Dry Fruits', portion: '350ml', price: 95, tag: 'Beverages' },
  { src: hotMilkWithFruits, alt: 'Hot Milk with Fruits (Custard)', label: 'Hot Milk with Fruits (Custard)', portion: '350ml', price: 130, tag: 'Beverages' },
];

const FILTERS = ['All', 'Chilla', 'Sprouts', 'Protein', 'Snacks', 'Beverages'];
const MOBILE_PREVIEW_COUNT = 6;

const TAG_COLORS = {
  Chilla: { bg: 'rgba(176,234,32,0.18)', color: '#1a6600', border: 'rgba(176,234,32,0.55)' },
  Sprouts: { bg: 'rgba(3,54,3,0.10)', color: '#033603', border: 'rgba(3,54,3,0.30)' },
  Protein: { bg: 'rgba(255,229,134,0.30)', color: '#7a5800', border: 'rgba(255,200,0,0.40)' },
  Snacks: { bg: 'rgba(0,0,0,0.06)', color: '#374151', border: 'rgba(0,0,0,0.14)' },
  Beverages: { bg: 'rgba(76,222,128,0.16)', color: '#166534', border: 'rgba(76,222,128,0.42)' },
};

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [active, setActive] = useState('All');
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640;
  });
  const [showAllMobile, setShowAllMobile] = useState(false);

  const visible = active === 'All' ? galleryItems : galleryItems.filter(i => i.tag === active);
  const displayedItems = isMobile && !showAllMobile ? visible.slice(0, MOBILE_PREVIEW_COUNT) : visible;
  const hiddenItemsCount = Math.max(visible.length - displayedItems.length, 0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const updateViewport = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    setShowAllMobile(false);
  }, [active, isMobile]);

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
            Freshly prepared snacks, sprouts and shakes for Dietly Nagpur, now shown with current menu pricing.
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
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedItems.map((item, i) => {
              const tagStyle = TAG_COLORS[item.tag] || TAG_COLORS.Snacks;

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
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                      style={{ background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}` }}
                    >
                      {item.tag}
                    </span>
                    <span className="absolute top-3 right-3 w-6 h-6 rounded flex items-center justify-center bg-white" style={{ border: '2px solid #22a722' }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22a722' }} />
                    </span>
                  </div>

                  <div className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display font-semibold text-sm sm:text-base" style={{ color: '#033603' }}>
                          {item.label}
                        </h3>
                        {item.portion ? (
                          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{item.portion}</p>
                        ) : null}
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 shrink-0" style={{ background: 'rgba(176,234,32,0.18)', color: '#1a6600', border: '1px solid rgba(176,234,32,0.38)' }}>
                        <IndianRupee className="w-3 h-3" />
                        {item.price}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                        Dietly Nagpur Menu
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1" style={{ background: 'rgba(255,229,134,0.35)', color: '#7a5800', border: '1px solid rgba(255,200,0,0.35)' }}>
                        <Flame className="w-3 h-3" />
                        {item.cal ? `${item.cal} kcal` : 'Calories on request'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {isMobile && !showAllMobile && hiddenItemsCount > 0 ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[28px]" style={{ background: 'linear-gradient(180deg, rgba(248,247,242,0) 0%, rgba(248,247,242,0.95) 58%, #f8f7f2 100%)' }} />
          ) : null}
        </div>

        {isMobile && visible.length > MOBILE_PREVIEW_COUNT ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-5 flex justify-center"
          >
            <button
              type="button"
              onClick={() => setShowAllMobile((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform duration-200 active:scale-[0.98]"
              style={{ background: '#033603', color: '#f8f7f2', border: '1px solid rgba(176,234,32,0.30)' }}
            >
              {showAllMobile ? 'Show fewer dishes' : `View ${hiddenItemsCount} more dishes`}
            </button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

