'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimation, AnimationProvider } from '@/lib/animations/AnimationContext';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  className?: string;
  trigger?: React.RefObject<HTMLElement> | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  once?: boolean;
}

function ScrollRevealInner({
  children,
  delay = 0,
  duration = 1,
  yOffset = 50,
  xOffset = 0,
  className = '',
  trigger,
  start = 'top 80%',
  end = 'top 20%',
  scrub = false,
  markers = false,
  once = true,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { gsap: gsapContext } = useAnimation();

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const triggerElement = 
      typeof trigger === 'string' 
        ? document.querySelector(trigger) 
        : trigger?.current || element;

    // Set initial state
    gsapContext.set(element, {
      opacity: 0,
      y: yOffset,
      x: xOffset,
    });

    // Create the animation
    const animation = gsapContext.to(element, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: 'power2.out',
      onComplete: () => {
        if (once) {
          ScrollTrigger.refresh();
        }
      },
    });

    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      animation,
      trigger: triggerElement,
      start,
      end,
      scrub: scrub,
      markers: process.env.NODE_ENV === 'development' && markers,
      onEnter: () => {
        if (!scrub) {
          animation.play();
        }
      },
      onEnterBack: () => {
        if (!scrub && !once) {
          animation.play();
        }
      },
      onLeave: () => {
        if (!scrub && !once) {
          animation.pause(0);
        }
      },
      onLeaveBack: () => {
        if (!scrub && !once) {
          animation.pause(0);
        }
      },
    });

    return () => {
      animation.kill();
      scrollTrigger.kill();
    };
  }, [delay, duration, gsapContext, once, start, trigger, xOffset, yOffset, scrub, markers, end]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

function ScrollRevealStaggeredInner({
  children,
  delay = 0,
  stagger = 0.1,
  duration = 0.6,
  yOffset = 20,
  xOffset = 0,
  className = '',
  trigger,
  start = 'top 85%',
  end = 'top 15%',
  scrub = false,
  markers = false,
  once = true,
}: ScrollRevealProps & { stagger?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gsap: gsapContext } = useAnimation();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = container.children;
    const triggerElement = 
      typeof trigger === 'string' 
        ? document.querySelector(trigger) 
        : trigger?.current || container;

    // Set initial state for all children
    gsapContext.set(elements, {
      opacity: 0,
      y: yOffset,
      x: xOffset,
    });

    // Create staggered animations
    const animations = Array.from(elements).map((element, index) => {
      return gsapContext.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay: delay + index * stagger,
        ease: 'power2.out',
      });
    });

    // Create a master timeline for the container
    const master = gsapContext.timeline({
      onComplete: () => {
        if (once) {
          ScrollTrigger.refresh();
        }
      },
    });

    // Add all animations to the master timeline
    animations.forEach(anim => {
      master.add(anim, 0);
    });

    // Create scroll trigger for the container
    const scrollTrigger = ScrollTrigger.create({
      animation: master,
      trigger: triggerElement,
      start,
      end,
      scrub: scrub,
      markers: process.env.NODE_ENV === 'development' && markers,
      onEnter: () => {
        if (!scrub) {
          master.play();
        }
      },
      onEnterBack: () => {
        if (!scrub && !once) {
          master.play();
        }
      },
      onLeave: () => {
        if (!scrub && !once) {
          master.pause(0);
        }
      },
      onLeaveBack: () => {
        if (!scrub && !once) {
          master.pause(0);
        }
      },
    });

    return () => {
      master.kill();
      scrollTrigger.kill();
      animations.forEach(anim => anim.kill());
    };
  }, [delay, duration, gsapContext, once, stagger, start, trigger, xOffset, yOffset, scrub, markers, end]);

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="stagger-item">
          {child}
        </div>
      ))}
    </div>
  );
}

// Wrapper components with AnimationProvider
export function ScrollReveal(props: ScrollRevealProps) {
  return (
    <AnimationProvider debug={process.env.NODE_ENV === 'development'}>
      <ScrollRevealInner {...props} />
    </AnimationProvider>
  );
}

export function ScrollRevealStaggered(props: ScrollRevealProps & { stagger?: number }) {
  return (
    <AnimationProvider debug={process.env.NODE_ENV === 'development'}>
      <ScrollRevealStaggeredInner {...props} />
    </AnimationProvider>
  );
}
