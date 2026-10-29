'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
}

export function PremiumCard({
  children,
  className,
  hoverEffect = 'lift',
}: PremiumCardProps) {
  // Different hover animations based on the selected effect
  const hoverAnimations = {
    lift: {
      rest: { y: 0, boxShadow: 'var(--shadow-md)' },
      hover: { 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        transition: { type: "spring" as const, stiffness: 400, damping: 17 }
      }
    },
    glow: {
      rest: { boxShadow: 'var(--shadow-md)' },
      hover: { 
        boxShadow: '0 0 15px 2px rgba(59, 130, 246, 0.3)',
        transition: { type: "spring" as const, duration: 0.2 }
      }
    },
    border: {
      rest: { borderColor: 'hsl(var(--border))' },
      hover: { 
        borderColor: 'hsl(var(--primary))',
        transition: { type: "spring" as const, duration: 0.2 }
      }
    },
    none: {
      rest: {},
      hover: {}
    }
  };

  return (
    <motion.div
      className={cn(
        'rounded-lg bg-card p-6 border border-border',
        'backdrop-blur-sm',
        'transition-all duration-300',
        className
      )}
      initial="rest"
      whileHover="hover"
      variants={hoverAnimations[hoverEffect]}
    >
      {children}
    </motion.div>
  );
}
