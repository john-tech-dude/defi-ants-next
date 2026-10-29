import { SpringConfig } from '@react-spring/web';

export interface AnimationConfig {
  // Base animation configuration
  delay?: number;
  duration?: number;
  ease?: string | number[];
  
  // Spring physics configuration
  config?: SpringConfig;
  
  // Animation variants
  from?: Record<string, any>;
  to?: Record<string, any>;
  
  // Scroll trigger configuration
  trigger?: string | React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  
  // Other options
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
}

export interface StaggerConfig extends AnimationConfig {
  stagger?: number;
  trail?: number;
}

export interface ScrollRevealConfig extends AnimationConfig {
  yOffset?: number;
  xOffset?: number;
  trigger?: string | React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

export interface FadeInConfig extends AnimationConfig {
  yOffset?: number;
  xOffset?: number;
  once?: boolean;
}

export interface SpringAnimationConfig {
  from: Record<string, any>;
  to: Record<string, any>;
  config?: SpringConfig;
  delay?: number;
  onRest?: () => void;
}

export interface AnimationPreset {
  hidden: Record<string, any>;
  visible: Record<string, any> | ((i?: number) => Record<string, any>);
  transition?: Record<string, any>;
}
