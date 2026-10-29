'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimationContextType = {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  isAnimating: boolean;
  setAnimating: (isAnimating: boolean) => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  /**
   * Whether to enable debug mode (shows ScrollTrigger markers in development)
   * @default false
   */
  debug?: boolean;
  
  /**
   * The child components that will have access to the animation context
   */
  children: React.ReactNode;
}

export function AnimationProvider({ 
  children, 
  debug = false 
}: AnimationProviderProps) {
  const [isAnimating, setAnimating] = useState(false);
  const [contextValue, setContextValue] = useState<AnimationContextType>({
    gsap,
    ScrollTrigger,
    isAnimating,
    setAnimating,
  });

  // Update context when isAnimating changes
  useIsomorphicLayoutEffect(() => {
    setContextValue(prev => ({
      ...prev,
      isAnimating,
    }));
  }, [isAnimating]);

  // Configure ScrollTrigger globally
  useIsomorphicLayoutEffect(() => {
    // Only show markers in development when debug is true
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      // @ts-ignore - markers is a valid property
      markers: debug && process.env.NODE_ENV === 'development',
    });
  }, [debug]);

  // Configure GSAP defaults
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set GSAP default settings
    gsap.defaults({
      ease: 'power2.out',
      duration: 0.5,
    });
    
    // Configure ScrollTrigger defaults
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    });
    
    // Enable ScrollTrigger debugging in development
    if (process.env.NODE_ENV === 'development' && debug) {
      ScrollTrigger.defaults({
        markers: true,
      });
    }
    
    // Clean up GSAP ScrollTrigger on unmount
    return () => {
      const triggers = ScrollTrigger.getAll();
      if (triggers.length > 0) {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger && typeof trigger.kill === 'function') {
            trigger.kill();
          }
        });
      }
      
      // Reset GSAP default settings
      gsap.defaults({
        ease: 'power1.out',
        duration: 0.5,
      });
    };
  }, [debug]);

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}

// Export GSAP and ScrollTrigger for direct use when needed
export { gsap, ScrollTrigger };
