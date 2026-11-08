'use client';

import { useEffect, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { Wallet as WalletIcon } from 'lucide-react';

// Define Jupiter Plugin types
declare global {
  interface Window {
    Jupiter: any;
  }
}

interface JupiterPluginProps {
  onSuccess?: () => void;
  inputMint?: string;
  outputMint?: string;
  fixedInputMint?: boolean;
  fixedOutputMint?: boolean;
}

export default function JupiterPlugin({
  onSuccess,
  inputMint = 'So11111111111111111111111111111111111111112', // SOL
  outputMint = process.env.NEXT_PUBLIC_TOKEN_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC or env token
  fixedInputMint = false,
  fixedOutputMint = false
}: JupiterPluginProps) {
  const { publicKey, wallet, connected } = useWallet();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [jupiterReady, setJupiterReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Jupiter is already loaded
    if (window.Jupiter) {
      console.log('Jupiter already loaded');
      setJupiterReady(true);
      setIsLoaded(true);
      return;
    }

    // Load Jupiter Terminal script (v4 API)
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v2.js';
    script.async = true;

    script.onload = () => {
      console.log('Jupiter Terminal script loaded');
      // Wait a bit for Jupiter to initialize
      setTimeout(() => {
        if (window.Jupiter) {
          console.log('Jupiter object detected');
          setJupiterReady(true);
          setIsLoaded(true);
          initPlugin();
        } else {
          console.error('Jupiter object not found after script load');
          setError('Jupiter Swap failed to initialize');
          toast.error('Jupiter Swap failed to initialize');
        }
      }, 1000);
    };

    script.onerror = () => {
      console.error('Failed to load Jupiter Terminal script');
      setError('Failed to load Jupiter Swap');
      toast.error('Failed to load Jupiter Swap');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [connected, wallet]);

  useEffect(() => {
    if (jupiterReady && connected) {
      initPlugin();
    }
  }, [jupiterReady, connected, wallet, inputMint, outputMint]);

  const initPlugin = async () => {
    if (!containerRef.current || !window.Jupiter) {
      console.error('Jupiter not available:', { containerRef: !!containerRef.current, Jupiter: !!window.Jupiter });
      setError('Jupiter Swap not available');
      return;
    }

    try {
      const walletAdapter = wallet?.adapter || null;

      console.log('Initializing Jupiter Terminal with config:', {
        displayMode: 'integrated',
        integratedTargetId: 'jupiter-terminal',
        endpoint: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
        enableWalletPassthrough: !connected,
        passThroughWallet: walletAdapter,
        formProps: {
          initialInputMint: inputMint,
          initialOutputMint: outputMint,
          fixedInputMint,
          fixedOutputMint,
        }
      });

      const terminal = await window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'jupiter-terminal',
        endpoint: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
        enableWalletPassthrough: !connected,
        passThroughWallet: walletAdapter,
        formProps: {
          initialInputMint: inputMint,
          initialOutputMint: outputMint,
          fixedInputMint,
          fixedOutputMint,
        },
        onSuccess: (result: any) => {
          console.log('Swap completed successfully:', result);
          toast.success('Swap completed successfully!');
          onSuccess?.();
        },
        onSwapError: (error: any) => {
          console.error('Swap error:', error);
          const errorMessage = error.message || 'Failed to complete swap';
          toast.error(errorMessage);
        },
      });

      console.log('Jupiter Terminal initialized successfully');
    } catch (err) {
      console.error('Failed to initialize Jupiter Terminal:', err);
      setError('Failed to initialize Jupiter Swap');
      toast.error('Failed to initialize Jupiter Swap');
    }
  };

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <WalletIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
        <p className="text-center text-gray-500">
          Please connect your wallet to use Jupiter Swap
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[500px]">
      {!isLoaded && (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div id="jupiter-terminal" ref={containerRef} className="w-full min-h-[500px]" />
    </div>
  );
}
