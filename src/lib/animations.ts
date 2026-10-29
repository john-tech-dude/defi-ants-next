import { Variants, Transition, Easing } from 'framer-motion';

// Type-safe easing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1] as const,
  easeOut: [0.0, 0, 0.2, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  sharp: [0.4, 0, 0.6, 1] as const,
} as const;

// Helper to create type-safe transitions
export const createTransition = (
  duration: number = 0.3,
  ease: readonly [number, number, number, number] = easings.easeInOut,
  delay: number = 0
): Transition => ({
  duration,
  ease,
  delay,
});

// Base variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition(0.5, easings.easeInOut),
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: createTransition(0.3, easings.easeInOut),
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Progress bar variant creator
export const createProgressVariants = (duration: number = 1.2) => ({
  hidden: { width: 0 },
  visible: (width: string) => ({
    width,
    transition: createTransition(duration, [0.43, 0.13, 0.23, 0.96] as const),
  }),
});

// Card hover variants
export const cardHoverVariants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: createTransition(0.3, easings.easeOut),
  },
};

// Optimize animations for performance
export const optimizeAnimation = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'subpixel-antialiased',
  transform: 'translateZ(0)',
  perspective: '1000px',
} as const;
