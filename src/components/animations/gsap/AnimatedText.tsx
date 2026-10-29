'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  type?: 'chars' | 'words' | 'lines';
  animation?: 'fade' | 'slide' | 'scale' | 'wave' | 'highlight';
  stagger?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  color?: string;
  highlightColor?: string;
}

export function AnimatedText({
  children,
  className,
  type = 'words',
  animation = 'fade',
  stagger = 0.03,
  duration = 0.8,
  delay = 0,
  threshold = 0.2,
  once = true,
  color,
  highlightColor = 'var(--primary)',
}: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<any>(null);
  const triggerRef = useRef<any>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Clean up function to prevent memory leaks
    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (!textRef.current || typeof window === 'undefined') return;

    // Create a new SplitText instance
    const element = textRef.current;
    const splitTypes = type === 'chars' ? 'chars' : type === 'words' ? 'words' : 'lines';
    
    // Revert any previous split
    if (splitRef.current) {
      splitRef.current.revert();
    }
    
    // Create new split
    splitRef.current = new SplitText(element, { 
      type: splitTypes,
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char"
    });

    // Get the split elements
    const targets = splitRef.current[splitTypes];
    
    // Set initial state
    gsap.set(targets, { 
      autoAlpha: animation === 'fade' || animation === 'slide' ? 0 : 1,
      y: animation === 'slide' ? '100%' : 0,
      scale: animation === 'scale' ? 0.5 : 1,
    });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: `top bottom-=${threshold * 100}%`,
        toggleActions: once ? 'play none none none' : 'play none none reset',
        markers: false,
      },
      delay,
    });

    // Apply animation based on type
    switch (animation) {
      case 'fade':
        tl.to(targets, {
          autoAlpha: 1,
          stagger,
          duration,
          ease: 'power2.out',
        });
        break;
      case 'slide':
        tl.to(targets, {
          y: 0,
          autoAlpha: 1,
          stagger,
          duration,
          ease: 'back.out(1.2)',
        });
        break;
      case 'scale':
        tl.to(targets, {
          scale: 1,
          stagger,
          duration,
          ease: 'back.out(1.7)',
        });
        break;
      case 'wave':
        tl.to(targets, {
          y: 0,
          stagger,
          duration: duration / 2,
          ease: 'power1.inOut',
          yoyo: true,
          yoyoEase: true,
          repeat: 1,
        });
        break;
      case 'highlight':
        if (type === 'chars' || type === 'words') {
          // Create highlight effect with background
          tl.to(targets, {
            backgroundColor: highlightColor,
            color: '#fff',
            padding: '0 4px',
            borderRadius: '3px',
            stagger,
            duration,
            ease: 'power2.inOut',
          });
        }
        break;
    }

    // Save the trigger reference for cleanup
    triggerRef.current = tl.scrollTrigger;

    // Clean up on unmount
    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, [animation, type, stagger, duration, delay, threshold, once, highlightColor]);

  return (
    <div 
      ref={textRef} 
      className={cn('inline-block', className)}
      style={{ color }}
    >
      {children}
    </div>
  );
}
