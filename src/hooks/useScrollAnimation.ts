'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/lib/animations/useIsomorphicLayoutEffect';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollAnimationConfig = {
  trigger?: string | React.RefObject<HTMLElement> | null;
  start?: string | number | (() => string | number);
  end?: string | number | (() => string | number);
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (self: any) => void;
  onToggle?: (self: any) => void;
  once?: boolean;
  pin?: boolean | string | Element;
  pinSpacing?: boolean | string;
  anticipatePin?: number;
  pinReparent?: boolean;
  pinType?: 'fixed' | 'transform';
  invalidateOnRefresh?: boolean;
  refreshPriority?: number;
  id?: string;
};

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  config: ScrollAnimationConfig = {}
) {
  const elementRef = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const trigger = 
      typeof config.trigger === 'string' 
        ? document.querySelector(config.trigger) 
        : config.trigger?.current || element;

    // Create the scroll trigger
    scrollTrigger.current = ScrollTrigger.create({
      trigger: trigger,
      start: config.start || 'top 80%',
      end: config.end || 'top 20%',
      scrub: config.scrub || false,
      markers: config.markers || false,
      once: config.once || false,
      pin: config.pin || false,
      pinSpacing: config.pinSpacing !== undefined ? config.pinSpacing : true,
      anticipatePin: config.anticipatePin,
      pinReparent: config.pinReparent,
      pinType: config.pinType,
      invalidateOnRefresh: config.invalidateOnRefresh,
      refreshPriority: config.refreshPriority,
      id: config.id,
      onEnter: () => {
        setIsInView(true);
        config.onEnter?.();
      },
      onLeave: () => {
        if (!config.once) setIsInView(false);
        config.onLeave?.();
      },
      onEnterBack: () => {
        setIsInView(true);
        config.onEnterBack?.();
      },
      onLeaveBack: () => {
        if (!config.once) setIsInView(false);
        config.onLeaveBack?.();
      },
      onUpdate: (self) => {
        setProgress(self.progress);
        config.onUpdate?.(self);
      },
      onToggle: (self) => {
        config.onToggle?.(self);
      },
    });

    // Clean up on unmount
    return () => {
      if (scrollTrigger.current) {
        scrollTrigger.current.kill();
        scrollTrigger.current = null;
      }
    };
  }, [
    config.trigger,
    config.start,
    config.end,
    config.scrub,
    config.markers,
    config.once,
    config.pin,
    config.pinSpacing,
    config.anticipatePin,
    config.pinReparent,
    config.pinType,
    config.invalidateOnRefresh,
    config.refreshPriority,
    config.id,
    config.onEnter,
    config.onLeave,
    config.onEnterBack,
    config.onLeaveBack,
    config.onUpdate,
    config.onToggle,
  ]);

  // Refresh ScrollTrigger on window resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    ref: elementRef,
    isInView,
    progress,
    scrollTrigger: scrollTrigger.current,
  };
}

// Hook for creating a scroll-triggered timeline
export function useScrollTimeline<T extends HTMLElement = HTMLDivElement>(
  config: ScrollAnimationConfig = {}
) {
  const elementRef = useRef<T>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current) return;

    // Create a new GSAP timeline
    timeline.current = gsap.timeline({
      paused: true,
      onUpdate: () => {
        setProgress(timeline.current?.progress() || 0);
      },
    });

    // Create the scroll trigger
    scrollTrigger.current = ScrollTrigger.create({
      trigger: elementRef.current,
      start: config.start || 'top 80%',
      end: config.end || 'top 20%',
      scrub: config.scrub || true,
      markers: config.markers || false,
      once: config.once || false,
      animation: timeline.current,
      onUpdate: (self) => {
        config.onUpdate?.(self);
      },
      onToggle: (self) => {
        config.onToggle?.(self);
      },
    });

    // Clean up on unmount
    return () => {
      if (timeline.current) {
        timeline.current.kill();
        timeline.current = null;
      }
      if (scrollTrigger.current) {
        scrollTrigger.current.kill();
        scrollTrigger.current = null;
      }
    };
  }, [
    config.start,
    config.end,
    config.scrub,
    config.markers,
    config.once,
    config.onUpdate,
    config.onToggle,
  ]);

  return {
    ref: elementRef,
    timeline: timeline.current,
    scrollTrigger: scrollTrigger.current,
    progress,
  };
}
