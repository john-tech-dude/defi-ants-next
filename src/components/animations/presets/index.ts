import { Variants } from 'framer-motion';

// Framer Motion presets
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// GSAP presets
export const gsapFadeIn = {
  opacity: 0,
  y: 20,
  duration: 0.8,
  ease: 'power2.out',
};

export const gsapSlideInFromLeft = {
  x: -50,
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
};

export const gsapSlideInFromRight = {
  x: 50,
  opacity: 0,
  duration: 0.8,
  ease: 'power2.out',
};

// React Spring presets
export const springFadeIn = {
  from: { opacity: 0, y: 20 },
  to: { opacity: 1, y: 0 },
  config: { tension: 170, friction: 26 },
};

export const springSlideInFromLeft = {
  from: { opacity: 0, x: -50 },
  to: { opacity: 1, x: 0 },
  config: { tension: 170, friction: 26 },
};

export const springSlideInFromRight = {
  from: { opacity: 0, x: 50 },
  to: { opacity: 1, x: 0 },
  config: { tension: 170, friction: 26 },
};

// Page transition presets
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

// Hover and tap animations
export const hoverScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 10 },
};

export const hoverLift = {
  whileHover: { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' },
  whileTap: { y: 0, boxShadow: '0 2px 5px -1px rgba(0, 0, 0, 0.1)' },
  transition: { type: 'spring', stiffness: 300, damping: 15 },
};

// Stagger animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Text animations
export const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// Special effects
export const float = {
  animate: {
    y: ['0%', '-5%', '0%'],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};

export const pulse = {
  animate: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};
