import React from 'react';
import { motion } from 'framer-motion';
import { cardHover, springSmooth, fadeInUp } from '@/lib/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function AnimatedCard({
  children,
  className = '',
  hover = true,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInUp}
      transition={{ delay }}
      whileHover={hover ? cardHover : undefined}
    >
      {children}
    </motion.div>
  );
}
