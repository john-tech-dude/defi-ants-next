import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        card: 'rounded-xl',
        button: 'h-10 w-24',
        input: 'h-10 w-full',
        text: 'h-4 w-full',
        heading: 'h-6 w-3/4',
        paragraph: 'h-4 w-full',
        avatar: 'rounded-full',
      },
      size: {
        default: 'h-4',
        sm: 'h-2',
        lg: 'h-6',
        xl: 'h-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, size, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Skeleton };
export default Skeleton;
