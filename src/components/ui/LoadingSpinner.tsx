import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'muted';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorMap = {
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  white: 'text-white',
  muted: 'text-muted-foreground',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text,
  className,
  fullScreen = false,
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          'animate-spin',
          sizeMap[size],
          colorMap[color]
        )}
      />
      {text && (
        <p className={cn('mt-2 text-sm', `text-${colorMap[color].split('-')[1]}`)}>
          {text}
        </p>
      )}
    </div>
  );

  return spinner;
}
