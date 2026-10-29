/**
 * Detects if the current device is a mobile device
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
};

/**
 * Detects and handles potential extension conflicts
 */
export const handleExtensionConflicts = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Check for known wallet extensions with safe property access
    const extensions = {
      phantom: typeof window !== 'undefined' && 
              (window as any).solana?.isPhantom && 
              !(window as any).phantom?.sol?.isPhantom, // Avoid duplicate detection
      solflare: typeof window !== 'undefined' && 
               (window as any).solflare?.isSolflare,
      backpack: typeof window !== 'undefined' && 
               ((window as any).backpack?.isBackpack || 
                (window as any).xnft?.solana?.isBackpack),
      coinbase: typeof window !== 'undefined' && 
               (window as any).coinbaseWalletSolana?.isCoinbaseWallet,
      brave: typeof window !== 'undefined' && 
             (window as any).braveSolana?.isBraveWallet
    };
    
    // Log detected extensions for debugging
    if (Object.values(extensions).some(Boolean)) {
      console.debug('Detected wallet extensions:', extensions);
    }

    // Add extension-specific workarounds
    if (extensions.phantom) {
      console.debug('Phantom extension detected');
      
      // Handle Phantom's window.solana injection
      if ((window as any).solana) {
        try {
          // Ensure we don't override existing solana object
          if (!(window as any).__phantomSolanaOriginal) {
            (window as any).__phantomSolanaOriginal = (window as any).solana;
          }
          
          // Create a proxy to handle property access safely
          (window as any).solana = new Proxy((window as any).__phantomSolanaOriginal, {
            get(target, prop) {
              try {
                return target[prop];
              } catch (error) {
                console.warn(`Error accessing window.solana.${String(prop)}:`, error);
                return undefined;
              }
            },
            set(target, prop, value) {
              console.warn(`Prevented setting window.solana.${String(prop)}`);
              return true; // Prevent setting properties
            }
          });
        } catch (error) {
          console.warn('Error setting up Phantom wallet proxy:', error);
        }
      }
    }

    if (extensions.solflare) {
      console.debug('Solflare extension detected');
    }

    if (extensions.backpack) {
      console.debug('Backpack extension detected');
    }
    
    if (extensions.coinbase) {
      console.debug('Coinbase Wallet extension detected');
    }

    if (extensions.brave) {
      console.debug('Brave Wallet extension detected');
    }
  } catch (error) {
    console.warn('Error detecting extensions:', error);
  }
};

/**
 * Safely initializes wallet-related functionality
 */
export const safeWalletInitialization = () => {
  try {
    if (typeof window === 'undefined') return true;
    
    // Add global error handler for extension-related errors
    const handleExtensionError = (event: ErrorEvent) => {
      // Ignore errors from extensions
      if (event.filename?.includes('inpage.js') || 
          event.filename?.includes('extension') ||
          event.message?.includes('window.solana') ||
          event.message?.includes('Phantom') ||
          event.message?.includes('solana')) {
        event.preventDefault();
        event.stopPropagation();
        console.debug('Suppressed extension error:', event.error);
        return true;
      }
      return false;
    };
    
    // Add error event listener
    window.addEventListener('error', handleExtensionError as EventListener);
    
    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Phantom') || 
          event.reason?.message?.includes('solana') ||
          event.reason?.message?.includes('wallet')) {
        event.preventDefault();
        console.debug('Suppressed wallet rejection:', event.reason);
        return true;
      }
      return false;
    };
    
    window.addEventListener('unhandledrejection', handleRejection as any);
    
    // Handle extension conflicts
    handleExtensionConflicts();
    
    // Cleanup function
    return () => {
      window.removeEventListener('error', handleExtensionError as EventListener);
      window.removeEventListener('unhandledrejection', handleRejection as any);
    };
  } catch (error) {
    console.error('Error during wallet initialization:', error);
    return false;
  }
};

interface WalletError extends Error {
  code?: number;
  wallet?: {
    name: string;
  };
}

/**
 * Handles wallet connection errors and returns a user-friendly message
 */
export const handleWalletError = (error: unknown): string | undefined => {
  if (!error) return undefined;
  
  console.error('Wallet error:', error);
  
  // Handle non-Error objects
  if (!(error instanceof Error)) {
    console.error('Non-Error object thrown:', error);
    return 'An unexpected error occurred';
  }
  
  const walletError = error as WalletError;
  
  // Handle user rejections silently
  const isUserRejection = [
    'user rejected',
    'user denied',
    'user cancelled',
    'rejected',
    'request rejected',
    'not selected',
    'wallet not connected',
    'wallet is not connected'
  ].some(phrase => walletError.message.toLowerCase().includes(phrase));
  
  if (isUserRejection) {
    return undefined; // Don't show error for user rejections
  }
  
  // Log the error with context
  const errorContext = {
    name: walletError.name,
    code: walletError.code,
    message: walletError.message,
    wallet: walletError.wallet?.name || 'unknown',
    stack: walletError.stack?.split('\n').slice(0, 5).join('\n'), // Only first 5 lines
    time: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
  };
  
  console.error('Wallet error context:', errorContext);
  
  // Return user-friendly messages for common errors
  if (walletError.name === 'WalletNotInstalledError' || 
      walletError.message.includes('not installed') ||
      walletError.message.includes('not found')) {
    const walletName = walletError.wallet?.name || 'wallet';
    return `${walletName} not detected. Please install the extension.`;
  }
  
  if (walletError.message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (walletError.message.includes('timeout')) {
    return 'Connection timed out. Please try again.';
  }
  
  // Return a sanitized error message (limit length)
  return walletError.message.length > 150 
    ? `${walletError.message.substring(0, 150)}...`
    : walletError.message;
};
