import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { ArrowRight, Play, Sparkles, ChevronDown } from 'lucide-react';
import logo from '../assets/dietly-logo.png';

/* ── Word-by-word stagger animation with 3D flip ── */
function AnimatedWords({ text, className, delay = 0 }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ perspective: '800px' }}>
          <motion.span
            className="inline-block"
            initial={{ y: '120%', rotateX: -90, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: '0%', rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 1,
              delay: delay + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Floating particle system with varied behaviors ── */
function Particles() {
  const particles = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 20 + 12,
      delay: Math.random() * 8,
      drift: (Math.random() - 0.5) * 30,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0
              ? 'rgba(0,232,108,0.35)'
              : p.id % 3 === 1
              ? 'rgba(255,107,44,0.2)'
              : 'rgba(255,255,255,0.15)',
          }}
          animate={{
            y: [0, -80 - Math.random() * 40, 0],
            x: [0, p.drift, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating meal cards data ── */
const floatingCards = [
  { emoji: '🥗', label: 'Power Salad', cal: '320 kcal', protein: '28g', x: '6%', y: '20%', delay: 0 },
  { emoji: '🍗', label: 'Grilled Chicken', cal: '480 kcal', protein: '45g', x: '84%', y: '12%', delay: 1.5 },
  { emoji: '🥑', label: 'Keto Bowl', cal: '410 kcal', protein: '22g', x: '3%', y: '65%', delay: 3 },
  { emoji: '🍳', label: 'Protein Omelette', cal: '280 kcal', protein: '32g', x: '87%', y: '58%', delay: 2 },
  { emoji: '🐟', label: 'Salmon Rice', cal: '520 kcal', protein: '38g', x: '78%', y: '38%', delay: 4 },
];

/* ── Marquee strip data ── */
const marqueeItems = [
  'High Protein', 'Keto Friendly', 'Zero Oil', 'Macro Balanced', 'Fresh Daily',
  'Chef Crafted', 'No Preservatives', 'Calorie Counted', 'Gym Approved', 'Veg & Non-Veg',
  'Delivered Hot', 'Custom Diet', 'Lab Tested', 'Zero Wastage', 'Eco Packaging',
];

/* ── Magnetic hover card ── */
function MagneticCard({ children, className, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.22], [1, 0.92]);
  const blur = useTransform(scrollYProgress, [0, 0.22], [0, 10]);
  const blurFilter = useMotionTemplate`blur(${blur}px)`;

  /* Mouse tracking for interactive effects */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 50);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 50);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  /* Badge typing animation */
  const [badgeVisible, setBadgeVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBadgeVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="home" className="relative min-h-[110vh] flex flex-col justify-center overflow-hidden">
      {/* ── Aurora animated background ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-[700px] h-[700px] bg-brand-green/[0.08] blur-[180px] animate-morph" />
        <div className="absolute bottom-[5%] right-[5%] w-[600px] h-[600px] bg-brand-orange/[0.06] blur-[160px] animate-morph" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] aurora-bg opacity-60" />
        <div className="absolute -top-40 right-[20%] w-[400px] h-[400px] bg-brand-green/[0.04] rounded-full blur-[120px] animate-blob" />
        {/* New: pulsing center ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-brand-green/[0.04] animate-breathe" />
      </motion.div>

      {/* ── Dot grid pattern ── */}
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-40" />

      {/* ── Floating particles ── */}
      <Particles />

      {/* ── Spinning decorative orbits with scroll parallax ── */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div className="w-[900px] h-[900px] rounded-full border border-white/[0.015] animate-spin-slow opacity-50" />
        <div className="absolute inset-10 rounded-full border border-dashed border-brand-green/[0.04] animate-spin-reverse" />
        <div className="absolute inset-24 rounded-full border border-white/[0.012] animate-spin-slow" style={{ animationDuration: '35s' }} />
        <div className="absolute inset-40 rounded-full border border-brand-green/[0.025] animate-spin-reverse" style={{ animationDuration: '45s' }} />
        {/* New: dotted orbit */}
        <div className="absolute inset-56 rounded-full border border-dotted border-white/[0.02] animate-spin-slow" style={{ animationDuration: '55s' }} />
      </motion.div>

      {/* ── Floating food cards (desktop) with magnetic hover ── */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.3, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.4 + card.delay * 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute hidden lg:block z-10"
          style={{ left: card.x, top: card.y }}
        >
          <MagneticCard>
            <motion.div
              animate={{ y: [0, -18, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
              className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3.5 hover:bg-white/[0.08] hover:scale-110 hover:shadow-glow-green transition-all duration-500 cursor-default group backdrop-blur-xl spotlight-card"
            >
              <span className="text-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{card.emoji}</span>
              <div>
                <div className="text-[11px] font-semibold text-white/80 group-hover:text-white transition-colors">{card.label}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-brand-green/70 font-mono">{card.cal}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                  <span className="text-[10px] text-brand-orange/60 font-mono">{card.protein} protein</span>
                </div>
              </div>
            </motion.div>
          </MagneticCard>
        </motion.div>
      ))}

      {/* ── Main Content ── */}
      <motion.div
        style={{ opacity, scale, filter: blurFilter }}
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 text-center pt-32 sm:pt-36 lg:pt-40 pb-8"
      >
        {/* Badge */}
        <AnimatePresence>
          {badgeVisible && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.85, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center mb-10"
            >
              <div className="badge-pill neon-border-green group cursor-default hover:bg-white/[0.06] transition-all duration-500 hover:scale-105">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green shadow-glow-green" />
                </span>
                <span className="text-[13px] font-medium text-white/50 group-hover:text-white/70 transition-colors">
                  India&apos;s #1 Fitness Meal Subscription
                </span>
                <Sparkles className="w-3.5 h-3.5 text-brand-orange/60 group-hover:text-brand-orange group-hover:rotate-12 transition-all duration-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo with breathe animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, filter: 'blur(25px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="relative group">
            <img
              src={logo}
              alt="Dietly"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-brand-green/10 blur-[40px] rounded-full scale-150 -z-10 animate-breathe" />
          </div>
        </motion.div>

        {/* Headline — word-by-word reveal with 3D flip */}
        <h1 className="font-display font-bold tracking-[-0.04em] leading-[0.88] mb-8">
          <span className="block text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem]">
            <AnimatedWords text="Fuel Your" delay={0.5} />
          </span>
          <span className="block text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem]">
            <span className="gradient-text-hero">
              <AnimatedWords text="Fitness" delay={0.7} />
            </span>
          </span>
          <span className="block text-[2.25rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] text-white/70">
            <AnimatedWords text="Journey" delay={0.9} />
          </span>
        </h1>

        {/* Subtext with character stagger */}
        <motion.p
          initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 1.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto text-base sm:text-lg md:text-xl text-white/30 leading-relaxed mb-14 font-light text-balance"
        >
          Chef-crafted, macro-balanced meals delivered to your door daily.
          <br className="hidden sm:block" />
          <span className="text-white/50">Zero cooking. Zero counting. Only results.</span>
        </motion.p>

        {/* CTA Buttons with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 1.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-20"
        >
          <a href="#plans" className="btn-primary text-base sm:text-lg group px-10 py-5 hover:shadow-glow-green-lg">
            <span>Start Your Plan</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-400" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-0 rounded-2xl bg-brand-green/20 animate-pulse-ring -z-10" />
          </a>

          <a href="#menu" className="btn-ghost text-base sm:text-lg group px-10 py-5">
            <Play className="w-4 h-4 text-brand-green group-hover:scale-125 group-hover:text-brand-green-light transition-all duration-400" />
            <span>Explore Menu</span>
          </a>
        </motion.div>

        {/* Trust indicators with counter-style reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-10 sm:gap-16"
        >
          {[
            { value: '10,000+', label: 'Meals Delivered' },
            { value: '5,000+', label: 'Happy Members' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center group cursor-default"
            >
              <div className="font-display font-bold text-2xl sm:text-3xl gradient-text-mixed group-hover:scale-110 transition-transform duration-500 hover-glow-text">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs text-white/25 font-medium mt-1 tracking-wide uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Dual Marquee ticker strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="relative z-10 mt-auto py-6"
      >
        <div className="section-divider mb-6" />
        {/* Forward marquee */}
        <div className="marquee-container mb-3">
          <div className="inline-flex animate-marquee">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-3 mx-6 text-xs sm:text-sm font-medium text-white/15 uppercase tracking-[0.12em] whitespace-nowrap hover:text-white/30 transition-colors duration-400">
                <span className="w-1 h-1 rounded-full bg-brand-green/30" />
                {item}
              </span>
            ))}
          </div>
        </div>
        {/* Reverse marquee */}
        <div className="marquee-container opacity-50">
          <div className="inline-flex animate-marquee-reverse">
            {[...marqueeItems.slice().reverse(), ...marqueeItems.slice().reverse()].map((item, i) => (
              <span key={i} className="flex items-center gap-3 mx-6 text-[10px] sm:text-xs font-medium text-white/10 uppercase tracking-[0.15em] whitespace-nowrap">
                <span className="w-0.5 h-0.5 rounded-full bg-brand-orange/20" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent pointer-events-none" />

      {/* ── Scroll indicator with refined animation ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/12 font-mono">Scroll</span>
          <div className="relative">
            <ChevronDown className="w-4 h-4 text-white/12" />
            <div className="absolute inset-0 animate-ping">
              <ChevronDown className="w-4 h-4 text-brand-green/20" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
