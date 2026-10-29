import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'premium' | 'glass';
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'premium':
          return 'border-border-highlight bg-gray-900/40 backdrop-blur-sm text-white placeholder:text-gray-400 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/30 transition-all duration-200';
        case 'glass':
          return 'bg-gray-900/30 backdrop-blur-md border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-white/20 focus-visible:border-white/20 shadow-inner';
        default:
          return 'border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring';
      }
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          getVariantClasses(),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export default Input;
