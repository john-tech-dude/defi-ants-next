import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Elegant animated aurora/mesh gradient background for hero sections.
 * - Subtle SVG gradients, animated with CSS keyframes and Framer Motion.
 * - Light parallax effect for depth (mouse-based, but restrained).
 * - Responsive and performant.
 */
export default function HeroAuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);
  // Parallax effect (mouse movement)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  // Map mouse movement to small translation
  const translateX = useTransform(springX, [0, 1], ['0px', '32px']);
  const translateY = useTransform(springY, [0, 1], ['0px', '24px']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      mouseX.set(x);
      mouseY.set(y);
    };
    const el = ref.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Animated SVG mesh gradient (aurora) */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="w-full h-full absolute inset-0"
        style={{
          transform: 'scale(1.05)',
          willChange: 'transform',
        }}
      >
        <defs>
          <radialGradient id="aurora1" cx="60%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="aurora2" cx="30%" cy="60%" r="80%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <motion.ellipse
          cx="900"
          cy="400"
          rx="600"
          ry="320"
          fill="url(#aurora1)"
          animate={{
            rx: [600, 650, 600],
            ry: [320, 340, 320],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="400"
          cy="600"
          rx="500"
          ry="260"
          fill="url(#aurora2)"
          animate={{
            rx: [500, 530, 500],
            ry: [260, 280, 260],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </motion.svg>
      {/* Subtle parallax blur blob */}
      <motion.div
        className="absolute left-[10%] top-[45%] w-[500px] h-[300px] bg-gradient-to-tr from-blue-400/40 via-fuchsia-400/30 to-green-300/20 blur-[90px] rounded-full"
        style={{
          x: translateX,
          y: translateY,
          willChange: 'transform',
        }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
