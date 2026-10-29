'use client';

import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { animated, useSpring, useTrail, useTransition } from '@react-spring/web';
import { useIsomorphicLayoutEffect } from '@/lib/animations/useIsomorphicLayoutEffect';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  config?: {
    tension?: number;
    friction?: number;
    mass?: number;
  };
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
  };
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
  };
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
  as?: keyof JSX.IntrinsicElements;
}

export function AnimatedContainer({
  children,
  className = '',
  delay = 0,
  config = { tension: 170, friction: 26 },
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  once = true,
  rootMargin = '0px 0px -20% 0px',
  threshold = 0.1,
  as: Component = 'div',
  ...props
}: AnimatedContainerProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    rootMargin,
    threshold,
  });

  const styles = useSpring({
    to: inView ? to : from,
    config,
    delay,
  });

  return (
    <animated.div
      ref={ref}
      // @ts-ignore - TypeScript doesn't understand the dynamic component
      as={Component}
      className={className}
      style={styles}
      {...props}
    >
      {children}
    </animated.div>
  );
}

interface StaggeredContainerProps {
  children: ReactNode | ReactNode[];
  className?: string;
  delay?: number;
  config?: {
    tension?: number;
    friction?: number;
    mass?: number;
  };
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
  };
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
  };
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
  as?: keyof JSX.IntrinsicElements;
  trail?: number;
}

export function StaggeredContainer({
  children,
  className = '',
  delay = 0,
  config = { tension: 170, friction: 26 },
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  once = true,
  rootMargin = '0px 0px -20% 0px',
  threshold = 0.1,
  as: Component = 'div',
  trail = 50,
  ...props
}: StaggeredContainerProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    rootMargin,
    threshold,
  });

  const items = React.Children.toArray(children);
  const [mounted, setMounted] = useState(false);

  // Only run on client-side to avoid hydration mismatches
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Create the trail animation
  const trails = useTrail(items.length, {
    config,
    from,
    to: inView ? to : from,
    delay,
  });

  if (!mounted) {
    return (
      <div ref={ref} className={className}>
        {items.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {trails.map((style, index) => (
        <animated.div
          key={index}
          style={{
            ...style,
            willChange: 'opacity, transform',
          }}
          {...props}
        >
          {items[index]}
        </animated.div>
      ))}
    </div>
  );
}

export function useAnimatedInView({
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  config = { tension: 170, friction: 26 },
  delay = 0,
  once = true,
  rootMargin = '0px 0px -20% 0px',
  threshold = 0.1,
} = {}) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    rootMargin,
    threshold,
  });

  const style = useSpring({
    to: inView ? to : from,
    config,
    delay,
  });

  return [ref, style, inView] as const;
}

export function useStaggeredInView({
  count = 1,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  config = { tension: 170, friction: 26 },
  delay = 0,
  trail = 100,
  once = true,
  rootMargin = '0px 0px -20% 0px',
  threshold = 0.1,
} = {}) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    rootMargin,
    threshold,
  });

  const trailAnim = useTrail(count, {
    config,
    from,
    to: inView ? to : from,
    delay,
    trail,
  });

  return [ref, trailAnim, inView] as const;
}
