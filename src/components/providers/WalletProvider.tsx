'use client';

import { ReactNode, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { toast } from 'sonner';

// Import wallet adapters directly
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { BraveWalletAdapter } from '@solana/wallet-adapter-brave';
import { GlowWalletAdapter } from '@solana/wallet-adapter-glow';
import { TrustWalletAdapter } from '@solana/wallet-adapter-trust';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';

// Import the default styles for the wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Only render on client side to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = useMemo(() => {
    const envNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;
    return envNetwork || WalletAdapterNetwork.Devnet;
  }, []);

  // RPC endpoint with proper network fallback
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    return clusterApiUrl(network === WalletAdapterNetwork.Mainnet ? 'mainnet-beta' : 'devnet');
  }, [network]);

  // Wallet adapters - standard setup
  const wallets = useMemo(() => {
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new CoinbaseWalletAdapter(),
      new BackpackWalletAdapter(),
      new BraveWalletAdapter(),
      new GlowWalletAdapter({ network }),
      new TrustWalletAdapter(),
      new LedgerWalletAdapter(),
    ];
  }, [network]);

  // Handle wallet errors
  const onError = (error: any) => {
    console.error('Wallet error:', error);
    const errorMessage = error?.message || 'Failed to connect wallet';
    toast.error(errorMessage);
  };

  // Don't render on server side
  if (!mounted) {
    return null;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={false}
      >
        <WalletModalProvider>
          <style jsx global>{`
            .wallet-adapter-modal-wrapper {
              z-index: 1000 !important;
            }
            .wallet-adapter-modal-overlay {
              background-color: rgba(0, 0, 0, 0.5) !important;
              backdrop-filter: blur(4px) !important;
            }
            .wallet-adapter-modal-container {
              border-radius: 12px !important;
              box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1) !important;
            }
            /* Hide the 'Detected' header to show all wallets in one section */
            .wallet-adapter-modal-title-detect {
              display: none !important;
            }
            /* Remove separator between detected and undetected wallets */
            .wallet-adapter-modal-list-section + .wallet-adapter-modal-list-section {
              margin-top: 0 !important;
              padding-top: 0 !important;
              border-top: none !important;
            }
            /* Hide the 'Less options' button */
            .wallet-adapter-modal-list-more-button {
              display: none !important;
            }
          `}</style>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
