'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface PremiumSectionProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'stagger' | 'parallax';
  delay?: number;
  duration?: number;
  threshold?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  bgEffect?: 'gradient' | 'glow' | 'none';
  start?: string;
  end?: string;
  scrub?: boolean | number;
  once?: boolean;
}

export function PremiumSection({
  children,
  className,
  animationType = 'fade',
  delay = 0.2,
  duration = 1,
  threshold = 0.2,
  staggerChildren = false,
  staggerDelay = 0.1,
  bgEffect = 'none',
  start = 'bottom-=' + threshold * 100 + '%',
  end = 'top center',
  scrub = false,
  once = false,
}: PremiumSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const section = sectionRef.current;
    let animation: gsap.core.Timeline;

    // Initial setup
    gsap.set(section, { 
      autoAlpha: animationType === 'fade' ? 0 : 1,
      y: animationType === 'slide' ? 50 : 0,
      scale: animationType === 'scale' ? 0.95 : 1,
    });

    // Create animation
    animation = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: start,
        end: end,
        scrub: scrub,
        markers: false,
        toggleActions: once ? 'play none none none' : 'play none none reset',
      } as gsap.plugins.ScrollTriggerInstanceVars,
      delay,
    });

    // Add animation based on type
    switch (animationType) {
      case 'fade':
        animation.to(section, { autoAlpha: 1, duration });
        break;
      case 'slide':
        animation.to(section, { y: 0, autoAlpha: 1, duration, ease: 'power2.out' });
        break;
      case 'scale':
        animation.to(section, { scale: 1, autoAlpha: 1, duration, ease: 'back.out(1.2)' });
        break;
      case 'parallax':
        // Create parallax effect on section
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const speed = 0.1;
            const yPos = -self.progress * 100 * speed;
            gsap.to(section, { 
              backgroundPositionY: `${yPos}px`, 
              ease: 'none',
              overwrite: 'auto'
            });
          }
        });
        animation.to(section, { autoAlpha: 1, duration });
        break;
      case 'stagger':
        if (staggerChildren && childrenRef.current) {
          const children = childrenRef.current.children;
          gsap.set(children, { autoAlpha: 0, y: 20 });
          animation.to(section, { autoAlpha: 1, duration: duration / 2 })
                  .to(children, { 
                    autoAlpha: 1, 
                    y: 0, 
                    duration: duration / 2, 
                    stagger: staggerDelay,
                    ease: 'power2.out'
                  });
        }
        break;
    }

    // Background effect
    if (bgEffect === 'gradient' || bgEffect === 'glow') {
      const bgAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      if (bgEffect === 'gradient') {
        bgAnimation.fromTo(
          section, 
          { backgroundPosition: '0% 50%' }, 
          { backgroundPosition: '100% 50%', ease: 'none' }
        );
      } else if (bgEffect === 'glow') {
        bgAnimation.fromTo(
          section, 
          { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' }, 
          { boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)', ease: 'none' }
        );
      }
    }

    return () => {
      if (animation) animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animationType, delay, duration, threshold, staggerChildren, staggerDelay, bgEffect]);

  return (
    <div 
      ref={sectionRef} 
      className={cn(
        'relative overflow-hidden',
        bgEffect === 'gradient' && 'bg-gradient-to-r from-background via-blue-50 to-background bg-[length:200%_100%]',
        bgEffect === 'glow' && 'transition-shadow duration-1000',
        className
      )}
    >
      {staggerChildren ? (
        <div ref={childrenRef}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
