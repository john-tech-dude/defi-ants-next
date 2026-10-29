"use client";

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Wallet as WalletIcon } from 'lucide-react';

// Dynamically import the JupiterTerminal component with no SSR
const JupiterTerminal = dynamic(
  () => import('./JupiterTerminal'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="sr-only">Loading Jupiter Terminal...</span>
      </div>
    )
  }
);

interface JupiterSwapProps {
  className?: string;
  onSuccess?: () => void;
  inputMint?: string;
  outputMint?: string;
  fixedInputMint?: boolean;
  fixedOutputMint?: boolean;
}

const JupiterSwap = ({ 
  className = "", 
  onSuccess, 
  inputMint = 'So11111111111111111111111111111111111111112', // Default to SOL
  outputMint = process.env.NEXT_PUBLIC_TOKEN_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Default to USDC or env token
  fixedInputMint = false,
  fixedOutputMint = false
}: JupiterSwapProps) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();

  const handleSuccess = useCallback(() => {
    toast.success('Swap completed successfully!');
    onSuccess?.();
  }, [onSuccess]);

  const handleError = useCallback((error: Error) => {
    console.error('Jupiter Terminal error:', error);
    setError(error.message || 'Failed to initialize Jupiter Terminal');
    toast.error('Failed to initialize swap interface');
  }, []);

  const handleInitialized = useCallback(() => {
    setInitialized(true);
    setError(null);
  }, []);

  useEffect(() => {
    // Set a timeout to show error if Jupiter doesn't initialize within 15 seconds
    const timer = setTimeout(() => {
      if (!initialized && !error) {
        console.warn('Jupiter Terminal initialization timeout');
        setError('Taking longer than expected to load. This could be due to network issues or Content Security Policy restrictions.');
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [initialized, error]);
  
  // Check if we're in an iframe or if there are CSP issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if we're in an iframe
      if (window.self !== window.top) {
        console.warn('Jupiter Terminal is running in an iframe, which may cause issues');
      }
      
      // Check if we can access localStorage as a proxy for CSP restrictions
      try {
        window.localStorage.getItem('test');
      } catch (e) {
        console.error('LocalStorage access denied, possible CSP issues:', e);
        setError('Content Security Policy restrictions detected. Jupiter Terminal may not load properly.');
      }
    }
  }, []);

  const handleRetry = useCallback(() => {
    console.log('Retrying Jupiter Terminal initialization');
    setError(null);
    setInitialized(false);
    
    // Force reload of the component by changing its key
    const jupiterContainer = document.getElementById('jupiter-terminal-container');
    if (jupiterContainer) {
      jupiterContainer.innerHTML = '';
    }
    
    // Remove any existing Jupiter script to force a clean reload
    const existingScript = document.querySelector('script[src="https://terminal.jup.ag/main.v2.js"]');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }
    
    // Clear any Jupiter-related items from localStorage
    try {
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        if (key.includes('jup') || key.includes('jupiter')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }, []);

  if (!publicKey) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <WalletIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
        <p className="text-center text-gray-500 mb-4">
          Please connect your wallet to use Jupiter Swap
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {error ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </button>
        </div>
      ) : (
        <JupiterTerminal 
          key={`jupiter-terminal-${initialized ? 'loaded' : 'loading'}`}
          onSuccess={handleSuccess}
          onError={handleError}
          onInitialized={handleInitialized}
          inputMint={inputMint}
          outputMint={outputMint}
          fixedInputMint={fixedInputMint}
          fixedOutputMint={fixedOutputMint}
        />
      )}
    </div>
  );
};

export default JupiterSwap;
