'use client';

import { motion } from 'framer-motion';

export const BackgroundEffects = () => (
  <>
    <motion.div 
      className="absolute top-40 left-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -z-10"
      animate={{
        y: [0, 30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div 
      className="absolute bottom-40 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -z-10"
      animate={{
        y: [0, -40, 0],
        x: [0, -30, 0],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    <motion.div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-500/10 rounded-full blur-3xl -z-10"
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </>
);
