import { useState, useCallback, useRef, useEffect } from 'react';

type AsyncFunction<T, P extends any[]> = (...args: P) => Promise<T>;

export interface UseAsyncOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T, P extends any[] = any[]>(
  asyncFunction: AsyncFunction<T, P>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = false, initialData, onSuccess, onError } = options;
  
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  // Set isMounted to false on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: P) => {
      if (!isMounted.current) return;
      
      setStatus('pending');
      setError(null);

      try {
        const response = await asyncFunction(...args);
        
        if (!isMounted.current) return;
        
        setData(response);
        setStatus('success');
        onSuccess?.(response);
        return response;
      } catch (err) {
        if (!isMounted.current) return;
        
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        setStatus('error');
        onError?.(error);
        throw error;
      }
    },
    [asyncFunction, onError, onSuccess]
  );

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P));
    }
  }, [execute, immediate]);

  return {
    execute,
    data,
    error,
    status,
    isLoading: status === 'pending',
    isIdle: status === 'idle',
    isSuccess: status === 'success',
    isError: status === 'error',
    setData,
    setError: (error: Error | null) => {
      setError(error);
      setStatus(error ? 'error' : 'idle');
    },
  };
}

// Example usage:
/*
const { 
  execute: fetchData, 
  data, 
  isLoading, 
  error 
} = useAsync(fetchSomeData, { immediate: true });
*/

export default useAsync;
