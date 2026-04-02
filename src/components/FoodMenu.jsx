import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flame, Leaf, Dumbbell, Heart, UtensilsCrossed } from 'lucide-react';
import { mealsAPI } from '../services/api';

const categories = [
  { id: 'all', label: 'All Meals', icon: UtensilsCrossed },
  { id: 'weight-loss', label: 'Weight Loss', icon: Flame },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: Dumbbell },
  { id: 'keto', label: 'Keto', icon: Leaf },
  { id: 'balanced', label: 'Balanced', icon: Heart },
];

const fallbackMeals = [
  { name: 'Grilled Chicken Bowl', category: 'muscle-gain', calories: 520, protein: '45g', carbs: '38g', fat: '12g', emoji: '🍗', tag: 'High Protein', tagColor: 'green' },
  { name: 'Quinoa Power Salad', category: 'weight-loss', calories: 320, protein: '18g', carbs: '42g', fat: '8g', emoji: '🥗', tag: 'Low Cal', tagColor: 'blue' },
  { name: 'Salmon & Brown Rice', category: 'balanced', calories: 480, protein: '38g', carbs: '45g', fat: '14g', emoji: '🐟', tag: 'Omega Rich', tagColor: 'cyan' },
  { name: 'Keto Avocado Plate', category: 'keto', calories: 410, protein: '22g', carbs: '8g', fat: '32g', emoji: '🥑', tag: 'Keto', tagColor: 'purple' },
  { name: 'Egg White Omelette', category: 'weight-loss', calories: 280, protein: '32g', carbs: '12g', fat: '6g', emoji: '🍳', tag: 'Low Cal', tagColor: 'cyan' },
  { name: 'Paneer Tikka Bowl', category: 'muscle-gain', calories: 490, protein: '35g', carbs: '40g', fat: '18g', emoji: '🧀', tag: 'Veg Protein', tagColor: 'green' },
  { name: 'Butter Chicken Lite', category: 'balanced', calories: 440, protein: '40g', carbs: '30g', fat: '15g', emoji: '🍛', tag: 'Chef Special', tagColor: 'orange' },
  { name: 'Keto Chicken Wrap', category: 'keto', calories: 380, protein: '34g', carbs: '6g', fat: '24g', emoji: '🌯', tag: 'Keto', tagColor: 'purple' },
];

const tagColorMap = {
  green: 'bg-brand-green/8 text-brand-green border-brand-green/15',
  blue: 'bg-cyan-400/8 text-cyan-400 border-cyan-400/15',
  cyan: 'bg-cyan-400/8 text-cyan-400 border-cyan-400/15',
  purple: 'bg-purple-400/8 text-purple-400 border-purple-400/15',
  orange: 'bg-brand-orange/8 text-brand-orange border-brand-orange/15',
  yellow: 'bg-amber-400/8 text-amber-400 border-amber-400/15',
  red: 'bg-red-400/8 text-red-400 border-red-400/15',
};

export default function FoodMenu() {
  const [active, setActive] = useState('all');
  const [meals, setMeals] = useState(fallbackMeals);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fetchMeals = useCallback(async () => {
    try {
      const params = active !== 'all' ? { category: active } : {};
      const { data } = await mealsAPI.getAll(params);
      if (data.data?.length) setMeals(data.data);
    } catch {
      // keep fallback
    }
  }, [active]);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  const filtered = active === 'all' ? meals : meals.filter((m) => m.category === active);

  const getMealDisplay = (meal) => ({
    ...meal,
    cal: meal.calories || meal.cal,
    tagColorClass: tagColorMap[meal.tagColor] || tagColorMap.green,
  });

  return (
    <section id="menu" className="relative section-padding overflow-hidden scroll-mt-24">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-brand-orange/[0.025] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/[0.025] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-18"
        >
          <span className="badge-pill text-brand-green mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            Our Menu
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.5rem] tracking-tight mb-5 leading-[1.1]">
            Meals That <span className="gradient-text-mixed">Perform</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-base sm:text-lg font-light">
            Every meal designed by nutritionists, cooked by chefs who understand fitness.
          </p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-14"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              whileTap={{ scale: 0.93 }}
              className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 overflow-hidden ${
                active === cat.id
                  ? 'bg-brand-green text-brand-dark shadow-glow-green scale-105'
                  : 'glass-card text-white/35 hover:text-white/60 hover:bg-white/[0.05]'
              }`}
            >
              <cat.icon className={`w-3.5 h-3.5 transition-transform duration-400 ${active === cat.id ? 'scale-110' : ''}`} />
              {cat.label}
              {active === cat.id && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-brand-green rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Meals grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((rawMeal, idx) => {
              const meal = getMealDisplay(rawMeal);
              return (
              <motion.div
                key={meal.name}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-[1.5rem] glass-card overflow-hidden transition-all duration-600 hover:-translate-y-4 hover:shadow-premium-lg border border-white/[0.03] hover:border-white/[0.07] spotlight-card"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                {/* Meal visual area */}
                <div className="relative h-44 flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden">
                  <div className="absolute inset-0 bg-brand-green/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                  <motion.span
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="text-6xl sm:text-7xl transition-all duration-700 ease-out cursor-default"
                  >
                    {meal.emoji}
                  </motion.span>
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border ${meal.tagColorClass} backdrop-blur-sm`}>
                    {meal.tag}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-base mb-4 text-white/85 group-hover:text-white transition-colors duration-300">
                    {meal.name}
                  </h3>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Cal', value: meal.cal, accent: false },
                      { label: 'Protein', value: meal.protein, accent: true },
                      { label: 'Carbs', value: meal.carbs, accent: false },
                      { label: 'Fat', value: meal.fat, accent: false },
                    ].map((macro) => (
                      <div key={macro.label} className="py-2 rounded-xl bg-white/[0.02] text-center group-hover:bg-white/[0.04] transition-all duration-400">
                        <div className={`text-xs font-bold transition-colors duration-400 ${macro.accent ? 'text-brand-green group-hover:text-brand-green-light' : 'text-white/60'}`}>{macro.value}</div>
                        <div className="text-[9px] text-white/20 mt-0.5 font-mono">{macro.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
