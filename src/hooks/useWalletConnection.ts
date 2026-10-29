'use client';

import { useCallback } from 'react';
import { PublicKey, type Connection } from '@solana/web3.js';
import { useJupiterWallet } from './useJupiterWallet';

type UseWalletConnectionReturn = {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  walletAddress: string | null;
  publicKey: PublicKey | null;
  walletName: string;
  
  // Connection methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Utility methods
  formatAddress: (address: string | PublicKey, start?: number, end?: number) => string;
  getBalance: () => Promise<number>;
  getConnection: () => Connection;
  
  // Status
  status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting';
  
  // For backward compatibility
  connecting: boolean;
  connected: boolean;
  handleConnect: () => Promise<void>;
};

export function useWalletConnection(): UseWalletConnectionReturn {
  // Use the Jupiter wallet hook which provides the same interface
  const wallet = useJupiterWallet();
  
  // Provide default values when wallet context is not available
  const {
    isConnected = false,
    isConnecting = false,
    isDisconnecting = false,
    walletAddress = null,
    publicKey = null,
    walletName = 'Not Connected',
    connect = async () => {},
    disconnect = async () => {},
    formatAddress = (address: string | PublicKey, start = 4, end = 4) => {
      const addr = typeof address === 'string' ? address : address?.toBase58() || '';
      return `${addr.slice(0, start)}...${addr.slice(-end)}`;
    },
    getBalance = async () => 0,
    getConnection = () => ({} as Connection),
    status = 'disconnected',
    connected = false,
    connecting = false,
    handleConnect = async () => {},
  } = wallet || {};
  
  // For backward compatibility
  return {
    // Connection state
    isConnected,
    isConnecting,
    isDisconnecting,
    walletAddress,
    publicKey,
    walletName,
    
    // Connection methods
    connect,
    disconnect,
    
    // Utility methods
    formatAddress,
    getBalance,
    getConnection,
    
    // Status
    status,
    
    // For backward compatibility
    connecting,
    connected,
    handleConnect,
  };
}
