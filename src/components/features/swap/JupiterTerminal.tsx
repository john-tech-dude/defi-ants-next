'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import { WalletIcon } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

// Define window.Jupiter for TypeScript with v4 API
declare global {
  interface Window {
    Jupiter: {
      init: (config: JupiterTerminalConfig) => Promise<any>;
    };
  }
}

// Define Jupiter Terminal configuration interface based on v4 API
interface JupiterTerminalConfig {
  displayMode: 'integrated' | 'widget' | 'modal';
  integratedTargetId?: string;
  endpoint?: string;
  passThroughWallet?: any;
  enableWalletPassthrough?: boolean;
  defaultExplorer?: string;
  strictTokenList?: boolean;
  formProps?: {
    initialInputMint?: string;
    initialOutputMint?: string;
    fixedInputMint?: boolean;
    fixedOutputMint?: boolean;
    initialAmount?: number;
    fixedAmount?: boolean;
    swapMode?: 'ExactIn' | 'ExactOut';
    enforceSingleTx?: boolean;
  };
  onSuccess?: (result: any) => void;
  onSwapError?: (error: any) => void;
  onRequestConnectWallet?: () => void;
}

interface JupiterTerminalProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onInitialized?: () => void;
  inputMint?: string;
  outputMint?: string;
  fixedInputMint?: boolean;
  fixedOutputMint?: boolean;
}

// Default token mints
const DEFAULT_INPUT_MINT = 'So11111111111111111111111111111111111111112'; // SOL
const DEFAULT_OUTPUT_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC

export function JupiterTerminal({ 
  onSuccess, 
  onError, 
  onInitialized, 
  inputMint = DEFAULT_INPUT_MINT,
  outputMint = process.env.NEXT_PUBLIC_TOKEN_MINT || DEFAULT_OUTPUT_MINT,
  fixedInputMint = false,
  fixedOutputMint = false
}: JupiterTerminalProps) {
  const { publicKey, wallet, connect, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Handle wallet connection request from Jupiter
  const handleConnectWallet = useCallback(() => {
    if (wallet && !connected) {
      connect().catch(error => {
        console.error('Failed to connect wallet:', error);
        toast.error('Failed to connect wallet');
      });
    }
  }, [wallet, connected, connect]);

  // Check if Jupiter script is loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if Jupiter is available in the window object
    const checkJupiterLoaded = () => {
      if (window.Jupiter) {
        console.log('Jupiter script detected in window object');
        setScriptLoaded(true);
        return true;
      }
      return false;
    };
    
    // If Jupiter is already loaded, set state immediately
    if (checkJupiterLoaded()) return;
    
    // Otherwise set up a polling mechanism to check when it becomes available
    const maxAttempts = 20;
    let attempts = 0;
    
    const intervalId = setInterval(() => {
      attempts++;
      
      if (checkJupiterLoaded() || attempts >= maxAttempts) {
        clearInterval(intervalId);
        
        if (attempts >= maxAttempts && !window.Jupiter) {
          console.error('Jupiter script failed to load after multiple checks');
          onError?.(new Error('Jupiter Terminal script not found after waiting'));
        }
      }
    }, 500); // Check every 500ms
    
    return () => clearInterval(intervalId);
  }, [onError, retryCount]);

  // Initialize Jupiter Terminal with better error handling
  useEffect(() => {
    if (!scriptLoaded || typeof window === 'undefined') return;
    
    // Check if Jupiter is available in the window object
    if (!window.Jupiter) {
      console.error('Jupiter object not found in window despite script being loaded');
      onError?.(new Error('Jupiter Terminal failed to initialize properly'));
      return;
    }

    const initJupiter = async () => {
      try {
        const container = document.getElementById('jupiter-terminal-container');
        if (!container) {
          console.error('Jupiter Terminal container not found');
          return;
        }

        // Clear any existing content
        container.innerHTML = '';

        // Get the wallet adapter with proper typing
        const walletAdapter = wallet?.adapter || null;
        
        // If wallet is not connected, we'll use wallet passthrough
        const enableWalletPassthrough = !wallet || !connected;

        console.log('Initializing Jupiter Terminal with config:', {
          displayMode: 'integrated',
          endpoint: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
          enableWalletPassthrough,
          defaultExplorer: 'Solscan',
          strictTokenList: false,
          formProps: {
            initialInputMint: inputMint,
            initialOutputMint: outputMint,
            fixedInputMint,
            fixedOutputMint,
            swapMode: 'ExactIn',
          }
        });

        // Initialize Jupiter Terminal with wallet connection using v4 API
        const terminal = await window.Jupiter.init({
          displayMode: 'integrated',
          integratedTargetId: 'jupiter-terminal-container',
          endpoint: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
          passThroughWallet: walletAdapter,
          enableWalletPassthrough,
          defaultExplorer: 'Solscan',
          strictTokenList: false, // Allow all tokens
          formProps: {
            initialInputMint: inputMint,
            initialOutputMint: outputMint,
            fixedInputMint,
            fixedOutputMint,
            swapMode: 'ExactIn',
          },
          onSuccess: (result: any) => {
            console.log('Swap completed successfully:', result);
            toast.success('Swap completed successfully!');
            onSuccess?.();
          },
          onSwapError: (error: any) => {
            console.error('Swap error:', error);
            const errorMessage = error.message || 'Failed to complete swap';
            
            // Handle common errors
            if (errorMessage.includes('Ledger') || errorMessage.includes('Access denied')) {
              toast.error('Please check your Ledger device and ensure the Solana app is open');
            } else if (errorMessage.includes('User rejected the request')) {
              // Don't show error toast for user rejection
              console.log('User rejected the transaction');
            } else {
              toast.error(errorMessage);
            }
            
            onError?.(new Error(errorMessage));
          },
          onRequestConnectWallet: handleConnectWallet
        });

        setIsLoading(false);
        onInitialized?.();

        return () => {
          // Cleanup on unmount
          try {
            terminal?.destroy();
          } catch (e) {
            console.error('Error cleaning up Jupiter Terminal:', e);
          }
        };
      } catch (error) {
        console.error('Failed to initialize Jupiter Terminal:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize swap interface';
        
        // Handle Ledger specific errors
        if (errorMessage.includes('Ledger') || errorMessage.includes('Access denied')) {
          toast.error('Please unlock your Ledger and ensure the Solana app is open');
        } else {
          toast.error(errorMessage);
        }
        
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        setIsLoading(false);
      }
    };

    initJupiter();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [
    wallet, 
    scriptLoaded, 
    onSuccess, 
    onError, 
    onInitialized, 
    connected, 
    handleConnectWallet, 
    inputMint, 
    outputMint, 
    fixedInputMint, 
    fixedOutputMint
  ]);

  if (!publicKey) {
    return (
      <div className="text-center p-8">
        <WalletIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-400 mb-4">Connect your wallet to start swapping</p>
        <WalletMultiButton className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[500px] rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div 
        id="jupiter-terminal-container" 
        className="w-full h-full min-h-[500px]"
      />
    </div>
  );
}
