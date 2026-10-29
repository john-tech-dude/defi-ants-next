'use client';

import { ReactNode, useMemo, useEffect, useState, useCallback } from 'react';
import { 
  ConnectionProvider, 
  WalletProvider as SolanaWalletProvider
} from '@solana/wallet-adapter-react';
import type { WalletError as WalletErrorType } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork, WalletAdapter } from '@solana/wallet-adapter-base';
import { 
  safeWalletInitialization, 
  handleWalletError,
  isMobile 
} from '@/lib/utils/extensionUtils';
import { clusterApiUrl } from '@solana/web3.js';
import { toast } from 'sonner';

// Import the default styles for the wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

declare global {
  interface Window {
    solana?: any;
    phantom?: {
      sol?: {
        isPhantom?: boolean;
      };
    };
    ethereum?: any;
  }
}

// Phantom wallet workaround
declare global {
  interface Window {
    solana?: any;
    phantom?: {
      sol?: {
        isPhantom?: boolean;
      };
    };
  }
}

interface WalletProviderProps {
  children: ReactNode;
}

type WalletAdapterConstructor = new (config?: any) => WalletAdapter;

interface WalletAdapterInfo {
  name: string;
  package: string;
  adapter: WalletAdapterConstructor;
  requiresNetwork?: boolean;
  mobileCompatible?: boolean;
}

// List of wallet adapters with their metadata
const getWalletAdapters = (): WalletAdapterInfo[] => {
  // Skip if we're not in a browser environment
  if (typeof window === 'undefined') {
    return [];
  }

  // Check if we should exclude MetaMask
  const isMetaMaskInstalled = typeof window.ethereum?.isMetaMask === 'boolean';
  
  // Only include wallets that are compatible with the current environment
  return [
  {
    name: 'Phantom',
    package: '@solana/wallet-adapter-phantom',
    adapter: require('@solana/wallet-adapter-phantom').PhantomWalletAdapter,
    mobileCompatible: true
  },
  {
    name: 'Solflare',
    package: '@solana/wallet-adapter-solflare',
    adapter: require('@solana/wallet-adapter-solflare').SolflareWalletAdapter,
    requiresNetwork: true,
    mobileCompatible: true
  },
  {
    name: 'Coinbase',
    package: '@solana/wallet-adapter-coinbase',
    adapter: require('@solana/wallet-adapter-coinbase').CoinbaseWalletAdapter,
    mobileCompatible: true
  },
  {
    name: 'Backpack',
    package: '@solana/wallet-adapter-backpack',
    adapter: require('@solana/wallet-adapter-backpack').BackpackWalletAdapter,
    mobileCompatible: true
  },
  {
    name: 'Brave',
    package: '@solana/wallet-adapter-brave',
    adapter: require('@solana/wallet-adapter-brave').BraveWalletAdapter
  },
  {
    name: 'Glow',
    package: '@solana/wallet-adapter-glow',
    adapter: require('@solana/wallet-adapter-glow').GlowWalletAdapter,
    requiresNetwork: true
  },
  {
    name: 'Sollet',
    package: '@solana/wallet-adapter-sollet',
    adapter: require('@solana/wallet-adapter-sollet').SolletWalletAdapter,
    requiresNetwork: true
  },
  {
    name: 'Torus',
    package: '@solana/wallet-adapter-torus',
    adapter: require('@solana/wallet-adapter-torus').TorusWalletAdapter,
    requiresNetwork: true
  },
  {
    name: 'Trust',
    package: '@solana/wallet-adapter-trust',
    adapter: require('@solana/wallet-adapter-trust').TrustWalletAdapter,
    requiresNetwork: true
  },
  {
    name: 'Ledger',
    package: '@solana/wallet-adapter-ledger',
    adapter: require('@solana/wallet-adapter-ledger').LedgerWalletAdapter,
    mobileCompatible: false
  }
  ].filter(wallet => {
    // Filter out MetaMask if it's installed to prevent conflicts
    if (isMetaMaskInstalled && wallet.name.toLowerCase().includes('metamask')) {
      console.log('Skipping MetaMask wallet adapter to prevent conflicts');
      return false;
    }
    return true;
  });
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Set isClient to true on mount to ensure we're in the browser
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsClient(true);
        // Small delay to ensure all wallet extensions are loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize wallet provider:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing wallet'));
      }
    };
    
    initialize();
  }, []);
  
  // Show error boundary if initialization fails
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-bold">Wallet Connection Error</h3>
        <p>{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reload Page
        </button>
      </div>
    );
  }
  const [mounted, setMounted] = useState(false);
  const [wallets, setWallets] = useState<WalletAdapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Only render on client side to prevent SSR issues
  // Handle Phantom wallet initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only initialize once
    if ((window as any).__phantomInitialized) return;
    (window as any).__phantomInitialized = true;

    // Create a safe proxy for window.solana
    const setupPhantomProxy = () => {
      try {
        if (!window.solana) return;
        
        // Store original solana object
        if (!(window as any).__phantomSolanaOriginal) {
          (window as any).__phantomSolanaOriginal = window.solana;
        }

        // Create a proxy to handle property access safely
        window.solana = new Proxy((window as any).__phantomSolanaOriginal, {
          get(target, prop) {
            try {
              return target[prop];
            } catch (error) {
              console.warn(`Error accessing window.solana.${String(prop)}:`, error);
              return undefined;
            }
          },
          set(target, prop, value) {
            console.warn(`Prevented setting window.solana.${String(prop)}`);
            return true; // Prevent setting properties
          }
        });
      } catch (error) {
        console.warn('Error setting up Phantom wallet proxy:', error);
      }
    };

    // Set up error handlers
    const handleError = (event: ErrorEvent) => {
      if (event.filename?.includes('inpage.js') || 
          event.filename?.includes('extension') ||
          event.message?.includes('window.solana') ||
          event.message?.includes('Phantom')) {
        event.preventDefault();
        event.stopPropagation();
        console.debug('Suppressed extension error:', event.error);
        return true;
      }
      return false;
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Phantom') || 
          event.reason?.message?.includes('solana') ||
          event.reason?.message?.includes('wallet')) {
        event.preventDefault();
        console.debug('Suppressed wallet rejection:', event.reason);
        return true;
      }
      return false;
    };

    // Set up the proxy and error handlers
    setupPhantomProxy();
    window.addEventListener('error', handleError as EventListener);
    window.addEventListener('unhandledrejection', handleRejection as any);

    // Clean up
    return () => {
      window.removeEventListener('error', handleError as EventListener);
      window.removeEventListener('unhandledrejection', handleRejection as any);
    };
  }, []);

  // Set up the rest of the wallet provider
  useEffect(() => {
    setMounted(true);
    safeWalletInitialization();
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

  // Load wallet adapters dynamically
  const loadWalletAdapters = useCallback(async () => {
    if (!mounted) return [];

    setIsLoading(true);
    const mobile = isMobile();
    const adapters: WalletAdapter[] = [];
    let walletAdapters = getWalletAdapters();

    // Skip Phantom on mobile or if there are conflicts
    const skipPhantom = mobile ||
      (typeof window !== 'undefined' &&
       window.phantom?.sol?.isPhantom &&
       !window.solana?.isPhantom);

    // Filter out Phantom if needed
    if (skipPhantom) {
      walletAdapters = walletAdapters.filter(w => w.name !== 'Phantom');
      console.debug('Skipping Phantom wallet due to conflict or mobile');
    }

    try {
      const seenNames = new Set<string>();
      for (const wallet of walletAdapters) {
        // Skip mobile-incompatible wallets on mobile
        if (mobile && wallet.mobileCompatible === false) {
          console.debug(`Skipping ${wallet.name} on mobile`);
          continue;
        }

        // Skip if we've already seen this wallet name (deduplication)
        if (seenNames.has(wallet.name)) {
          console.debug(`Skipping duplicate wallet: ${wallet.name}`);
          continue;
        }
        seenNames.add(wallet.name);

        try {
          // Dynamically import the adapter
          const Adapter = wallet.adapter;

          // Create adapter with appropriate config
          const config: any = {};
          if (wallet.requiresNetwork) {
            config.network = network;
          }

          // Special case for Coinbase
          if (wallet.name === 'Coinbase') {
            config.appName = 'DeFi ANTS';
            config.appLogo = '/logo.png';
            config.darkMode = true;
          }

          // Special case for Torus
          if (wallet.name === 'Torus') {
            // @ts-ignore - Torus types are incorrect
            config.params = {
              network,
              clientId: 'DeFi-ANTS',
            };
          }

          const adapter = new Adapter(config);
          adapters.push(adapter);
          console.debug(`Successfully loaded ${wallet.name} adapter`);

        } catch (error) {
          console.warn(`Failed to initialize ${wallet.name} wallet adapter:`, error);
        }
      }

      console.log('Successfully initialized wallet adapters:', adapters.map(a => a?.name || 'unknown'));
      return adapters;
    } catch (error) {
      console.error('Error initializing wallet adapters:', error);
      toast.error('Failed to initialize wallet adapters');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [mounted, network]);
  
  // Initialize wallets when mounted or network changes
  useEffect(() => {
    if (!mounted) return;
    
    const initWallets = async () => {
      const loadedWallets = await loadWalletAdapters();
      setWallets(loadedWallets);
    };
    
    initWallets();
  }, [mounted, loadWalletAdapters]);

  // Handle wallet errors with proper typing
  const onError = useCallback((error: WalletErrorType) => {
    const errorMessage = handleWalletError(error);
    
    if (errorMessage) {
      toast.error(errorMessage, {
        duration: 5000,
        id: 'wallet-error', // Prevent duplicate toasts
      });
    }
  }, []);

  // Don't render on server side
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Show loading state while wallets are being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading wallet providers...</p>
        </div>
      </div>
    );
  }

  return (
    <SolanaWalletProvider 
      wallets={wallets} 
      onError={onError}
      autoConnect={false}
    >
      <WalletModalProvider>
        <style jsx global>{
          `.wallet-adapter-modal-wrapper {
            z-index: 1000 !important;
          }
          .wallet-adapter-modal-overlay {
            background-color: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(4px) !important;
          }
          .wallet-adapter-modal-container {
            border-radius: 12px !important;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1) !important;
          }`
        }</style>
        {children}
      </WalletModalProvider>
    </SolanaWalletProvider>
  );
}
