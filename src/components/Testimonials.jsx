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
    <section id="testimonials" className="section-spacing section-cream overflow-hidden scroll-mt-20">
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="badge mb-5 inline-flex">Testimonials</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4" style={{ color: '#033603' }}>
            Loved by <span style={{ color: '#b0ea20', WebkitTextStroke: '1px #8cc418' }}>Thousands</span>
          </h2>
          <p className="max-w-lg mx-auto text-base sm:text-lg" style={{ color: '#374151' }}>
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
            <Quote className="absolute top-6 left-6 w-16 h-16" style={{ color: 'rgba(3,54,3,0.05)' }} />

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
                <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: '#374151' }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="font-display font-semibold" style={{ color: '#033603' }}>{t.name}</div>
                <div className="text-sm mt-1" style={{ color: '#6B7280' }}>{t.role}</div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => go(-1)}
                className="p-2 rounded-lg transition-all"
                style={{ border: '1.5px solid rgba(0,0,0,0.12)', color: '#6B7280' }}
                onMouseEnter={e => { e.currentTarget.style.color='#033603'; e.currentTarget.style.borderColor='rgba(0,0,0,0.28)'; e.currentTarget.style.background='rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='#6B7280'; e.currentTarget.style.borderColor='rgba(0,0,0,0.12)'; e.currentTarget.style.background='transparent'; }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: i === current ? '1.5rem' : '0.5rem', background: i === current ? '#b0ea20' : 'rgba(0,0,0,0.14)' }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => go(1)}
                className="p-2 rounded-lg transition-all"
                style={{ border: '1.5px solid rgba(3,54,3,0.18)', color: 'rgba(3,54,3,0.45)' }}
                onMouseEnter={e => { e.currentTarget.style.color='#033603'; e.currentTarget.style.borderColor='rgba(3,54,3,0.40)'; e.currentTarget.style.background='rgba(3,54,3,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='rgba(3,54,3,0.45)'; e.currentTarget.style.borderColor='rgba(3,54,3,0.18)'; e.currentTarget.style.background='transparent'; }}
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
