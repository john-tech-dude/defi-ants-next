import { EffectCallback, DependencyList, useEffect, useLayoutEffect } from 'react';

/**
 * A custom hook that resolves to `useLayoutEffect` on the client and
 * `useEffect` on the server to avoid warnings during server-side rendering.
 *
 * @param effect - The effect callback to run
 * @param deps - Optional dependencies array
 * 
 * @example
 * useIsomorphicLayoutEffect(() => {
 *   // This will run synchronously after all DOM mutations in the browser
 *   // and fall back to useEffect during server-side rendering
 *   console.log('Component mounted or updated');
 *   
 *   return () => {
 *     // Cleanup function
 *   };
 * }, [dependencies]);
 */
export const useIsomorphicLayoutEffect: typeof useEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  // Use useLayoutEffect in the browser and useEffect during SSR
  const useEffectFn = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  
  // Call the effect with the appropriate dependencies
  useEffectFn(effect, deps);
};

/**
 * A version of useIsomorphicLayoutEffect that accepts a dependency array
 * and returns a cleanup function.
 * 
 * @deprecated Use the standard version above which has the same signature as useEffect/useLayoutEffect
 */
export function useIsomorphicLayoutEffectWithDeps(
  effect: EffectCallback,
  deps: DependencyList
) {
  useIsomorphicLayoutEffect(effect, deps);
}

export default useIsomorphicLayoutEffect;
