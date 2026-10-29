'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden backdrop-blur-sm',
        variant === 'default' && 'bg-card/80',
        variant === 'elevated' && 'bg-card/90 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
