import { useCallback } from 'react';
import { reportError } from '@/lib/error-reporting';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  context?: string;
  showToast?: boolean;
  toastDuration?: number;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { publicKey } = useWallet();
  const {
    context = 'Component',
    showToast = true,
    toastDuration = 5000,
  } = options;

  const handleError = useCallback(
    (error: unknown, customContext?: Record<string, unknown>) => {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Prepare error context
      const errorContext = {
        ...customContext,
        context,
        walletAddress: publicKey?.toBase58(),
      };
      
      // Report the error
      reportError(errorObj, errorContext);
      
      // Show toast if enabled
      if (showToast) {
        toast.error('An error occurred', {
          description: errorObj.message || 'Something went wrong. Please try again.',
          duration: toastDuration,
        });
      }
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`[${context}] Error:`, errorObj);
        if (customContext) {
          console.error('Error context:', customContext);
        }
      }
      
      return errorObj;
    },
    [context, publicKey, showToast, toastDuration]
  );

  return { handleError };
}

// Example usage:
// const { handleError } = useErrorHandler({ context: 'MyComponent' });
// try { ... } catch (error) { handleError(error, { additional: 'context' }); }
