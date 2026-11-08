import { useEffect, useState } from 'react';

export interface PremiumThemeOptions {
  enableGlassmorphism?: boolean;
  enablePremiumAnimations?: boolean;
  enableGradientBorders?: boolean;
  accentColor?: 'primary' | 'blue' | 'purple' | 'teal';
}

export const usePremiumTheme = (options: PremiumThemeOptions = {}) => {
  const {
    enableGlassmorphism = true,
    enablePremiumAnimations = true,
    enableGradientBorders = true,
    accentColor = 'primary'
  } = options;
  
  const [mounted, setMounted] = useState(false);
  
  // Make sure theme is applied after hydration to prevent flashing
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Get accent color classes based on selection
  const getAccentClasses = () => {
    switch (accentColor) {
      case 'blue':
        return {
          gradient: 'bg-gradient-blue',
          solid: 'bg-accent-blue',
          text: 'text-accent-blue',
          border: 'border-accent-blue',
          hover: 'hover:text-accent-blue',
          shadow: 'shadow-accent-blue/20'
        };
      case 'purple':
        return {
          gradient: 'bg-gradient-purple',
          solid: 'bg-accent-purple',
          text: 'text-accent-purple',
          border: 'border-accent-purple',
          hover: 'hover:text-accent-purple',
          shadow: 'shadow-accent-purple/20'
        };
      case 'teal':
        return {
          gradient: 'bg-gradient-teal',
          solid: 'bg-accent-teal',
          text: 'text-accent-teal',
          border: 'border-accent-teal',
          hover: 'hover:text-accent-teal',
          shadow: 'shadow-accent-teal/20'
        };
      default:
        return {
          gradient: 'bg-gradient-to-r from-primary-500 to-secondary-500',
          solid: 'bg-primary',
          text: 'text-primary',
          border: 'border-primary',
          hover: 'hover:text-primary',
          shadow: 'shadow-primary/20'
        };
    }
  };
  
  // Get animation classes if enabled
  const getAnimationClasses = (type: 'hover' | 'entrance' | 'pulse' | 'none') => {
    if (!enablePremiumAnimations) return '';
    
    switch (type) {
      case 'hover':
        return 'transition-all duration-300 hover:scale-105 hover:-translate-y-1';
      case 'entrance':
        return 'animate-in fade-in-0 zoom-in-95 duration-500';
      case 'pulse':
        return 'animate-pulse';
      default:
        return '';
    }
  };
  
  // Get glassmorphism classes if enabled
  const getGlassClasses = (intensity: 'light' | 'medium' | 'heavy') => {
    if (!enableGlassmorphism) return 'bg-gray-900';
    
    switch (intensity) {
      case 'light':
        return 'bg-gray-900/30 backdrop-blur-sm';
      case 'medium':
        return 'bg-gray-900/50 backdrop-blur-md';
      case 'heavy':
        return 'bg-gray-900/70 backdrop-blur-xl';
      default:
        return 'bg-gray-900/50 backdrop-blur-md';
    }
  };
  
  // Get gradient border classes if enabled
  const getGradientBorderClasses = () => {
    if (!enableGradientBorders) return 'border border-border-highlight';

    return 'relative before:absolute before:inset-0 before:-z-10 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-primary-500/70 before:via-secondary-500/70 before:to-primary-400/70';
  };
  
  return {
    mounted,
    getAccentClasses,
    getAnimationClasses,
    getGlassClasses,
    getGradientBorderClasses,
    
    // Convenience properties
    accent: getAccentClasses(),
    glassMedium: getGlassClasses('medium'),
    glassHeavy: getGlassClasses('heavy'),
    glassLight: getGlassClasses('light'),
    hoverAnimation: getAnimationClasses('hover'),
    entranceAnimation: getAnimationClasses('entrance'),
    pulseAnimation: getAnimationClasses('pulse'),
    gradientBorder: getGradientBorderClasses(),
    
    // Theme options
    options: {
      enableGlassmorphism,
      enablePremiumAnimations,
      enableGradientBorders,
      accentColor
    }
  };
};

export default usePremiumTheme;
