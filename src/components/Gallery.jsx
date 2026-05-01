import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flame, IndianRupee, ArrowLeft } from 'lucide-react';

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

const SWIGGY_URL = import.meta.env.VITE_SWIGGY_URL || 'https://www.swiggy.com/';

const CATEGORIES = [
  {
    name: 'Chilla',
    cover: besanChilla,
    desc: '6 varieties',
    items: [
      { src: besanChilla, label: 'Besan Chilla', price: 52 },
      { src: butterBesanChilla, label: 'Butter Besan Chilla', price: 54 },
      { src: garlicBesanChilla, label: 'Garlic Besan Chilla', price: 65 },
      { src: cheeseBesanChilla, label: 'Cheese Besan Chilla', price: 63 },
      { src: cheeseGarlicBesanChilla, label: 'Cheese Garlic Besan Chilla', price: 73 },
      { src: methiChilla, label: 'Methi Chilla', price: 62 },
    ],
  },
  {
    name: 'Sprouts',
    cover: masalaMoongSprouts,
    desc: '6 varieties',
    items: [
      { src: moongSproutsRaw, label: 'Moong Sprouts Raw', portion: '100g', price: 43 },
      { src: boiledMoongSprouts, label: 'Boiled Moong Sprouts', portion: '100g', price: 51 },
      { src: masalaMoongSprouts, label: 'Masala Moong Sprouts', portion: '100g', price: 57 },
      { src: masalaChanaSprouts, label: 'Masala Chana Sprouts', portion: '100g', price: 57, cal: 175 },
      { src: boiledMixedSprouts, label: 'Boiled Mix Sprouts', portion: '100g', price: 51, cal: 135 },
      { src: masalaMatkiSprouts, label: 'Matki Masala Sprout', portion: '100g', price: 57 },
    ],
  },
  {
    name: 'Protein',
    cover: paneerBhurji,
    desc: '2 varieties',
    items: [
      { src: masalaSoyaChunks, label: 'Soya Chunks Masala', portion: '100g', price: 54 },
      { src: paneerBhurji, label: 'Paneer Bhurji', portion: '100g', price: 97, cal: 285 },
    ],
  },
  {
    name: 'Snacks',
    cover: masalaMashedPotato,
    desc: '1 variety',
    items: [
      { src: masalaMashedPotato, label: 'Masala Mashed Potato', portion: '100g', price: 54, cal: 190 },
    ],
  },
  {
    name: 'Beverages',
    cover: bananaShake,
    desc: '11 varieties',
    items: [
      { src: bananaShake, label: 'Banana Milkshake', portion: '350ml', price: 69, cal: 290 },
      { src: chocolateBananaShake, label: 'Chocolate Banana Shake', portion: '350ml', price: 74, cal: 320 },
      { src: specialGymShake, label: 'Special Gym Shake', portion: '350ml', price: 79 },
      { src: appleMilkshake, label: 'Apple Milkshake', portion: '350ml', price: 102 },
      { src: blackCoffee, label: 'Black Coffee', portion: '350ml', price: 60 },
      { src: blackTea, label: 'Black Tea', portion: '350ml', price: 60 },
      { src: chocolateCoffee, label: 'Hot Coffee (Chocolate)', portion: '350ml', price: 92 },
      { src: hotMilk, label: 'Hot Milk', portion: '350ml', price: 29 },
      { src: masalaMilk, label: 'Masala Milk', portion: '350ml', price: 95 },
      { src: hotMilkWithDryFruits, label: 'Hot Milk with Dry Fruits', portion: '350ml', price: 95 },
      { src: hotMilkWithFruits, label: 'Hot Milk with Fruits', portion: '350ml', price: 130 },
    ],
  },
];

const TAG_COLORS = {
  Chilla:    { bg: 'rgba(176,234,32,0.18)', color: '#1a6600', border: 'rgba(176,234,32,0.55)' },
  Sprouts:   { bg: 'rgba(3,54,3,0.10)',     color: '#033603', border: 'rgba(3,54,3,0.30)' },
  Protein:   { bg: 'rgba(255,229,134,0.30)', color: '#7a5800', border: 'rgba(255,200,0,0.40)' },
  Snacks:    { bg: 'rgba(0,0,0,0.06)',       color: '#374151', border: 'rgba(0,0,0,0.14)' },
  Beverages: { bg: 'rgba(76,222,128,0.16)',  color: '#166534', border: 'rgba(76,222,128,0.42)' },
};

function MealCard({ item, tag, index }) {
  const tagStyle = TAG_COLORS[tag];
  return (
    <motion.div
      key={item.label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.04 * index }}
      className="card card-hover overflow-hidden group"
    >
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={item.src}
          alt={item.label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 w-6 h-6 rounded flex items-center justify-center bg-white" style={{ border: '2px solid #22a722' }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22a722' }} />
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base leading-snug" style={{ color: '#033603' }}>
              {item.label}
            </h3>
            {item.portion && <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{item.portion}</p>}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 shrink-0" style={{ background: 'rgba(176,234,32,0.18)', color: '#1a6600', border: '1px solid rgba(176,234,32,0.38)' }}>
            <IndianRupee className="w-3 h-3" />{item.price}
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}` }}
          >{tag}</span>
          <span className="flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1" style={{ background: 'rgba(255,229,134,0.35)', color: '#7a5800', border: '1px solid rgba(255,200,0,0.35)' }}>
            <Flame className="w-3 h-3" />
            {item.cal ? `${item.cal} kcal` : 'On request'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [selected, setSelected] = useState(null);

  const category = selected ? CATEGORIES.find(c => c.name === selected) : null;

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
            Freshly prepared meals for Dietly Nagpur. Pick a category to explore the variety.
          </p>
          <p className="mt-4 text-sm sm:text-base" style={{ color: '#476107' }}>
            Want instant ordering?{' '}
            <a
              href={SWIGGY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
            >
              Order on Swiggy
            </a>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selected ? (
            /* ── Category grid ── */
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5"
            >
              {CATEGORIES.map((cat, i) => {
                const tagStyle = TAG_COLORS[cat.name];
                return (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.07 * i }}
                    onClick={() => setSelected(cat.name)}
                    className="group relative overflow-hidden rounded-2xl shadow-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ border: `2px solid ${tagStyle.border}` }}
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img
                        src={cat.cover}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        loading="lazy"
                      />
                      {/* dark gradient overlay */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(3,54,3,0.75) 100%)' }} />
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <p className="font-display font-bold text-white text-base sm:text-lg leading-tight">{cat.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{cat.desc}</p>
                      </div>
                    </div>
                    <div
                      className="px-3 py-2.5 flex items-center justify-between"
                      style={{ background: tagStyle.bg }}
                    >
                      <span className="text-xs font-semibold" style={{ color: tagStyle.color }}>Tap to explore</span>
                      <span className="text-xs font-bold" style={{ color: tagStyle.color }}>→</span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            /* ── Item grid for selected category ── */
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.32 }}
            >
              {/* Back button + heading */}
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all active:scale-95"
                  style={{ background: '#033603', color: '#f8f7f2', border: '1px solid rgba(176,234,32,0.30)' }}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h3 className="font-display font-bold text-xl sm:text-2xl" style={{ color: '#033603' }}>
                  {selected}
                  <span className="ml-2 text-sm font-medium" style={{ color: '#6B7280' }}>
                    ({category.items.length} {category.items.length === 1 ? 'item' : 'items'})
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {category.items.map((item, i) => (
                  <MealCard key={item.label} item={item} tag={selected} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

