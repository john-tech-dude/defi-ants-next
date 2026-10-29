'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'primary' | 'secondary' | 'accent' | 'none';
  variant?: 'default' | 'elevated' | 'subtle';
}

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  glowColor = 'primary',
  variant = 'default',
}: GlassCardProps) {
  // Base glass effect styles
  const baseStyles = 'backdrop-blur-lg border rounded-xl overflow-hidden';
  
  // Variant styles
  const variants = {
    default: 'bg-card/80 border-white/10 dark:border-white/5',
    elevated: 'bg-card/90 border-white/20 dark:border-white/10 shadow-lg',
    subtle: 'bg-card/60 border-white/5 dark:border-transparent',
  };
  
  // Glow effect based on color
  const glowEffects = {
    primary: 'before:bg-primary/10 dark:before:bg-primary/5',
    secondary: 'before:bg-secondary/10 dark:before:bg-secondary/5',
    accent: 'before:bg-accent/10 dark:before:bg-accent/5',
    none: '',
  };
  
  // Hover animation variants
  const hoverVariants = {
    initial: { y: 0, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' },
    hover: hoverEffect ? { 
      y: -5, 
      boxShadow: glowColor !== 'none' 
        ? `0 15px 30px -10px var(--${glowColor === 'primary' ? 'primary' : glowColor === 'secondary' ? 'secondary' : 'accent'}-glow-color, rgba(0, 0, 0, 0.3))` 
        : '0 15px 30px -10px rgba(0, 0, 0, 0.2)'
    } : {},
  };

  return (
    <motion.div
      className={cn(
        baseStyles,
        variants[variant],
        glowColor !== 'none' && 'relative before:absolute before:inset-0 before:opacity-0 before:transition-opacity hover:before:opacity-100',
        glowEffects[glowColor],
        className
      )}
      initial="initial"
      whileHover="hover"
      variants={hoverVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
