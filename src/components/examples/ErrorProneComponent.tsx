'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function ErrorProneComponent() {
  const [count, setCount] = useState(0);
  const { handleError } = useErrorHandler({ 
    context: 'ErrorProneComponent',
    showToast: true,
  });

  const triggerError = () => {
    try {
      // This will throw an error when count is 3
      if (count === 3) {
        throw new Error('Example error: Count reached 3');
      }
      setCount(c => c + 1);
    } catch (error) {
      handleError(error, { count });
    }
  };

  const triggerUnhandledError = () => {
    // This error will be caught by the ErrorBoundary
    throw new Error('Unhandled error in render');
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">Error Handling Example</h2>
      
      <div className="space-y-2">
        <p>Count: {count}</p>
        <div className="flex gap-2">
          <Button onClick={triggerError}>
            Increment (throws at 3)
          </Button>
          <Button 
            variant="outline" 
            onClick={triggerUnhandledError}
          >
            Trigger Unhandled Error
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Try both buttons to see different error handling in action.
      </p>
    </div>
  );
}

export default ErrorProneComponent;
