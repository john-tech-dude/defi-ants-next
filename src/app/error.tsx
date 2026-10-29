'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
