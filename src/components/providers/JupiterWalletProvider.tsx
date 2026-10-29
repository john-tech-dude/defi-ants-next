'use client';

import { ReactNode, useEffect, useState, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

// Import the default styles for the wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

type Cluster = 'mainnet-beta' | 'devnet' | 'testnet';

export function JupiterWalletProvider({ children }: WalletProviderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [network, setNetwork] = useState<WalletAdapterNetwork>(
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) ||
      WalletAdapterNetwork.Mainnet
  );

  // Ensure we're in the browser
  useEffect(() => setMounted(true), []);

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Initialize supported wallet adapters (Phantom only)
  const wallets = useMemo(
    () => {
      if (!mounted) return [];
      return [
        new PhantomWalletAdapter()
      ];
    },
    [network, mounted]
  );

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
