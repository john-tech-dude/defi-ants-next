import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { HTMLAttributes, ReactNode } from 'react';

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
  overlayClassName?: string;
}

export function LoadingState({
  isLoading,
  loadingText = 'Loading...',
  children,
  variant = 'spinner',
  size = 'md',
  fullScreen = false,
  className = '',
  overlayClassName = '',
  ...props
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-current rounded-full animate-bounce',
                  size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );
      case 'skeleton':
        return (
          <div className="animate-pulse flex space-x-4 w-full">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        );
      case 'spinner':
      default:
        return <Loader2 className={cn('animate-spin', sizeClasses[size])} />;
    }
  };

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)} {...props}>
      {fullScreen ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            {renderLoader()}
            {loadingText && (
              <p className="text-sm text-muted-foreground">{loadingText}</p>
            )}
          </div>
        </div>
      ) : (
        <div className={cn('relative', className)}>
          {/* Overlay */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10',
              overlayClassName
            )}
          >
            {renderLoader()}
            {loadingText && (
              <p className="mt-2 text-sm text-muted-foreground">
                {loadingText}
              </p>
            )}
          </div>
          {/* Content */}
          <div className={isLoading ? 'opacity-30' : 'opacity-100'}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Example usage:
/*
<LoadingState 
  isLoading={isLoading} 
  loadingText="Loading data..."
  variant="dots"
  size="md"
  fullScreen={false}
  className="p-4 rounded-lg"
  overlayClassName="rounded-lg"
>
  <YourComponent />
</LoadingState>
*/
