"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Default styles for wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const { publicKey, connected } = useWallet();
  const [isMounted, setIsMounted] = useState(false);

  // Only run on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state during SSR
  if (!isMounted) {
    return (
      <button 
        className={cn(
          'inline-flex items-center justify-center',
          'h-10 px-4 py-2',
          'bg-blue-600 text-white',
          'rounded-lg font-medium',
          'opacity-50 cursor-not-allowed',
          className
        )}
        disabled
      >
        Loading...
      </button>
    );
  }

  // Define the button styling
  const buttonClasses = cn(
    '!inline-flex items-center justify-center',
    '!px-4 !py-2 !rounded-lg !font-medium',
    '!bg-blue-600 hover:!bg-blue-700 !text-white',
    '!transition-colors !duration-200',
    '!h-10',
    className
  );

  return (
    <div className="wallet-connect-wrapper">
      <WalletMultiButton className={buttonClasses}>
        {!connected ? 'Connect Wallet' : 'Connected'}
      </WalletMultiButton>
    </div>
  );
}
