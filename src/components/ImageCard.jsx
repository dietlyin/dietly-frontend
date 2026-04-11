import { motion } from 'framer-motion';

export default function ImageCard({ src, alt, className = '' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-xl border border-white/[0.06] bg-neutral-900 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300"
        loading="lazy"
        draggable={false}
      />
    </motion.div>
  );
}
