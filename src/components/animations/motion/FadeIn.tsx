'use client';

import React from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import { ReactNode } from 'react';
import { createTransition, easings } from '@/lib/animations';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  yOffset?: number;
  xOffset?: number;
  once?: boolean;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20, x: 0 },
  visible: (custom: { delay: number; yOffset: number; xOffset: number }) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: createTransition(0.6, [0.16, 1, 0.3, 1], custom.delay)
  }),
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  yOffset = 20,
  xOffset = 0,
  once = true,
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -50px 0px' }}
      variants={{
        ...defaultVariants,
        hidden: { ...defaultVariants.hidden, y: yOffset, x: xOffset },
      }}
      custom={{ delay, yOffset, xOffset }}
      transition={createTransition(duration, [0.16, 1, 0.3, 1])}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStaggered({
  children,
  delay = 0,
  stagger = 0.1,
  className = '',
  yOffset = 20,
  xOffset = 0,
  once = true,
}: Omit<FadeInProps, 'duration'> & { stagger?: number }) {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    }),
  };

  const item: Variants = {
    hidden: { opacity: 0, y: yOffset, x: xOffset },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: createTransition(0.6, [0.16, 1, 0.3, 1])
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -50px 0px' }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
