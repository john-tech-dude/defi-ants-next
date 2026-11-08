'use client';

import { useEffect, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { Wallet as WalletIcon } from 'lucide-react';

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Jupiter Plugin script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@jup-ag/plugin@latest/dist/index.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      initPlugin();
    };
    script.onerror = () => {
      setError('Failed to load Jupiter Plugin');
      toast.error('Failed to load Jupiter Plugin');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initPlugin = async () => {
    if (!containerRef.current || !window.JupiterPlugin) return;

    try {
      const walletAdapter = wallet?.adapter || null;

      await window.JupiterPlugin.init({
        container: containerRef.current,
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
    } catch (err) {
      console.error('Failed to initialize Jupiter Plugin:', err);
      setError('Failed to initialize Jupiter Plugin');
      toast.error('Failed to initialize Jupiter Plugin');
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
      <div ref={containerRef} className="w-full min-h-[500px]" />
    </div>
  );
}
