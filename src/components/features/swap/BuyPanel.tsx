'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { X } from 'lucide-react';
import JupiterSwapComponent from './JupiterSwap';

// Types
type Tab = 'swap' | 'stake';

interface BuyPanelProps {
  onClose: () => void;
  defaultTab?: Tab;
}

export default function BuyPanel({ onClose, defaultTab = 'swap' }: BuyPanelProps) {
  const { publicKey, wallet, connect, connected, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

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
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !text-sm !px-4 !py-1.5 !rounded-md transition-colors" />

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
