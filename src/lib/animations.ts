// Enhanced animation utilities using Framer Motion and React Spring
import { Variants, Transition } from 'framer-motion';

// Easing functions for premium feel
export const easings = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
  sharp: [0.4, 0, 0.2, 1] as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
};

// Duration presets
export const durations = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
};

// Stagger presets
export const staggers = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  verySlow: 0.2,
};

// Common variants for reusable animations
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
};

// Staggered container variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggers.normal,
      delayChildren: 0.2,
    },
  },
};

// Staggered item variants
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

// Card hover effects
export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: {
    duration: durations.fast,
    ease: easings.smooth,
  },
};

// Progress bar variants
export const createProgressVariants = (duration: number = 1.2): Variants => ({
  hidden: { width: '0%' },
  visible: (width: string) => ({
    width,
    transition: {
      duration,
      ease: easings.smooth,
    },
  }),
});

// Magnetic button effect
export const magneticButton = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 17,
  },
};

// Floating animation
export const floating: Variants = {
  floating: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Pulse animation
export const pulse: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Shine effect
export const shine: Variants = {
  hidden: { backgroundPosition: '200% center' },
  visible: {
    backgroundPosition: '-200% center',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Text reveal animation
export const textReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: durations.normal,
      ease: easings.smooth,
    },
  }),
};

// Bounce in animation
export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.bounce,
    },
  },
};

// Rotate in animation
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180, scale: 0.5 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.elastic,
    },
  },
};

// Custom transition creator
export const createTransition = (
  duration: number = durations.normal,
  ease: readonly [number, number, number, number] = easings.smooth
): Transition => ({
  duration,
  ease,
});

// Staggered children creator
export const createStagger = (stagger: number = staggers.normal) => ({
  staggerChildren: stagger,
  delayChildren: 0.1,
});

// Page transition variants
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
};

// Modal animation
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
};

// Tooltip animation
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
};

// List item animation
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
};

// Image reveal animation
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.smooth,
    },
  },
};

// Counter animation
export const counterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.bounce,
    },
  },
};

// Glow effect animation
export const glowPulse: Variants = {
  pulse: {
    boxShadow: [
      '0 0 20px rgba(59, 130, 246, 0.3)',
      '0 0 40px rgba(59, 130, 246, 0.6)',
      '0 0 20px rgba(59, 130, 246, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Parallax effect (for scroll animations)
export const parallaxY = (value: number) => ({
  y: value,
  transition: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  },
});

// Spring animations for interactive elements
export const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
};

export const springBouncy = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 10,
};

export const springSmooth = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
};
