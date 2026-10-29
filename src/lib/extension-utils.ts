/**
 * Checks if an error is likely caused by a browser extension
 * @param error The error to check
 * @returns boolean indicating if the error is from a browser extension
 */
export const isExtensionError = (error: any): boolean => {
  if (!error) return false;
  
  // Check if error is from a browser extension
  if (error.message && 
      (error.message.includes('chrome-extension://') || 
       error.message.includes('moz-extension://') ||
       error.message.includes('safari-web-extension://'))) {
    return true;
  }
  
  // Check if error stack trace includes extension URLs
  if (error.stack && 
      (error.stack.includes('chrome-extension://') || 
       error.stack.includes('moz-extension://') ||
       error.stack.includes('safari-web-extension://'))) {
    return true;
  }
  
  return false;
};

/**
 * Safe wrapper for functions that might throw extension-related errors
 * @param fn The function to execute
 * @param fallbackValue The value to return if an extension error occurs
 * @returns The result of the function or the fallback value
 */
export const withExtensionSafe = <T,>(
  fn: () => T,
  fallbackValue: T
): T => {
  try {
    return fn();
  } catch (error: any) {
    if (isExtensionError(error)) {
      console.warn('Extension-related error caught and handled:', error);
      return fallbackValue;
    }
    throw error; // Re-throw if it's not an extension error
  }
};
