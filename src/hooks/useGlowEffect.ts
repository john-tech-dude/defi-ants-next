import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from 'next-themes';

export const useGlowEffect = () => {
  const { theme } = useTheme();
  const glowRef = useRef<HTMLDivElement>(null);
  let ctx: gsap.Context | null = null;
  let glowTl: gsap.core.Timeline | null = null;

  useEffect(() => {
    if (!glowRef.current) return;

    const glow = glowRef.current;
    
    // Create a timeline for the glow animation
    glowTl = gsap.timeline({ paused: true });
    
    // Initial styles
    gsap.set(glow, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(20px)',
      transformOrigin: 'center',
    });

    // Glow animation
    glowTl.to(glow, {
      opacity: 1,
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Cleanup function
    return () => {
      if (glowTl) {
        glowTl.kill();
      }
    };
  }, [theme]);

  // Function to handle mouse enter
  const handleMouseEnter = () => {
    if (glowTl) {
      glowTl.play();
    }
  };

  // Function to handle mouse leave
  const handleMouseLeave = () => {
    if (glowTl) {
      glowTl.reverse();
    }
  };

  // Get the appropriate glow color based on theme
  const getGlowColor = () => {
    return theme === 'dark' 
      ? 'rgba(99, 102, 241, 0.3)' // Slightly more visible in dark mode
      : 'rgba(99, 102, 241, 0.15)' // More subtle in light mode
  };

  return {
    glowRef,
    handleMouseEnter,
    handleMouseLeave,
    getGlowColor,
  };
};
