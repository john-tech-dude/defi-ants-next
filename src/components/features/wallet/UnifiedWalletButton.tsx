'use client';

import { useWallet, useConnection, WalletContextState } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
// Import the toast hook as a default export
import useToast from '@/components/ui/use-toast';

// Import the wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface UnifiedWalletButtonProps {
  className?: string;
}

export function UnifiedWalletButton({ className }: UnifiedWalletButtonProps) {
  const { publicKey, connect, connected, connecting, disconnect, select, wallet, wallets } = useWallet();
  const { connection } = useConnection();
  // Get the toast function from the hook
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Only show the button on the client to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check for installed wallets
  const installedWallets = useMemo(() => {
    if (!wallets?.length) return [];
    return wallets.filter(wallet => {
      return wallet.readyState === WalletReadyState.Installed || 
             wallet.readyState === WalletReadyState.Loadable;
    });
  }, [wallets]);

  // Check if any wallets are installed
  const hasInstalledWallets = useMemo(() => {
    return installedWallets.length > 0;
  }, [installedWallets]);

  // Check if we're on mobile
  const isMobile = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);
  
  // Log wallet detection for debugging
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Wallet] Available wallets:', wallets?.map(w => ({
        name: w.adapter.name,
        readyState: w.readyState,
        installed: w.readyState === WalletReadyState.Installed || 
                 w.readyState === WalletReadyState.Loadable
      })));
      console.log('[Wallet] Installed wallets:', installedWallets.map(w => w.adapter.name));
    }
  }, [wallets, installedWallets]);

  // Handle wallet connection
  const handleConnect = useCallback(async () => {
    if (!isMounted) return false;
    
    try {
      setIsConnecting(true);
      
      // If no wallets are detected, guide user to install one
      if (!hasInstalledWallets) {
        toast({
          title: 'No Wallet Detected',
          description: (
            <div className="flex flex-col gap-2">
              <p>Please install a Solana wallet to continue:</p>
              <div className="flex gap-2 mt-2">
                <a 
                  href="https://phantom.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Install Phantom
                </a>
                <span>•</span>
                <a 
                  href="https://solflare.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Install Solflare
                </a>
              </div>
            </div>
          ),
          variant: 'default',
        });
        return false;
      }
      
      // Try to find and click the wallet modal button
      if (typeof document !== 'undefined') {
        // Find the wallet modal button and click it to show the modal
        const walletModalButton = document.querySelector('.wallet-adapter-button-trigger');
        if (walletModalButton) {
          (walletModalButton as HTMLElement).click();
          return true;
        }
        
        // If we can't find the button, try to show the modal directly
        const walletModal = document.querySelector('.wallet-adapter-modal-wrapper');
        if (walletModal) {
          (walletModal as HTMLElement).style.display = 'flex';
          return true;
        }
      }
      
      // If we couldn't trigger the modal programmatically, try connecting directly
      if (installedWallets.length > 0) {
        // Try to connect with the first available wallet
        await connect();
        return true;
      }
      
      throw new Error('No wallets available. Please install a Solana wallet extension.');
      
    } catch (error) {
      console.error('Error during wallet connection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Only show error if it's not a user cancellation
      if (!errorMessage.includes('User rejected') && 
          !errorMessage.includes('User cancelled') && 
          !errorMessage.includes('Wallet not found') &&
          !errorMessage.includes('No wallet found')) {
        toast({
          title: 'Connection Error',
          description: 'Failed to connect wallet. Please try again or install a wallet.',
          variant: 'destructive',
        });
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [connect, select, toast, isMounted, isPhantomInstalled, phantomWallet, wallets, isMobile]);

  // Handle wallet disconnection
  const handleDisconnect = useCallback(async () => {
    try {
      if (disconnect) {
        await disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      if (toast) {
        toast({
          title: 'Disconnect Error',
          description: 'Failed to disconnect wallet. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [disconnect, toast]);

  // Show loading placeholder during hydration
  if (!isMounted) {
    return (
      <button 
        className={cn(
          'inline-flex items-center justify-center',
          'h-10 px-4 py-2',
          'bg-primary text-primary-foreground',
          'rounded-md text-sm font-medium',
          'opacity-50 cursor-not-allowed',
          className
        )}
        disabled
      >
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <div className={cn('wallet-adapter-wrapper flex items-center h-full', className)}>
      <button
        onClick={connected ? handleDisconnect : () => handleConnect()}
        disabled={connecting || isConnecting}
        className={cn(
          'bg-black dark:bg-white',
          'text-white dark:text-black',
          'h-10 px-4',
          'rounded-lg',
          'font-medium text-sm',
          'inline-flex items-center justify-center',
          'hover:bg-gray-900 dark:hover:bg-gray-100',
          'active:scale-[0.98]',
          'transition-all duration-200',
          'border border-black/10 dark:border-white/10',
          'shadow-sm',
          'm-0',
          'w-full',
          'relative',
          'overflow-hidden',
          className
        )}
      >
        {(connecting || isConnecting) ? (
          <span className="flex items-center gap-2 text-xs">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Connecting...</span>
          </span>
        ) : publicKey && connected ? (
          <span className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm">
            <Wallet className="h-3.5 w-3.5" />
            <span>Connect Wallet</span>
          </span>
        )}
      </button>
    </div>
  );
}
