'use client';

import React, { useEffect, useState, useRef } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Wallet, ExternalLink, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

// Make sure wallet adapter styles are imported in your global CSS or JupiterWalletProvider


// Loading skeleton for the wallet button
const WalletButtonSkeleton = ({ className }: { className?: string }) => (
  <div className={cn(
    'h-10 w-32 bg-muted rounded-full animate-pulse',
    className
  )} />
);

interface WalletConnectButtonProps {
  className?: string;
  showConnectedInfo?: boolean;
}

// Wrap with ErrorBoundary
export default function WalletConnectButton(props: WalletConnectButtonProps) {
  return (
    <ErrorBoundary>
      <WalletConnectButtonContent {...props} />
    </ErrorBoundary>
  );
}

function WalletConnectButtonContent({
  className,
  showConnectedInfo = true,
}: WalletConnectButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const { connected, walletAddress, formatAddress } = useWalletConnection();
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';
  
  // Timer reference stored in a ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-hide the wallet details popup after a delay
  useEffect(() => {
    if (connected && showDetails) {
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // Set a new timer
      timerRef.current = setTimeout(() => {
        setShowDetails(false);
      }, 5000);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [showDetails, connected]);

  // Set mounted state on component mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Format wallet address with proper truncation
  const displayAddress = walletAddress ? formatAddress(walletAddress) : '';

  // Copy wallet address to clipboard
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setShowCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  // Don't render on server side
  if (!isMounted) {
    return <WalletButtonSkeleton className={className} />;
  }

  return (
    <div className="relative">
      {/* Use the built-in WalletMultiButton styled with custom classes */}
      <div onClick={() => connected && setShowDetails(!showDetails)}>
        <WalletMultiButton 
          className={cn(
            "wallet-adapter-button-trigger",
            "!bg-primary hover:!bg-primary-600 active:!bg-primary-700", 
            "!rounded-full !h-10 !px-4 flex items-center justify-center gap-2",
            "text-white font-medium text-sm transition-all duration-200",
            "hover:scale-[1.02] active:scale-[0.98]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-50",
            "!overflow-hidden",
            connected && "!bg-primary/10 !text-primary border border-primary/20",
            className
          )}
          style={{
            borderRadius: '9999px', // Force rounded edges
            pointerEvents: 'auto' // Ensure clicks are registered
          }}
          // Remove the icon completely when not connected
          startIcon={connected ? undefined : null}
        />
      </div>
      
      {/* Information popup when connected */}
      <AnimatePresence>
        {connected && showConnectedInfo && walletAddress && showDetails && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 p-3 bg-background rounded-xl shadow-lg border border-border w-64 z-50"
            onMouseEnter={() => {
              // Clear auto-hide timer when mouse enters the popup
              if (timerRef.current) clearTimeout(timerRef.current);
            }}
            onMouseLeave={() => {
              // Set a new timer when mouse leaves the popup
              timerRef.current = setTimeout(() => setShowDetails(false), 1000);
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium">Connected Wallet</span>
              </div>
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Wallet address with copy button */}
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2 mb-2">
              <span className="text-xs font-mono">{displayAddress}</span>
              <button 
                onClick={copyAddress}
                className="p-1 hover:bg-muted rounded-md transition-colors"
                aria-label="Copy address"
              >
                <Copy className="w-3 h-3" />
                <AnimatePresence>
                  {showCopied && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute -top-8 right-0 text-xs bg-black text-white px-2 py-1 rounded">
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            
            {/* View on Solscan */}
            <a
              href={`https://solscan.io/account/${walletAddress}?cluster=${network}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-2 text-xs bg-primary/5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View on Solscan
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
