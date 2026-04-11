import { motion } from 'framer-motion';

export default function HeroImage({ src, alt }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative mx-auto"
    >
      {/* Glow accent */}
      <div className="absolute -inset-3 sm:-inset-4 bg-brand-green/[0.08] rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover aspect-[4/3]"
          draggable={false}
        />
        {/* Bottom fade for dark-theme blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
