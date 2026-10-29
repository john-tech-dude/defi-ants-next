'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Button from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { reportError } from '@/lib/error-reporting';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; resetError: () => void }) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: Record<string, unknown>;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  lastResetKey: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      lastResetKey: this.getResetKey(props.resetKeys)
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report the error
    reportError(error, {
      ...this.props.context,
      componentStack: errorInfo.componentStack,
    });

    // Call the onError handler if provided
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState({ error, errorInfo });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const resetKeyChanged = this.getResetKey(this.props.resetKeys) !== this.state.lastResetKey;
    
    if (resetKeyChanged && this.state.hasError) {
      // Reset error boundary when resetKeys change
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        lastResetKey: this.getResetKey(this.props.resetKeys),
      });
    }
  }

  private getResetKey(keys: unknown[] = []): string {
    return JSON.stringify(keys);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      lastResetKey: this.getResetKey(this.props.resetKeys),
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function' 
          ? this.props.fallback({
              error: this.state.error,
              resetError: this.handleReset,
            })
          : this.props.fallback;
      }

      // Default fallback UI
      return (
        <div 
          className="min-h-[200px] flex flex-col items-center justify-center p-6 rounded-lg bg-destructive/5 border border-destructive/30"
          role="alert"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h2 className="text-lg font-semibold">Something went wrong</h2>
          </div>
          
          {this.state.error && (
            <div className="mb-4 text-sm text-muted-foreground text-center">
              <p className="font-medium">{this.state.error.message}</p>
              {process.env.NODE_ENV === 'development' && this.state.error.stack && (
                <details className="mt-2 text-left">
                  <summary className="text-xs cursor-pointer">View stack trace</summary>
                  <pre className="mt-2 p-2 bg-background/50 rounded text-xs overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <Button
              onClick={this.handleReset}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="sm"
            >
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Helper component for easier usage with hooks
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  return (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};
