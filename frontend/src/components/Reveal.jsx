import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 32, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function MaskedLine({ children, delay = 0, className = "" }) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay }}
    >
      {children}
    </motion.div>
  );
}
