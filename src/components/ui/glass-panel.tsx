'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  hoverEffect?: boolean;
  borderEffect?: boolean;
}

export function GlassPanel({
  children,
  className,
  intensity = 'medium',
  hoverEffect = true,
  borderEffect = true,
}: GlassPanelProps) {
  // Intensity levels for the glass effect
  const intensityStyles = {
    light: 'bg-white/50 backdrop-blur-sm',
    medium: 'bg-white/60 backdrop-blur-md',
    heavy: 'bg-white/70 backdrop-blur-lg',
  };

  // Animation variants
  const glassAnimation = {
    hover: hoverEffect ? {
      y: -4,
      boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.15)`,
      borderColor: borderEffect ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.2)',
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    } : {},
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl border',
        intensityStyles[intensity],
        borderEffect ? 'border-white/20' : 'border-transparent',
        'transition-all duration-300',
        className
      )}
      initial={{
        y: 0,
        boxShadow: `0 4px 16px 0 rgba(0, 0, 0, 0.1)`,
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }}
      whileHover="hover"
      variants={glassAnimation}
    >
      {children}
    </motion.div>
  );
}
