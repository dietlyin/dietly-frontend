import { motion } from 'framer-motion';

export default function HeroImage({ src, alt }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative mx-auto"
    >
      {/* Very subtle lime glow */}
      <div className="absolute -inset-3 sm:-inset-4 rounded-3xl blur-2xl pointer-events-none" style={{ background: 'rgba(176,234,32,0.10)' }} />

      <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.10)' }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover aspect-[4/3]"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
