'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { reportError } from '@/lib/error-reporting';
import { useWallet } from '@solana/wallet-adapter-react';

interface ErrorBoundaryProviderProps {
  children: ReactNode;
  userId?: string;
}

export const ErrorBoundaryProvider = ({ 
  children,
  userId
}: ErrorBoundaryProviderProps) => {
  const { publicKey } = useWallet();
  const pathname = usePathname();

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Global error caught:', error, errorInfo);
    
    // Report error with additional context
    const errorContext: Record<string, unknown> = {
      componentStack: errorInfo.componentStack,
      path: pathname,
    };
    
    if (userId) {
      errorContext.userId = userId;
    }
    
    if (publicKey) {
      errorContext.walletAddress = publicKey.toBase58();
    }
    
    reportError(error, errorContext);

    // Show user-friendly error toast
    toast.error('An unexpected error occurred', {
      description: error.message || 'Please try again later.',
      duration: 10000,
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  };

  // Global fallback UI
  const globalFallback = (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We're having trouble loading the application. This might be a temporary issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
          <a
            href="/"
            className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      onError={handleError}
      fallback={globalFallback}
      resetKeys={[pathname]} // Reset error boundary on route change
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryProvider;
