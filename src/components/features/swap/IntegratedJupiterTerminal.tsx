'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Button from "@/components/ui/button";
import Skeleton from '@/components/ui/Skeleton';
import { Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Jupiter Terminal Types
// Using global types from src/types/global.d.ts

interface IntegratedJupiterTerminalProps {
  className?: string;
  onSuccess?: (txid: string) => void;
  onError?: (error: Error) => void;
  onConnectWallet?: () => Promise<boolean>;
  publicKey?: PublicKey | null;
  connected?: boolean;
  containerStyles?: React.CSSProperties;
}

function IntegratedJupiterTerminal({
  className = '',
  onSuccess,
  onError,
  onConnectWallet,
  publicKey: propPublicKey,
  connected: propConnected = false,
  containerStyles = {
    width: '100%',
    minHeight: '500px',
    display: 'flex',
  },
}: IntegratedJupiterTerminalProps) {
  // Use wallet from props or fall back to useWallet()
  const wallet = useWallet();
  const publicKey = propPublicKey || wallet.publicKey;
  const connected = propConnected || wallet.connected;
  const connect = wallet.connect;
  const connecting = wallet.connecting;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const jupiterRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle wallet connection
  const handleConnect = useCallback(async () => {
    if (!isMounted) return false;
    
    try {
      if (onConnectWallet) {
        return await onConnectWallet();
      } else if (connect) {
        await connect();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Only show error if it's not a user cancellation
      if (!errorMessage.includes('User rejected') && !errorMessage.includes('User cancelled') && isMounted && toast) {
        toast({
          title: 'Connection Error',
          description: 'Failed to connect wallet. Please try again.',
          variant: 'destructive',
        });
      }
      return false;
    }
  }, [connect, onConnectWallet, toast, isMounted]);

  // Cleanup function for the Jupiter Terminal
  const cleanupJupiter = useCallback(() => {
    if (!isMounted) return;
    
    console.log('Cleaning up Jupiter Terminal');
    try {
      if (jupiterRef.current && window.Jupiter && typeof window.Jupiter.terminal_remove === 'function') {
        console.log('Calling terminal_remove');
        window.Jupiter.terminal_remove();
      } else if (window.Jupiter) {
        console.log('Jupiter terminal_remove function not available');
      }
    } catch (e) {
      console.error('Error cleaning up Jupiter Terminal:', e);
    } finally {
      jupiterRef.current = null;
    }
  }, [isMounted]);

  // Initialize Jupiter Terminal
  const initJupiter = useCallback(async () => {
    console.log('initJupiter called', { isMounted, hasContainer: !!containerRef.current, hasJupiter: !!window.Jupiter, hasJupiterRef: !!jupiterRef.current });
    
    if (!isMounted) {
      console.log('Not mounted, skipping initialization');
      return;
    }
    
    if (!containerRef.current) {
      console.log('Container ref not set');
      return;
    }
    
    if (jupiterRef.current) {
      console.log('Jupiter already initialized');
      return;
    }

    // Check if Jupiter is available on window
    if (!window.Jupiter) {
      console.log('Jupiter not available, loading script...');
      
      // Check if script is already being loaded
      if (!document.querySelector('script[src="https://terminal.jup.ag/main-v2.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://terminal.jup.ag/main-v2.js';
        script.async = true;
        script.onload = () => {
          console.log('Jupiter script loaded');
          if (window.Jupiter && isMounted) {
            initJupiter();
          }
        };
        script.onerror = (error) => {
          console.error('Failed to load Jupiter script:', error);
        };
        document.head.appendChild(script);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Initializing Jupiter Terminal...');
      
      // Ensure the container is empty
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Initialize Jupiter Terminal
      jupiterRef.current = await window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'jupiter-terminal',
        endpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        // Let Jupiter handle wallet connection
        passThroughWallet: undefined,
        formProps: {
          fixedOutputMint: true,
          initialOutputMint: 'ANTPSP2XUF2uG2Yajr7DUDKg5E4u6F9kDzT3gBAeY9vF', // ANT token mint address
          fixedInputMint: false,
          initialAmount: '',
          initialSlippageBps: 50, // 0.5%
          useWalletPassthrough: true,
        },
        onSuccess: (txHash: string) => {
          console.log('Jupiter swap successful:', txHash);
          if (isMounted) {
            if (toast) {
              toast({
                title: 'Swap Successful',
                description: 'Your tokens have been swapped successfully!',
                variant: 'default',
              });
            }
            if (onSuccess) onSuccess(txHash);
          }
        },
        onError: (error: Error) => {
          console.error('Jupiter Terminal Error:', error);
          const errorMsg = error?.message || 'Failed to complete swap';
          if (isMounted) {
            setError(errorMsg);
            if (toast) {
              toast({
                title: 'Swap Error',
                description: errorMsg,
                variant: 'destructive',
              });
            }
          }
          if (onError) onError(error);
        },
        onRequestConnectWallet: async () => {
          console.log('Jupiter requested wallet connection');
          try {
            const success = await handleConnect();
            if (success && isMounted) {
              // Small delay to ensure wallet state is updated
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Verify wallet is connected
              if (publicKey) {
                return true;
              }
              
              // If we don't have publicKey but no error was thrown, wait a bit more
              await new Promise(resolve => setTimeout(resolve, 500));
              return !!publicKey;
            }
            return false;
          } catch (error) {
            console.error('Failed to connect wallet in Jupiter Terminal:', error);
            if (isMounted && toast) {
              toast({
                title: 'Connection Failed',
                description: 'Failed to connect wallet in Jupiter Terminal',
                variant: 'destructive',
              });
            }
            return false;
          }
        },
      });
      
      console.log('Jupiter Terminal initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Jupiter Terminal:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to initialize swap interface';
      setError(errorMsg);
      if (toast) {
        toast({
          title: 'Initialization Error',
          description: errorMsg,
          variant: 'destructive',
        });
      }
      if (onError && error instanceof Error) onError(error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [isMounted, cleanupJupiter, publicKey, handleConnect, onSuccess, onError, toast]);

  // Initialize Jupiter Terminal only once when component mounts
  useEffect(() => {
    if (!isMounted) return;
    
    const reinitialize = async () => {
      try {
        // Don't automatically connect to wallet
        console.log('Initializing Jupiter Terminal without automatic wallet connection');
        
        // Clean up existing instance if it exists
        if (jupiterRef.current && window.Jupiter?.terminal_remove) {
          try {
            console.log('Cleaning up existing Jupiter instance');
            window.Jupiter.terminal_remove();
          } catch (e) {
            console.error('Error cleaning up Jupiter Terminal:', e);
          } finally {
            jupiterRef.current = null;
          }
        }

        // Only reinitialize if we have a container and Jupiter is available
        if (containerRef.current && window.Jupiter) {
          console.log('Calling initJupiter from reinitialize');
          await initJupiter();
        } else {
          console.log('Jupiter not available yet, will retry...');
          // If Jupiter isn't available yet, try again shortly
          if (window.Jupiter === undefined) {
            const script = document.createElement('script');
            script.src = 'https://terminal.jup.ag/main-v2.js';
            script.async = true;
            script.onload = () => {
              if (window.Jupiter && isMounted) {
                initJupiter();
              }
            };
            document.head.appendChild(script);
          }
        }
      } catch (error) {
        console.error('Error in wallet change handler:', error);
      }
    };

    // Add a small delay to ensure wallet state is fully updated
    const timeoutId = setTimeout(reinitialize, 300);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMounted]); // Only depend on isMounted to prevent automatic reconnection

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gray-900/50 border border-gray-800 w-full" style={containerStyles}>
        <Skeleton className="w-full h-12 mb-4" />
        <Skeleton className="w-3/4 h-8 mb-6" />
        <Skeleton className="w-full h-64 mb-6" />
        <Skeleton className="w-1/2 h-10 mb-4" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-red-900/10 border border-red-800/50 text-center" style={containerStyles}>
        <div className="text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-300 mb-2">Something went wrong</h3>
        <p className="text-red-400 mb-6 max-w-md">{error}</p>
        <Button
          variant="outline"
          className="border-red-600 text-red-300 hover:bg-red-900/30 hover:text-red-200"
          onClick={initJupiter}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Render wallet connection prompt if not connected
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gray-900/50 border border-gray-800 text-center" style={containerStyles}>
        <div className="bg-blue-900/20 p-4 rounded-full mb-4">
          <Wallet className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Connect your Solana wallet to start swapping tokens
        </p>
        <Button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full max-w-xs"
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`w-full ${className}`}
      style={containerStyles}
    >
      <div id="jupiter-terminal" className="w-full h-full" ref={containerRef}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-4 w-24 bg-muted rounded-full mx-auto mb-2"></div>
            <div className="h-4 w-32 bg-muted rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { IntegratedJupiterTerminal };
