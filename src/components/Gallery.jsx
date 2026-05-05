import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flame, IndianRupee, ArrowLeft } from 'lucide-react';

import alooParathaButter from '../assets/dietly-menu/Aloo Paratha butter.png';
import alooParatha from '../assets/dietly-menu/Aloo Paratha.png';
import appleMilkshake from '../assets/dietly-menu/Apple Milkshake.png';
import bananaShake from '../assets/dietly-menu/banana shake.jpg';
import besanChilla from '../assets/dietly-menu/Besan Chilla.png';
import blackCoffee from '../assets/dietly-menu/Black Coffee.png';
import blackTea from '../assets/dietly-menu/black tea.png';
import boiledChanaSprouts from '../assets/dietly-menu/Boiled Chana Sprouts.png';
import boiledMixedSprouts from '../assets/dietly-menu/Boiled Mixed Sprouts.png';
import boiledMoongSprouts from '../assets/dietly-menu/Boiled Moong Sprouts.png';
import butterBesanChilla from '../assets/dietly-menu/Butter Besan Chilla.png';
import butterGarlicBesanChilla from '../assets/dietly-menu/Butter Garlic Besan Chilla.png';
import butterPaneerBhurji from '../assets/dietly-menu/Butter Paneer Bhurji.png';
import chanaSproutsRaw from '../assets/dietly-menu/Chana Sprouts Raw.png';
import cheeseBesanChilla from '../assets/dietly-menu/Cheese Besan Chilla.png';
import cheeseGarlicBesanChilla from '../assets/dietly-menu/Cheese Garlic Besan Chilla.png';
import chocolateBananaShake from '../assets/dietly-menu/chocolate banana shake.jpg';
import chocolateCoffee from '../assets/dietly-menu/Hot Coffee (Chocolate flavour).png';
import fruitSalad from '../assets/dietly-menu/Fruit Salad.png';
import garlicBesanChilla from '../assets/dietly-menu/Garlic Besan Chilla.png';
import hotMilk from '../assets/dietly-menu/Hot Milk.png';
import hotMilkChocolate from '../assets/dietly-menu/Hot Milk(Chocolate flavour).png';
import hotMilkWithDryFruits from '../assets/dietly-menu/Hot Milk with Dry Fruits.png';
import hotMilkWithFruits from '../assets/dietly-menu/Hot Milk with Fruits (Custard).png';
import kacchaChivda from '../assets/dietly-menu/Kaccha Chivda.png';
import malaiDahi from '../assets/dietly-menu/Malai Dahi.png';
import masalaChanaSprouts from '../assets/dietly-menu/Masala Chana Sprouts.png';
import masalaMashedPotato from '../assets/dietly-menu/Masala Mashed Potato.png';
import masalaMatkiSprouts from '../assets/dietly-menu/Masala Matki Sprouts.png';
import masalaMilk from '../assets/dietly-menu/Masala Milk.png';
import masalaMixSprouts from '../assets/dietly-menu/Masala Mix Sprouts.png';
import masalaMoongSprouts from '../assets/dietly-menu/Masala Moong Sprouts.png';
import masalaSoyaChunks from '../assets/dietly-menu/masala soya chunks.png';
import matkiSproutsRaw from '../assets/dietly-menu/Matki Sprouts Raw.png';
import methiChilla from '../assets/dietly-menu/Methi Chilla.png';
import mixedSproutsRaw from '../assets/dietly-menu/Mixed Sprouts Raw.png';
import moongSproutsRaw from '../assets/dietly-menu/Moong Sprouts Raw.png';
import palakParatha from '../assets/dietly-menu/Palak Paratha.png';
import paneerBhurji from '../assets/dietly-menu/Paneer Bhurji.png';
import paneerButterParatha from '../assets/dietly-menu/Paneer Butter Paratha.png';
import paneerParatha from '../assets/dietly-menu/Paneer Paratha.png';
import paneerWithGarlicSauteed from '../assets/dietly-menu/Paneer With Garlic Sauteed.png';
import paneerWithVeggiesSauteed from '../assets/dietly-menu/Paneer with Veggies Sauteed.png';
import plainMashedPotato from '../assets/dietly-menu/plain mashed potato.png';
import sauteedPaneer from '../assets/dietly-menu/Sauteed Paneer.png';
import specialGymShake from '../assets/dietly-menu/Special Gym Shake.jpg';
import sprousBhel from '../assets/dietly-menu/Sprous Bhel.png';
import sproutsParatha from '../assets/dietly-menu/Sprouts Paratha.png';
import tossedPaneerWithSalad from '../assets/dietly-menu/Tossed Paneer with Salad.png';
import vegSalad from '../assets/dietly-menu/Veg Salad.png';

const ZOMATO_URL = import.meta.env.VITE_ZOMATO_URL || 'https://zomato.onelink.me/xqzv/yrvrksby';

const DEFAULT_CATEGORY_IMAGES = {
  Chilla: besanChilla,
  Sprouts: masalaMoongSprouts,
  Paratha: alooParatha,
  Paneer: paneerBhurji,
  Snacks: masalaMashedPotato,
  Beverages: bananaShake,
};

const CATEGORIES = [
  {
    name: 'Chilla',
    cover: besanChilla,
    desc: '6 varieties',
    items: [
      { src: besanChilla, label: 'Besan Chilla', price: 52, cal: 165, protein: '8g', carbs: '22g' },
      { src: butterBesanChilla, label: 'Butter Besan Chilla', price: 54, cal: 185, protein: '8g', carbs: '23g' },
      { src: garlicBesanChilla, label: 'Garlic Besan Chilla', price: 65, cal: 172, protein: '9g', carbs: '24g' },
      { src: cheeseBesanChilla, label: 'Cheese Besan Chilla', price: 63, cal: 195, protein: '11g', carbs: '23g' },
      { src: cheeseGarlicBesanChilla, label: 'Cheese Garlic Besan Chilla', price: 73, cal: 205, protein: '12g', carbs: '25g' },
      { src: methiChilla, label: 'Methi Chilla', price: 62, cal: 168, protein: '9g', carbs: '21g' },
    ],
  },
  {
    name: 'Sprouts',
    cover: masalaMoongSprouts,
    desc: '11 varieties',
    items: [
      { src: moongSproutsRaw, label: 'Moong Sprouts Raw', portion: '100g', price: 43, cal: 105, protein: '10g', carbs: '12g' },
      { src: boiledMoongSprouts, label: 'Boiled Moong Sprouts', portion: '100g', price: 51, cal: 135, protein: '11g', carbs: '14g' },
      { src: masalaMoongSprouts, label: 'Masala Moong Sprouts', portion: '100g', price: 57, cal: 145, protein: '11g', carbs: '15g' },
      { src: masalaChanaSprouts, label: 'Masala Chana Sprouts', portion: '100g', price: 57, cal: 175, protein: '12g', carbs: '18g' },
      { src: boiledMixedSprouts, label: 'Boiled Mixed Sprouts', portion: '100g', price: 51, cal: 135, protein: '11g', carbs: '14g' },
      { src: masalaMatkiSprouts, label: 'Masala Matki Sprouts', portion: '100g', price: 57, cal: 148, protein: '10g', carbs: '16g' },
      { src: boiledChanaSprouts, label: 'Boiled Chana Sprouts', portion: '100g', price: 58, cal: 140, protein: '12g', carbs: '15g' },
      { src: chanaSproutsRaw, label: 'Chana Sprouts Raw', portion: '100g', price: 49, cal: 125, protein: '11g', carbs: '13g' },
      { src: masalaMixSprouts, label: 'Masala Mix Sprouts', portion: '100g', price: 56, cal: 155, protein: '12g', carbs: '17g' },
      { src: matkiSproutsRaw, label: 'Matki Sprouts Raw', portion: '100g', price: 45, cal: 118, protein: '9g', carbs: '12g' },
      { src: mixedSproutsRaw, label: 'Mixed Sprouts Raw', portion: '100g', price: 50, cal: 128, protein: '10g', carbs: '13g' },
    ],
  },
  {
    name: 'Paratha',
    cover: alooParatha,
    desc: '7 varieties',
    items: [
      { src: alooParatha, label: 'Aloo Paratha', price: 65, cal: 285, protein: '8g', carbs: '38g' },
      { src: alooParathaButter, label: 'Aloo Paratha Butter', price: 72, cal: 320, protein: '8g', carbs: '40g' },
      { src: palakParatha, label: 'Palak Paratha', price: 75, cal: 295, protein: '9g', carbs: '36g' },
      { src: paneerParatha, label: 'Paneer Paratha', price: 92, cal: 350, protein: '14g', carbs: '38g' },
      { src: sproutsParatha, label: 'Sprouts Paratha', price: 85, cal: 310, protein: '11g', carbs: '39g' },
      { src: paneerButterParatha, label: 'Paneer Butter Paratha', price: 99, cal: 375, protein: '15g', carbs: '40g' },
      { label: 'Methi Paratha', price: 72, cal: 300, protein: '9g', carbs: '37g' },
    ],
  },
  {
    name: 'Paneer',
    cover: butterPaneerBhurji,
    desc: '11 varieties',
    items: [
      { src: paneerBhurji, label: 'Paneer Bhurji', portion: '100g', price: 97, cal: 285, protein: '18g', carbs: '6g' },
      { src: butterPaneerBhurji, label: 'Butter Paneer Bhurji', portion: '100g', price: 115, cal: 305, protein: '18g', carbs: '7g' },
      { src: paneerWithGarlicSauteed, label: 'Paneer With Garlic Sauteed', portion: '100g', price: 119, cal: 295, protein: '19g', carbs: '5g' },
      { src: paneerWithVeggiesSauteed, label: 'Paneer with Veggies Sauteed', portion: '100g', price: 125, cal: 305, protein: '19g', carbs: '8g' },
      { src: sauteedPaneer, label: 'Sauteed Paneer', portion: '100g', price: 109, cal: 290, protein: '19g', carbs: '4g' },
      { src: tossedPaneerWithSalad, label: 'Tossed Paneer with Salad', portion: '100g', price: 129, cal: 245, protein: '20g', carbs: '8g' },
      { label: 'Paneer Tikka', portion: '100g', price: 135, cal: 275, protein: '21g', carbs: '5g' },
      { label: 'Paneer Kadai', portion: '100g', price: 145, cal: 315, protein: '20g', carbs: '9g' },
      { label: 'Paneer Masala', portion: '100g', price: 139, cal: 325, protein: '19g', carbs: '11g' },
      { label: 'Paneer Lababdar', portion: '100g', price: 149, cal: 335, protein: '20g', carbs: '12g' },
      { label: 'Paneer Shahi Korma', portion: '100g', price: 159, cal: 345, protein: '19g', carbs: '14g' },
    ],
  },
  {
    name: 'Snacks',
    cover: masalaMashedPotato,
    desc: '10 varieties',
    items: [
      { src: masalaMashedPotato, label: 'Masala Mashed Potato', portion: '100g', price: 54, cal: 190, protein: '4g', carbs: '28g' },
      { src: plainMashedPotato, label: 'Plain Mashed Potato', portion: '100g', price: 49, cal: 165, protein: '3g', carbs: '24g' },
      { src: kacchaChivda, label: 'Kaccha Chivda', portion: '100g', price: 55, cal: 245, protein: '7g', carbs: '20g' },
      { src: fruitSalad, label: 'Fruit Salad', portion: '100g', price: 69, cal: 85, protein: '1g', carbs: '20g' },
      { src: vegSalad, label: 'Veg Salad', portion: '100g', price: 65, cal: 65, protein: '2g', carbs: '12g' },
      { src: sprousBhel, label: 'Sprous Bhel', portion: '100g', price: 62, cal: 155, protein: '6g', carbs: '22g' },
      { src: masalaSoyaChunks, label: 'Masala Soya Chunks', portion: '100g', price: 54, cal: 185, protein: '16g', carbs: '8g' },
      { src: malaiDahi, label: 'Malai Dahi', portion: '100g', price: 88, cal: 215, protein: '8g', carbs: '14g' },
      { label: 'Chana Chaat', portion: '100g', price: 79, cal: 185, protein: '8g', carbs: '24g' },
      { label: 'Corn Chaat', portion: '100g', price: 79, cal: 175, protein: '5g', carbs: '28g' },
    ],
  },
  {
    name: 'Beverages',
    cover: bananaShake,
    desc: '12 varieties',
    items: [
      { src: bananaShake, label: 'Banana Milkshake', portion: '350ml', price: 69, cal: 290, protein: '10g', carbs: '42g' },
      { src: chocolateBananaShake, label: 'Chocolate Banana Shake', portion: '350ml', price: 74, cal: 320, protein: '11g', carbs: '48g' },
      { src: specialGymShake, label: 'Special Gym Shake', portion: '350ml', price: 79, cal: 315, protein: '25g', carbs: '28g' },
      { src: appleMilkshake, label: 'Apple Milkshake', portion: '350ml', price: 102, cal: 285, protein: '10g', carbs: '40g' },
      { src: blackCoffee, label: 'Black Coffee', portion: '350ml', price: 60, cal: 8, protein: '0g', carbs: '1g' },
      { src: blackTea, label: 'Black Tea', portion: '350ml', price: 60, cal: 5, protein: '0g', carbs: '0g' },
      { src: chocolateCoffee, label: 'Hot Coffee (Chocolate)', portion: '350ml', price: 92, cal: 145, protein: '5g', carbs: '18g' },
      { src: hotMilk, label: 'Hot Milk', portion: '350ml', price: 29, cal: 140, protein: '8g', carbs: '12g' },
      { src: hotMilkChocolate, label: 'Hot Milk (Chocolate)', portion: '350ml', price: 65, cal: 185, protein: '8g', carbs: '22g' },
      { src: masalaMilk, label: 'Masala Milk', portion: '350ml', price: 95, cal: 155, protein: '8g', carbs: '15g' },
      { src: hotMilkWithDryFruits, label: 'Hot Milk with Dry Fruits', portion: '350ml', price: 95, cal: 225, protein: '9g', carbs: '28g' },
      { src: hotMilkWithFruits, label: 'Hot Milk with Fruits', portion: '350ml', price: 130, cal: 245, protein: '8g', carbs: '35g' },
    ],
  },
];

const TAG_COLORS = {
  Chilla:    { bg: 'rgba(176,234,32,0.18)', color: '#1a6600', border: 'rgba(176,234,32,0.55)' },
  Sprouts:   { bg: 'rgba(3,54,3,0.10)',     color: '#033603', border: 'rgba(3,54,3,0.30)' },
  Paratha:   { bg: 'rgba(236,72,153,0.12)',  color: '#831843', border: 'rgba(236,72,153,0.35)' },
  Paneer:    { bg: 'rgba(255,229,134,0.30)', color: '#7a5800', border: 'rgba(255,200,0,0.40)' },
  Snacks:    { bg: 'rgba(0,0,0,0.06)',       color: '#374151', border: 'rgba(0,0,0,0.14)' },
  Beverages: { bg: 'rgba(76,222,128,0.16)',  color: '#166534', border: 'rgba(76,222,128,0.42)' },
};

function MealCard({ item, tag, index }) {
  const tagStyle = TAG_COLORS[tag] || TAG_COLORS.Snacks;
  const imageSrc = item.src || DEFAULT_CATEGORY_IMAGES[tag] || bananaShake;
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
          src={imageSrc}
          alt={item.label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = DEFAULT_CATEGORY_IMAGES[tag] || bananaShake;
          }}
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
        <div className="mt-2.5 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}` }}
            >{tag}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {item.cal && <div className="rounded px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(255,229,134,0.20)', color: '#7a5800' }}>
              <Flame className="w-3 h-3" /><span className="font-semibold">{item.cal}</span>
            </div>}
            {item.protein && <div className="rounded px-2 py-1 font-semibold" style={{ background: 'rgba(239,68,68,0.15)', color: '#991b1b' }}>
              P: {item.protein}
            </div>}
            {item.carbs && <div className="rounded px-2 py-1 font-semibold" style={{ background: 'rgba(59,130,246,0.15)', color: '#1e40af' }}>
              C: {item.carbs}
            </div>}
          </div>
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
            Hey, I recommend ordering from Dietly on Zomato{' '}
            <a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
            >
              Order on Zomato
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

