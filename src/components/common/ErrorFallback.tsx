import Button from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { envVars } from '@/env';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  className?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  className = '',
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center',
        className
      )}
      role="alert"
    >
      <div className="p-4 mb-6 rounded-full bg-destructive/10">
        <AlertCircle className="w-12 h-12 text-destructive" />
      </div>
      
      <h1 className="mb-2 text-2xl font-bold tracking-tight">
        Something went wrong
      </h1>
      
      <p className="mb-6 text-muted-foreground">
        We're sorry, but an unexpected error occurred. Please try again or contact support if the problem persists.
      </p>

      {envVars.NODE_ENV === 'development' && (
        <details className="w-full max-w-2xl p-4 mb-6 overflow-auto text-sm text-left rounded-lg bg-muted">
          <summary className="mb-2 font-medium cursor-pointer text-muted-foreground">
            Error details
          </summary>
          <pre className="p-4 overflow-auto rounded bg-background">
            <code className="text-xs">
              {error.message}\n\n{error.stack}
            </code>
          </pre>
        </details>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={resetErrorBoundary}
          variant="default"
          className="gap-2"
          size="lg"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>

        <Button asChild variant="outline" className="gap-2" size="lg">
          <Link href="/">
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default ErrorFallback;
