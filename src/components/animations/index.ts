// Re-export all animation components for easier imports
export * from './motion/FadeIn';
export * from './gsap/ScrollReveal';
export * from './spring/AnimatedContainer';

// Animation utilities
export { AnimationProvider, useAnimation } from '@/lib/animations/AnimationContext';

// Animation presets
export * as animationPresets from './presets';

// Types
export type { AnimationConfig } from './types';
