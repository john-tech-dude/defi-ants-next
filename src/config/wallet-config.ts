'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import type { Adapter } from '@solana/wallet-adapter-base';
import type { WalletConnectWalletAdapterConfig } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, type Cluster, type Commitment } from '@solana/web3.js';
import { envVars } from '../env';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Wallet adapter types for dynamic imports
type WalletAdapterModule = {
  default: new (config?: any) => Adapter;
} | (new (config?: any) => Adapter);

type WalletConfig = {
  name: string;
  import: () => Promise<WalletAdapterModule>;
  config?: Record<string, any>;
};

// Constants
export const DEFAULT_NETWORK = (envVars.NEXT_PUBLIC_SOLANA_NETWORK as Cluster) || 'devnet' as Cluster;
const DEFAULT_ENDPOINT = envVars.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(DEFAULT_NETWORK);

console.log('Wallet Config - Network:', DEFAULT_NETWORK);
console.log('Wallet Config - RPC Endpoint:', DEFAULT_ENDPOINT);

// Get wallet network from environment variables
export const getWalletNetwork = (): WalletAdapterNetwork => {
  if (!isBrowser) return WalletAdapterNetwork.Devnet;
  
  try {
    // Get network from env or default to devnet
    const network = (envVars.NEXT_PUBLIC_SOLANA_NETWORK?.toLowerCase() || 'devnet') as Cluster;
    
    // Check if network is mainnet or devnet
    const isMainnet = network === 'mainnet-beta';
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Wallet] Using Solana network: ${isMainnet ? 'mainnet-beta' : 'devnet'}`);
    }
    
    return isMainnet 
      ? WalletAdapterNetwork.Mainnet 
      : WalletAdapterNetwork.Devnet;
  } catch (error) {
    console.error('[Wallet] Error getting wallet network:', error);
    // Default to devnet on error
    return WalletAdapterNetwork.Devnet;
  }
};

// Get the current network as a Cluster type
export const getCluster = (): Cluster => {
  try {
    const network = envVars.NEXT_PUBLIC_SOLANA_NETWORK?.toLowerCase() || 'devnet';
    return network === 'mainnet-beta' ? 'mainnet-beta' : 'devnet';
  } catch (error) {
    console.error('Error getting cluster:', error);
    return 'devnet';
  }
};

// Get RPC endpoint
export const getEndpoint = (): string => {
  if (!isBrowser) return DEFAULT_ENDPOINT;
  
  try {
    // Use custom RPC URL if provided in environment variables
    if (envVars.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return envVars.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    
    // Otherwise, use the cluster URL based on the network
    const network = getWalletNetwork();
    const cluster = network === WalletAdapterNetwork.Mainnet ? 'mainnet-beta' : 'devnet';
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Wallet] Using Solana ${cluster} endpoint`);
    }
    
    return clusterApiUrl(cluster as Cluster);
  } catch (error) {
    console.error('[Wallet] Error getting RPC endpoint:', error);
    // Fallback to default endpoint
    return DEFAULT_ENDPOINT;
  }
};

// Get the commitment level for transactions
export const getCommitment = (): Commitment => {
  if (!isBrowser) return 'confirmed';
  
  try {
    // Default to 'confirmed' if no specific commitment level is set
    const commitment = 'confirmed';
    
    // In a production app, you might want to make this configurable via env vars
    // const commitment = (envVars.NEXT_PUBLIC_SOLANA_COMMITMENT || 'confirmed').toLowerCase();
    
    // Validate commitment level
    const validCommitments = ['processed', 'confirmed', 'finalized'] as const;
    if (!validCommitments.includes(commitment as any)) {
      console.warn(`[Wallet] Invalid commitment level: ${commitment}, using 'confirmed'`);
      return 'confirmed';
    }
    
    return commitment as Commitment;
  } catch (error) {
    console.error('[Wallet] Error getting commitment level:', error);
    return 'confirmed';
  }
};

// Wallet configurations with dynamic imports
const WALLET_CONFIGS: WalletConfig[] = [
  // Most popular wallets first
  {
    name: 'Phantom',
    import: () => import('@solana/wallet-adapter-phantom').then(m => m.PhantomWalletAdapter),
  },
  {
    name: 'Solflare',
    import: () => import('@solana/wallet-adapter-solflare').then(m => m.SolflareWalletAdapter),
  },
  {
    name: 'Backpack',
    import: () => import('@solana/wallet-adapter-backpack').then(m => m.BackpackWalletAdapter),
  },
  {
    name: 'Coinbase',
    import: () => import('@solana/wallet-adapter-coinbase').then(m => m.CoinbaseWalletAdapter),
    config: { appName: 'DeFi ANT' },
  },
  {
    name: 'Brave',
    import: () => import('@solana/wallet-adapter-brave').then(m => m.BraveWalletAdapter),
  },
  // Other wallets
  {
    name: 'Glow',
    import: () => import('@solana/wallet-adapter-glow').then(m => m.GlowWalletAdapter),
  },
  {
    name: 'Slope',
    import: () => import('@solana/wallet-adapter-slope').then(m => m.SlopeWalletAdapter),
  },
  {
    name: 'Ledger',
    import: () => import('@solana/wallet-adapter-ledger').then(m => m.LedgerWalletAdapter),
  },
  {
    name: 'Torus',
    import: () => import('@solana/wallet-adapter-torus').then(m => m.TorusWalletAdapter),
  },
  {
    name: 'Clover',
    import: () => import('@solana/wallet-adapter-clover').then(m => m.CloverWalletAdapter),
  },
  {
    name: 'SafePal',
    import: () => import('@solana/wallet-adapter-safepal').then(m => m.SafePalWalletAdapter),
  },
  {
    name: 'Solong',
    import: () => import('@solana/wallet-adapter-solong').then(m => m.SolongWalletAdapter),
  },
  {
    name: 'Trust',
    import: () => import('@solana/wallet-adapter-trust').then(m => m.TrustWalletAdapter),
  },
];

// Configure wallet adapters with proper error handling
export const getWalletAdapters = async (): Promise<Adapter[]> => {
  if (!isBrowser) return [];
  
  const adapters: Adapter[] = [];
  
  try {
    // Load wallet adapters dynamically
    for (const config of WALLET_CONFIGS) {
      try {
        // Skip if we're not in a browser environment
        if (!isBrowser) continue;
        
        // Check for wallet-specific detection logic
        const walletWindow = window as any;
        let walletDetected = true;
        
        // Check for specific wallet detection
        switch (config.name) {
          case 'Phantom':
            walletDetected = !!(walletWindow.phantom?.isPhantom || walletWindow.phantom?.sol?.isPhantom);
            break;
            
          case 'Solflare':
            walletDetected = !!walletWindow.solflare?.isSolflare;
            break;
            
          case 'Backpack':
            walletDetected = !!walletWindow.backpack;
            break;
            
          case 'Brave':
            walletDetected = !!walletWindow.phantom?.isBraveWallet;
            break;
            
          // Add more wallet detections as needed
        }
        
        // If wallet not detected and we're not in production, log it
        if (!walletDetected && process.env.NODE_ENV !== 'production') {
          console.log(`[Wallet] ${config.name} not detected in the browser`);
        }
        
        // Skip wallets that aren't detected in the browser
        if (!walletDetected) continue;
        
        // Import the wallet adapter
        const module = await config.import();
        const Adapter = 'default' in module ? module.default : module;
        
        // Initialize the adapter with config
        const adapter = new Adapter({
          ...(config.config || {}),
          network: getWalletNetwork(),
        });
        
        adapters.push(adapter);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[Wallet] Initialized wallet adapter: ${config.name}`);
        }
      } catch (error) {
        console.error(`[Wallet] Failed to initialize ${config.name} wallet:`, error);
      }
    }
    
    // Add WalletConnect adapter with proper configuration
    if (envVars.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
      try {
        const { WalletConnectWalletAdapter } = await import('@solana/wallet-adapter-wallets');
        
        // Explicitly cast network to the expected type
        const network = getWalletNetwork();
        const walletConnectNetwork = network === WalletAdapterNetwork.Mainnet 
          ? WalletAdapterNetwork.Mainnet 
          : WalletAdapterNetwork.Devnet;
          
        const walletConnectConfig: WalletConnectWalletAdapterConfig = {
          network: walletConnectNetwork,
          options: {
            relayUrl: 'wss://relay.walletconnect.com',
            projectId: envVars.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
            metadata: {
              name: 'DeFi ANT',
              description: 'DeFi ANT Staking Platform',
              url: 'https://defiant.so',
              icons: ['https://defiant.so/logo.png'],
            },
          },
        };
        
        adapters.push(new WalletConnectWalletAdapter(walletConnectConfig));
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('[Wallet] Initialized WalletConnect adapter');
        }
      } catch (error) {
        console.error('[Wallet] Failed to initialize WalletConnect adapter:', error);
      }
    } else {
      console.warn('ℹ️ WalletConnect project ID not found. Skipping WalletConnect initialization.');
    }
  } catch (error) {
    console.error('[Wallet] Error initializing wallet adapters:', error);
  }
  
  console.log(`✅ Successfully initialized ${adapters.length} wallet adapters`);
  return adapters;
};
