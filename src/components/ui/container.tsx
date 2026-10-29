import { cn } from '@/lib/utils';
import { ComponentProps, forwardRef } from 'react';

type ContainerProps = ComponentProps<'div'> & {
  as?: React.ElementType;
  className?: string;
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = 'div', className, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'container mx-auto px-4 sm:px-6 lg:px-8',
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';
