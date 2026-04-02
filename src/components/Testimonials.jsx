import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import { testimonialsAPI } from '../services/api';

const fallbackTestimonials = [
  { name: 'Arjun Mehta', role: 'Fitness Enthusiast', text: 'Dietly completely changed how I eat. Lost 8kg in 3 months while building lean muscle. The food is genuinely delicious — not your typical "diet food."', rating: 5, avatar: '🧑‍💻' },
  { name: 'Priya Sharma', role: 'Yoga Instructor', text: 'As a yoga instructor, nutrition is everything. Dietly meals are clean, balanced, and show up on time every single day. I recommend it to all my students.', rating: 5, avatar: '👩‍🏫' },
  { name: 'Rohit Kapoor', role: 'Bodybuilder', text: "The Premium plan is insane. Full day meals that hit my macros perfectly. My coach couldn't believe the progress. Worth every rupee.", rating: 5, avatar: '💪' },
  { name: 'Sneha Iyer', role: 'Marathon Runner', text: "I used to spend hours meal prepping. Now I just open the Dietly box and eat. It's freed up so much of my time and my performance has improved.", rating: 5, avatar: '🏃‍♀️' },
  { name: 'Vikram Singh', role: 'CrossFit Athlete', text: "The variety is what keeps me hooked. Different meals every day, all hitting 40g+ protein. It's like having a personal chef who understands fitness.", rating: 5, avatar: '🏋️' },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: testimonials } = useAPI(testimonialsAPI.getAll, fallbackTestimonials);

  const go = useCallback((dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [go]);

  const t = testimonials[current];

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 120 : -120, opacity: 0, scale: 0.9, filter: 'blur(12px)', rotateY: d > 0 ? 5 : -5 }),
    center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', rotateY: 0 },
    exit: (d) => ({ x: d > 0 ? -120 : 120, opacity: 0, scale: 0.9, filter: 'blur(12px)', rotateY: d > 0 ? -5 : 5 }),
  };

  return (
    <section id="testimonials" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-green/[0.025] rounded-full blur-[200px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-18"
        >
          <span className="badge-pill text-brand-green mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            Testimonials
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[3.5rem] tracking-tight mb-5 leading-[1.1]">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-base sm:text-lg font-light">
            Real stories from real people crushing their fitness goals.
          </p>
        </motion.div>

        {/* Testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative glass-card rounded-[2rem] p-8 sm:p-12 lg:p-16 text-center overflow-hidden neon-border-green spotlight-card"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
              e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
            }}
          >
            {/* Background quotes */}
            <Quote className="absolute top-8 left-8 w-24 h-24 text-white/[0.015]" />
            <Quote className="absolute bottom-8 right-8 w-20 h-20 text-white/[0.015] rotate-180" />

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-green/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative inline-flex items-center justify-center w-18 h-18 rounded-2xl glass-strong text-4xl mb-6 group hover:scale-110 transition-transform duration-500"
                >
                  {t.avatar}
                  <div className="absolute -inset-1 rounded-2xl bg-brand-green/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>

                {/* Stars with stagger */}
                <div className="flex items-center justify-center gap-1.5 mb-7">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -30 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base sm:text-lg md:text-xl text-white/50 leading-relaxed mb-9 max-w-2xl mx-auto font-light">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="font-display font-bold text-lg text-white">{t.name}</div>
                <div className="text-sm text-white/25 mt-1">{t.role}</div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-12">
              <button
                onClick={() => go(-1)}
                className="p-3 rounded-xl glass hover:bg-white/[0.06] hover:scale-110 active:scale-90 transition-all duration-300 hover:shadow-premium"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-white/35 hover:text-white/60 transition-colors" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className="relative h-1.5 rounded-full transition-all duration-600 overflow-hidden"
                    style={{ width: i === current ? 36 : 6 }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  >
                    <div className={`absolute inset-0 rounded-full transition-all duration-600 ${
                      i === current
                        ? 'bg-gradient-to-r from-brand-green to-brand-green-light shadow-glow-green'
                        : 'bg-white/10 hover:bg-white/25'
                    }`} />
                    {i === current && (
                      <motion.div
                        layoutId="testimonialDot"
                        className="absolute inset-0 bg-gradient-to-r from-brand-green to-brand-green-light rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => go(1)}
                className="p-3 rounded-xl glass hover:bg-white/[0.06] hover:scale-110 active:scale-90 transition-all duration-300 hover:shadow-premium"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-white/35 hover:text-white/60 transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
