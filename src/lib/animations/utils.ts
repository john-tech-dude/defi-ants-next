import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to handle GSAP animations with proper cleanup
 */
export function useGsapContext() {
  const ctx = useRef<gsap.Context>();
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scope.current) {
      ctx.current = gsap.context(() => {}, scope);
    }
    return () => {
      ctx.current?.revert();
    };
  }, []);

  return { context: ctx, scope };
}

/**
 * Creates a scroll-triggered animation
 */
export function useScrollTrigger(
  trigger: string | Element | null,
  animation: gsap.core.Tween | gsap.core.Timeline | null,
  options: ScrollTrigger.Vars = {}
) {
  useEffect(() => {
    if (!animation || !trigger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      animation,
      start: 'top 80%',
      end: 'top 20%',
      ...options,
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [trigger, animation, options]);
}

/**
 * Creates a timeline with scroll-triggered animations
 */
export function useScrollTimeline(
  trigger: string | Element | null,
  build: (tl: gsap.core.Timeline) => void,
  options: ScrollTrigger.Vars = {}
) {
  const timeline = useRef<gsap.core.Timeline>();

  useEffect(() => {
    if (!trigger) return;

    const ctx = gsap.context(() => {
      timeline.current = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
          ...options,
        },
      });

      build(timeline.current);
    });

    return () => {
      ctx.revert();
    };
  }, [trigger, build, options]);

  return timeline;
}

/**
 * Creates a staggered animation for a list of elements
 */
export function useStaggeredAnimation<T extends HTMLElement>(
  selector: string,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  options: {
    delay?: number;
    stagger?: number;
    scrollTrigger?: ScrollTrigger.Vars | boolean;
  } = {}
) {
  const { delay = 0, stagger = 0.1, scrollTrigger } = options;

  useEffect(() => {
    const elements = gsap.utils.toArray<Element>(selector);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      const timelineVars: gsap.TimelineVars = { delay };
      
      // Only add scrollTrigger if it's defined and not a boolean
      if (scrollTrigger && typeof scrollTrigger === 'object') {
        timelineVars.scrollTrigger = scrollTrigger as ScrollTrigger.Vars;
      } else if (scrollTrigger === true) {
        timelineVars.scrollTrigger = {} as ScrollTrigger.Vars;
      }
      
      const tl = gsap.timeline(timelineVars);

      tl.fromTo(
        elements,
        { ...from, opacity: 0 },
        {
          ...to,
          opacity: 1,
          stagger,
          ease: 'power2.out',
        }
      );
    });

    return () => ctx.revert();
  }, [selector, from, to, delay, stagger, scrollTrigger]);
}

/**
 * Creates a parallax effect on scroll
 */
export function useParallax(
  element: HTMLElement | null,
  options: {
    yPercent?: number;
    xPercent?: number;
    speed?: number;
    trigger?: string | Element | null;
  } = {}
) {
  const {
    yPercent = 20,
    xPercent = 0,
    speed = 1,
    trigger = null,
  } = options;

  useEffect(() => {
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent,
        xPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [element, yPercent, xPercent, speed, trigger]);
}

/**
 * Creates a smooth scroll animation
 */
export function useSmoothScroll(container?: HTMLElement | null) {
  useEffect(() => {
    if (!container) return;

    const ctx = gsap.context(() => {
      const links = container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
      
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href === '#') return;
          
          const target = document.querySelector(href);
          if (!target) return;
          
          e.preventDefault();
          
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: target,
              offsetY: 100, // Offset from the top
            },
            ease: 'power2.inOut',
          });
        });
      });
    }, container);

    return () => ctx.revert();
  }, [container]);
}

/**
 * Creates a scroll progress indicator
 */
export function useScrollProgress(
  element: HTMLElement | null,
  onUpdate?: (progress: number) => void
) {
  useEffect(() => {
    if (!element) return;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = scrollTop / (scrollHeight - clientHeight);
      
      if (onUpdate) {
        onUpdate(progress);
      } else {
        gsap.to(element, {
          scaleX: progress,
          transformOrigin: 'left center',
          ease: 'none',
          duration: 0.1,
        });
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    
    // Initial update
    updateProgress();
    
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [element, onUpdate]);
}
