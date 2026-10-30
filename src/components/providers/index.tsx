'use client';

import { ReactNode, useEffect, useState, useMemo } from 'react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ClientProvider } from '@/contexts/ClientContext';
import { WalletProvider } from './WalletProvider';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root provider component that wraps the application with all necessary providers.
 */
export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork || WalletAdapterNetwork.Devnet;
  
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network);
  }, [network]);

  // Only render UI after mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);

    // Suppress known browser extension errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      // Filter out Phantom wallet extension errors
      if (
        message.includes('Unable to set window.solana') ||
        message.includes('ojbcfhjmpigfobfclfflafhblgemeidi') ||
        message.includes('chrome-extension')
      ) {
        return; // Suppress these errors
      }
      originalError.apply(console, args);
    };

    return () => {
      setMounted(false);
      console.error = originalError;
    };
  }, []);

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme
      themes={['light', 'dark']}
    >
      <TooltipProvider>
        <ClientProvider>
          <ConnectionProvider endpoint={endpoint}>
            <ErrorBoundary>
              <WalletProvider>
                {children}
              </WalletProvider>
            </ErrorBoundary>
          </ConnectionProvider>
        </ClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
