import { motion } from 'framer-motion';

export default function ImageCard({ src, alt, className = '' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden rounded-xl ${className}`}
      style={{ border: '1px solid rgba(0,0,0,0.07)', background: '#FFFFFF' }}
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
