import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

// Hook for scroll-triggered animations (free alternative to GSAP ScrollTrigger)
export const useScrollAnimation = (
  threshold: number = 0.1,
  triggerOnce: boolean = true
) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [controls, inView, triggerOnce]);

  return { ref, controls, inView };
};

// Hook for staggered scroll animations
export const useStaggeredScroll = (
  itemCount: number,
  threshold: number = 0.1,
  staggerDelay: number = 0.1
) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return { ref, controls, inView };
};

// HOC to add scroll animation to any component
export const withScrollAnimation = (
  Component: React.ComponentType<any>,
  variants: any,
  threshold: number = 0.1
) => {
  return function ScrollAnimatedComponent(props: any) {
    const { ref, controls } = useScrollAnimation(threshold);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={variants}
      >
        <Component {...props} />
      </motion.div>
    );
  };
};
