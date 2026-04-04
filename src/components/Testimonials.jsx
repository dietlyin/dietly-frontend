import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import { testimonialsAPI } from '../services/api';

const fallbackTestimonials = [
  { name: 'Arjun Mehta', role: 'Fitness Enthusiast', text: 'Dietly completely changed how I eat. Lost 8kg in 3 months while building lean muscle. The food is genuinely delicious.', rating: 5 },
  { name: 'Priya Sharma', role: 'Yoga Instructor', text: 'As a yoga instructor, nutrition is everything. Dietly meals are clean, balanced, and show up on time every single day.', rating: 5 },
  { name: 'Rohit Kapoor', role: 'Bodybuilder', text: 'The Premium plan is excellent. Full day meals that hit my macros perfectly. My coach couldn\'t believe the progress.', rating: 5 },
  { name: 'Sneha Iyer', role: 'Marathon Runner', text: 'I used to spend hours meal prepping. Now I just open the box and eat. My performance has improved significantly.', rating: 5 },
  { name: 'Vikram Singh', role: 'CrossFit Athlete', text: 'The variety is what keeps me hooked. Different meals every day, all hitting 40g+ protein. Like having a personal chef.', rating: 5 },
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
    if (!inView) return;
    const timer = setInterval(() => go(1), 5000);
    return () => clearInterval(timer);
  }, [go, inView]);

  const t = testimonials[current];

  const variants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="section-spacing overflow-hidden scroll-mt-20">
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="badge mb-5 inline-flex">Testimonials</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
            Loved by <span className="text-brand-green">Thousands</span>
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto text-base sm:text-lg">
            Real stories from real people crushing their fitness goals.
          </p>
        </motion.div>

        {/* Testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="card p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Decorative quote */}
            <Quote className="absolute top-6 left-6 w-16 h-16 text-white/[0.03]" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-xl mx-auto">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="font-display font-semibold text-white">{t.name}</div>
                <div className="text-sm text-neutral-500 mt-1">{t.role}</div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => go(-1)}
                className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-brand-green w-6' : 'bg-white/15 hover:bg-white/25'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => go(1)}
                className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
