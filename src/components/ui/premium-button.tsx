'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  animateOnHover?: boolean;
}

export function PremiumButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  loading = false,
  animateOnHover = true,
  ...props
}: PremiumButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/5',
    ghost: 'bg-transparent hover:bg-primary/5 text-primary',
  };

  // Animation variants
  const buttonAnimation = {
    tap: { scale: 0.98 },
    hover: animateOnHover ? { 
      y: -2,
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
      transition: { 
        type: "spring" as const, 
        stiffness: 400, 
        damping: 10 
      }
    } : { y: 0, boxShadow: 'none' },
  } as const;

  // Icon animation
  const iconAnimation = {
    left: {
      hover: { x: -3, transition: { type: "spring" as const, stiffness: 300 } },
      initial: { x: 0 }
    },
    right: {
      hover: { x: 3, transition: { type: "spring" as const, stiffness: 300 } },
      initial: { x: 0 }
    }
  };

  return (
    <motion.button
      className={cn(
        'rounded-lg font-medium relative overflow-hidden transition-all',
        'flex items-center justify-center gap-2',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        disabled || loading ? 'opacity-70 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || loading}
      whileTap={!disabled && !loading ? 'tap' : undefined}
      whileHover={!disabled && !loading ? 'hover' : undefined}
      variants={buttonAnimation}
      onDragStart={(e) => e.preventDefault()}
      {...props as any}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      
      <div className={cn('flex items-center gap-2', loading ? 'opacity-0' : '')}>
        {icon && iconPosition === 'left' && (
          <motion.span variants={iconAnimation.left} initial="initial" whileHover="hover">
            {icon}
          </motion.span>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && (
          <motion.span variants={iconAnimation.right} initial="initial" whileHover="hover">
            {icon}
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}
