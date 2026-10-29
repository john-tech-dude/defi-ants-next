'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
  outline: 'text-foreground border-border',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantClasses;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          variantClasses[variant],
          className
        )} 
        {...props} 
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
