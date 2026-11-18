'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { X } from 'lucide-react';
import JupiterPlugin from './JupiterPlugin';
import { StakingTab } from '@/components/features/staking/StakingTab';
import { useNativeStake } from '@/hooks/useNativeStake';
import RWAYieldFarming from '@/components/features/staking/RWAYieldFarming';

// Types
type Tab = 'swap' | 'stake' | 'farm';

interface BuyPanelProps {
  onClose: () => void;
  defaultTab?: Tab;
}

export default function BuyPanel({ onClose, defaultTab = 'swap' }: BuyPanelProps) {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const nativeStake = useNativeStake();

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'stake':
        return (
          <StakingTab
            publicKey={publicKey?.toString()}
            onStake={nativeStake.stake}
            onUnstake={nativeStake.unstake}
            onClaim={nativeStake.withdraw}
            userBalance={Math.max(0, nativeStake.solBalance - 0.02)}
            stakedAmount={nativeStake.stakedSol}
            rewards={nativeStake.withdrawableSol}
            apy={7}
            totalStaked={nativeStake.stakedSol}
            error={nativeStake.error}
          />
        );
      case 'swap':
        return <JupiterPlugin onSuccess={onClose} />;
      case 'farm':
        return <RWAYieldFarming />;
      default:
        return null;
    }
  }, [activeTab, onClose, publicKey, nativeStake]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        className="relative w-full max-w-2xl mx-4 bg-gray-900 dark:bg-gray-900 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-800 dark:border-gray-800 border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-800 border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'swap' ? 'Swap SOL for USDC' : activeTab === 'stake' ? 'Stake SOL' : 'RWA Yield Farming'}
          </h2>
          <div className="flex items-center space-x-3">
            {/* Wallet Connection */}
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !text-sm !px-4 !py-1.5 !rounded-md transition-colors" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 dark:border-gray-800 border-gray-200">
          <button
            onClick={() => setActiveTab('swap')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'swap'
                ? 'bg-gray-800 dark:bg-gray-800 bg-amber-500 text-white border-b-2 border-blue-500 dark:border-blue-500 border-amber-600'
                : 'text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100'
            }`}
          >
            Swap
          </button>
          <button
            onClick={() => setActiveTab('stake')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'stake'
                ? 'bg-gray-800 dark:bg-gray-800 bg-amber-500 text-white border-b-2 border-blue-500 dark:border-blue-500 border-amber-600'
                : 'text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100'
            }`}
          >
            Stake
          </button>
          <button
            onClick={() => setActiveTab('farm')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'farm'
                ? 'bg-gray-800 dark:bg-gray-800 bg-amber-500 text-white border-b-2 border-blue-500 dark:border-blue-500 border-amber-600'
                : 'text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100'
            }`}
          >
            Farm
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {tabContent}
        </div>
      </motion.div>
    </div>
  );
}
