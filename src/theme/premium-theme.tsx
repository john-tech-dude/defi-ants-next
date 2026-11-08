import React from 'react';
import { cn } from '@/lib/utils';

// Premium Theme Utility Components
export const PremiumCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'rounded-xl border border-border-highlight bg-gradient-to-br from-gray-900/90 to-gray-950 dark:shadow-card transition-all duration-300',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const GlassCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'rounded-xl bg-gray-900/40 backdrop-blur-xl border border-white/10 dark:shadow-xl transition-all duration-300',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const PremiumHeading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h2
      className={cn(
        'font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export const PremiumButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5 active:translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <button 
      className={cn(
        'relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all bg-gray-900/40 backdrop-blur-md border border-white/10 text-white hover:bg-gray-900/60 hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0',
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
};

export const PremiumTooltip: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'z-50 overflow-hidden rounded-lg px-4 py-2.5 text-sm border border-border-highlight bg-gray-900/95 backdrop-blur-md text-white shadow-xl',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const PremiumInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-lg border border-border-highlight bg-gray-900/40 backdrop-blur-sm text-white placeholder:text-gray-400 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all duration-200',
        className
      )}
      {...props}
    />
  );
};

export const PremiumGradientBorder: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative rounded-xl p-[1px] overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 opacity-70" />
      <div className="relative bg-gray-900 rounded-[calc(0.75rem-1px)] p-4">
        {children}
      </div>
    </div>
  );
};

// Premium Text Effects
export const GradientText: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Animation Wrappers
export const HoverScaleWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'transition-all duration-300 hover:scale-105',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// Premium Focus States
export const PremiumFocusWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
