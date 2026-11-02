'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { ArrowLeftRight, RefreshCw, Wallet as WalletIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import JupiterSwapComponent from './JupiterSwap';

// Import JupiterTerminal with no SSR
const JupiterTerminal = dynamic(
  () => import('./JupiterTerminal').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Types
type Tab = 'swap' | 'stake';

interface BuyPanelProps {
  onClose: () => void;
  defaultTab?: Tab;
}

const JupiterSwap: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  return <JupiterSwapComponent onSuccess={onSuccess} />;
};

export default function BuyPanel({ onClose, defaultTab = 'swap' }: BuyPanelProps) {
  const { publicKey, wallet, connect, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = useCallback(async () => {
    if (wallet && !connected) {
      setIsProcessing(true);
      try {
        await connect();
        toast.success('Wallet connected successfully');
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast.error('Failed to connect wallet');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [wallet, connected, connect]);

  const handleDisconnect = useCallback(async () => {
    if (wallet && connected) {
      setIsProcessing(true);
      try {
        await disconnect();
        toast.success('Wallet disconnected');
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
        toast.error('Failed to disconnect wallet');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [wallet, connected, disconnect]);

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'stake':
        return <JupiterSwapComponent onSuccess={onClose} />;
      case 'swap':
        return <JupiterSwapComponent onSuccess={onClose} />;
      default:
        return null;
    }
  }, [activeTab, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">
            {activeTab === 'swap' ? 'Swap' : 'Stake'} ANTS
          </h2>
          <div className="flex items-center space-x-3">
            {/* Wallet Connection */}
            <div className="relative">
              {!connected ? (
                <button
                  onClick={handleConnect}
                  disabled={isProcessing}
                  className={`text-sm ${
                    isProcessing ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white px-4 py-1.5 rounded-md transition-colors flex items-center`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <WalletIcon className="mr-1.5 h-3.5 w-3.5" />
                      Connect Wallet
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleDisconnect}
                  disabled={isProcessing}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md transition-colors flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <WalletIcon className="mr-1.5 h-3.5 w-3.5" />
                      Disconnect
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('swap')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'swap'
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Swap
          </button>
          <button
            onClick={() => setActiveTab('stake')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'stake'
                ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Stake
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {tabContent}
        </div>
      </motion.div>
    </div>
  );
}
