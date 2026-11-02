import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';

const titleVariants = cva(
  'font-display tracking-wide text-foreground',
  {
    variants: {
      variant: {
        h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
        h2: 'text-3xl sm:text-4xl md:text-5xl',
        h3: 'text-2xl sm:text-3xl md:text-4xl',
        h4: 'text-xl sm:text-2xl md:text-3xl',
        h5: 'text-lg sm:text-xl md:text-2xl font-medium font-body tracking-tight',
        h6: 'text-base sm:text-lg md:text-xl font-medium font-body tracking-tight',
      },
      gradient: {
        primary: 'gold-foil',
        secondary: 'bg-clip-text text-transparent bg-gradient-to-r from-secondary-500 to-primary-400',
        accent: 'bg-clip-text text-transparent bg-gradient-to-r from-accent-500 to-primary-400',
        none: '',
      },
      align: {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
      },
    },
    defaultVariants: {
      variant: 'h2',
      gradient: 'none',
      align: 'left',
    },
  }
);

export interface TitleProps 
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
}

export function Title({
  as: Component = 'h2',
  variant,
  gradient,
  align,
  className,
  children,
  ...props
}: TitleProps) {
  return (
    <Component 
      className={cn(
        titleVariants({ variant, gradient, align }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
