import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressVariants = cva(
  'h-2 w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      variant: {
        default: 'bg-primary/20',
        success: 'bg-emerald-500/20',
        warning: 'bg-amber-500/20',
        destructive: 'bg-destructive/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 bg-primary transition-all',
        variant === 'success' && 'bg-emerald-500',
        variant === 'warning' && 'bg-amber-500',
        variant === 'destructive' && 'bg-destructive',
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
