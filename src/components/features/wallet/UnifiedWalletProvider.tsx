'use client';

import { useMemo, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { UnifiedWalletProvider as JupiterUnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import { WalletAdapterNetwork, WalletName, Adapter } from '@solana/wallet-adapter-base';
import { IUnifiedTheme } from '@jup-ag/wallet-adapter/dist/types/contexts/UnifiedWalletContext';
import { AllLanguage } from '@jup-ag/wallet-adapter/dist/types/contexts/TranslationProvider/i18n';
import { Cluster } from '@solana/web3.js';
import { envVars } from '@/env';
import useToast from '@/components/ui/use-toast';

// Types from @jup-ag/wallet-adapter
interface IWalletNotification {
  publicKey: string;
  shortAddress: string;
  walletName: string;
  metadata: {
    name: string;
    url: string;
    icon: string;
  };
}

interface IUnifiedWalletConfig {
  autoConnect: boolean;
  env: Cluster;
  metadata: {
    name: string;
    description: string;
    url: string;
    iconUrls: string[];
  };
  walletPrecedence?: WalletName[];
  notificationCallback?: {
    onConnect: (props: IWalletNotification) => void;
    onConnecting: (props: IWalletNotification) => void;
    onDisconnect: (props: IWalletNotification) => void;
    onNotInstalled: (props: IWalletNotification) => void;
  };
  walletlistExplanation?: {
    href: string;
  };
  theme?: IUnifiedTheme;
  lang?: AllLanguage;
}

interface UnifiedWalletProviderProps {
  children: React.ReactNode;
  wallets: Adapter[];
}

export function UnifiedWalletProvider({ children, wallets }: UnifiedWalletProviderProps) {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  
  // Only mount on client-side to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    
    // Add error handling for wallet extension errors
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Cannot read properties of null') && 
          event.filename?.includes('inpage.js')) {
        console.warn('Intercepted wallet extension error:', event.message);
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      return false;
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  const config = useMemo<IUnifiedWalletConfig>(() => {
    const env = envVars.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'mainnet-beta' as Cluster : 'devnet' as Cluster;
    
    return {
      autoConnect: true,
      env,
      metadata: {
        name: 'DeFi ANT',
        description: 'DeFi ANT - The Next Generation of DeFi',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://defiant.xyz',
        iconUrls: ['/images/logos/logo.png'],
      },
      walletPrecedence: [
        'Phantom' as WalletName,
        'Solflare' as WalletName,
        'Coinbase Wallet' as WalletName,
        'Brave' as WalletName,
        'Glow' as WalletName,
        'Torus' as WalletName,
        'Ledger' as WalletName
      ],
      notificationCallback: {
        onConnect: (props) => {
          toast({
            title: 'Wallet Connected',
            description: `Connected with ${props.walletName}`,
          });
        },
        onConnecting: (props) => {
          console.log(`Connecting to ${props.walletName}...`);
        },
        onDisconnect: (props) => {
          toast({
            title: 'Wallet Disconnected',
            description: `Disconnected from ${props.walletName}`,
          });
        },
        onNotInstalled: (props) => {
          toast({
            title: 'Wallet Not Installed',
            description: `${props.walletName} is not installed. Please install it to continue.`,
            variant: 'destructive',
          });
        },
      },
      walletlistExplanation: {
        href: 'https://docs.jup.ag/wallet-adapter/wallet-list',
      },
      theme: 'jupiter',
      lang: 'en',
    };
  }, [toast]);

  // Don't render wallet provider until client-side mounted
  if (!isMounted) {
    return <>{children}</>;
  }
  
  // Wrap the provider in error boundary
  return (
    <ErrorBoundary 
      fallback={
        <div className="p-4 text-red-500">
          Error initializing wallet provider. Please refresh the page.
        </div>
      }
    >
      <JupiterUnifiedWalletProvider
        wallets={wallets}
        config={config}
      >
        {children}
      </JupiterUnifiedWalletProvider>
    </ErrorBoundary>
  );
}
