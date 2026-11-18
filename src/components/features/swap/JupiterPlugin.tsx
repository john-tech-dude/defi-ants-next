'use client';

import { useEffect, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import { Wallet as WalletIcon } from 'lucide-react';
import { MAINNET_RPC, WSOL_MINT, swapOutputMint } from '@/config/solana';

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
  inputMint = WSOL_MINT,
  outputMint = swapOutputMint(),
  fixedInputMint = false,
  fixedOutputMint = false
}: JupiterPluginProps) {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const { setVisible } = useWalletModal();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef(wallet);
  walletRef.current = wallet;
  const started = useRef(false);

  useEffect(() => {
    if (!publicKey) return;
    let cancelled = false;

    const waitForJupiter = async () => {
      if (window.Jupiter) return;
      const existing = document.querySelector('script[src="https://terminal.jup.ag/main-v4.js"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://terminal.jup.ag/main-v4.js';
        script.async = true;
        document.head.appendChild(script);
      }
      for (let attempt = 0; attempt < 20; attempt += 1) {
        if (window.Jupiter) return;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    };

    const start = async () => {
      await waitForJupiter();
      if (cancelled || !containerRef.current || !window.Jupiter) {
        if (!cancelled) setError('Jupiter Swap failed to load. Refresh and try again.');
        return;
      }

      const syncWallet = () => {
        window.Jupiter.syncProps?.({ passthroughWalletContextState: walletRef.current });
      };

      try {
        if (!started.current) {
          await window.Jupiter.init({
            displayMode: 'integrated',
            integratedTargetId: 'jupiter-terminal',
            endpoint: MAINNET_RPC,
            enableWalletPassthrough: true,
            passthroughWalletContextState: walletRef.current,
            onRequestConnectWallet: () => setVisible(true),
            formProps: {
              initialInputMint: inputMint,
              initialOutputMint: outputMint,
              fixedInputMint,
              fixedOutputMint,
              swapMode: 'ExactIn',
            },
            onSuccess: () => {
              toast.success('Swap completed');
              onSuccess?.();
            },
            onSwapError: ({ error: swapError }: { error?: { message?: string } }) => {
              const message = swapError?.message || 'Swap failed';
              if (!message.toLowerCase().includes('reject')) toast.error(message);
            },
          });
          started.current = true;
        } else {
          syncWallet();
        }
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize Jupiter:', err);
        if (!cancelled) {
          setError('Jupiter Swap failed to initialize');
          toast.error('Jupiter Swap failed to initialize');
        }
      }
    };

    start();
    return () => {
      cancelled = true;
    };
  }, [publicKey, connected, inputMint, outputMint, fixedInputMint, fixedOutputMint, onSuccess, setVisible]);

  useEffect(() => {
    if (!started.current || !window.Jupiter?.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState: walletRef.current });
  }, [connected, publicKey]);

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
