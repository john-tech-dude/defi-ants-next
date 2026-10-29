'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PublicKey, type Connection, type Commitment } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

type UseJupiterWalletReturn = {
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
  
  // For UI components
  status: 'connected' | 'disconnected' | 'connecting' | 'disconnecting';
  
  // For backward compatibility
  connecting: boolean;
  connected: boolean;
  handleConnect: () => Promise<void>;
};

// Default connection settings
const DEFAULT_COMMITMENT: Commitment = 'confirmed';

export function useJupiterWallet(): UseJupiterWalletReturn {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  // Provide default values when wallet context is not available
  const {
    publicKey = null,
    connected = false,
    connecting = false,
    disconnecting: isDisconnecting = false,
    connect: walletConnect = async () => { throw new Error('Wallet not connected') },
    disconnect: walletDisconnect = async () => {},
    select = () => {},
    sendTransaction = async () => { throw new Error('Wallet not connected') },
    signTransaction = undefined,
    signAllTransactions = undefined,
    signMessage = undefined,
  } = wallet || {};
  
  const walletAddress = useMemo(() => publicKey?.toBase58() || null, [publicKey]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Get wallet name if available
  const walletName = useMemo(() => {
    return wallet?.adapter?.name || 'Unknown Wallet';
  }, [wallet]);
  
  // Determine connection status
  const status = useMemo(() => {
    if (connecting) return 'connecting';
    if (isDisconnecting) return 'disconnecting';
    return connected ? 'connected' : 'disconnected';
  }, [connected, connecting, isDisconnecting]);
  
  // Set isMounted to true on component mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Format wallet address for display
  const formatAddress = useCallback((address: string | PublicKey, start = 4, end = 4): string => {
    const addr = typeof address === 'string' ? address : address?.toBase58();
    if (!addr) return '';
    return `${addr.slice(0, start)}...${addr.slice(-end)}`;
  }, []);
  
  // Get wallet balance
  const getBalance = useCallback(async (): Promise<number> => {
    if (!publicKey || !connection) return 0;
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }, [publicKey, connection]);
  
  // Get connection instance
  const getConnection = useCallback((): Connection => {
    return connection;
  }, [connection]);
  
  // Connect wallet handler
  const connect = useCallback(async (): Promise<void> => {
    try {
      if (!connected && walletConnect) {
        await walletConnect();
        toast.success('Wallet connected successfully');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
      throw error;
    }
  }, [connected, walletConnect]);
  
  // Disconnect wallet handler
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      if (connected && walletDisconnect) {
        await walletDisconnect();
        toast.info('Wallet disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
      throw error;
    }
  }, [connected, walletDisconnect]);
  
  // Alias for connect for backward compatibility
  const handleConnect = useCallback(async (): Promise<void> => {
    await connect();
  }, [connect]);
  
  return {
    // Connection state
    isConnected: connected,
    isConnecting: connecting,
    isDisconnecting: isDisconnecting,
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
    
    // For UI components
    status,
    
    // For backward compatibility
    connecting,
    connected,
    handleConnect,
  };
}
