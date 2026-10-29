'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Dynamically import the JupiterSwap component with SSR disabled
const JupiterSwap = dynamic(
  () => import('@/components/swap/JupiterSwap').then((mod) => mod.JupiterSwap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full max-w-xl mx-auto min-h-[500px] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-64 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    )
  }
);

export function Swap() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-xl mx-auto min-h-[500px] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-64 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 rounded-xl bg-card border border-border shadow-lg">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-bold text-center">Swap to ANT Token</h2>
        
        {!connected ? (
          <div className="w-full flex flex-col items-center space-y-4">
            <p className="text-muted-foreground text-center">
              Connect your wallet to start swapping to ANT tokens
            </p>
            <WalletMultiButton className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg" />
          </div>
        ) : (
          <div className="w-full min-h-[500px]">
            <JupiterSwap />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground text-center">
          Powered by Jupiter Aggregator
        </div>
      </div>
    </div>
  );
}

export default Swap;
