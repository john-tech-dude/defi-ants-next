'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Button from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

// Simple alert component since we don't have the UI alert component
const Alert = ({ variant = 'default', className = '', children }: { variant?: string, className?: string, children: React.ReactNode }) => (
  <div className={`p-4 rounded-md ${variant === 'destructive' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'} ${className}`}>
    {children}
  </div>
);

const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-medium mb-1 text-foreground">
    {children}
  </h3>
);

const AlertDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </AlertDescription>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload Page
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
