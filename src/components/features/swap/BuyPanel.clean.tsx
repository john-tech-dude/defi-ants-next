'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { ArrowLeftRight, CreditCard, Loader2, RefreshCw, Wallet as WalletIcon, X, Zap } from 'lucide-react';
import { toast } from 'sonner';

// Types
type Tab = 'stripe' | 'swap' | 'stake';

interface Rewards {
  sol: number;
  ant: number;
  usdc: number;
}

interface StakingData {
  stakedAmount: number;
  pendingRewards: Rewards;
  lifetimeRewards: Rewards;
  antBalance: number;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  currentApy: number;
}

interface AppState {
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  stakingData: StakingData;
  isProcessing: boolean;
}

interface JupiterSwapProps {
  onSuccess: () => void;
}

interface BuyPanelProps {
  onClose: () => void;
  defaultTab?: Tab;
}

// Mock components
const StripeCheckout: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => (
  <div className="p-4">
    <h3 className="text-lg font-medium mb-4">Buy ANTS with Card</h3>
    <p className="text-gray-400">Stripe checkout will be implemented here.</p>
  </div>
);

const StakingPanel: React.FC<{
  stakingData: StakingData;
  onStake: (amount: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaim: () => Promise<void>;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  currentApy: number;
}> = ({ stakingData, onStake, onUnstake, onClaim, isStaking, isUnstaking, isClaiming, currentApy }) => (
  <div className="p-4">
    <h3 className="text-lg font-medium mb-4">Stake ANTS</h3>
    <p className="text-gray-400">Staking panel will be implemented here.</p>
    <div className="mt-4">
      <p>Staked: {stakingData.stakedAmount} ANTS</p>
      <p>APY: {currentApy}%</p>
    </div>
  </div>
);

const JupiterSwap: React.FC<JupiterSwapProps> = ({ onSuccess }) => (
  <div className="p-4">
    <h3 className="text-lg font-medium mb-4">Swap Tokens</h3>
    <p className="text-gray-400">Jupiter swap will be implemented here.</p>
  </div>
);

// Tabs configuration
const TABS = [
  { id: 'stripe' as const, label: 'Buy with Card', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'swap' as const, label: 'Swap Tokens', icon: <ArrowLeftRight className="h-4 w-4" /> },
  { id: 'stake' as const, label: 'Stake ANTS', icon: <Zap className="h-4 w-4" /> },
];

export default function BuyPanel({ onClose, defaultTab = 'stripe' }: BuyPanelProps) {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const { connection } = useConnection();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  
  // Initialize state
  const [state, setState] = useState<AppState>({
    isStaking: false,
    isUnstaking: false,
    isClaiming: false,
    isProcessing: false,
    stakingData: {
      stakedAmount: 0,
      pendingRewards: { sol: 0, ant: 0, usdc: 0 },
      lifetimeRewards: { sol: 0, ant: 0, usdc: 0 },
      antBalance: 1000,
      isStaking: false,
      isUnstaking: false,
      isClaiming: false,
      currentApy: 15.5
    }
  });

  const { isProcessing, stakingData } = state;
  const { currentApy } = stakingData;

  // Helper to update state with type safety
  const updateState = useCallback(<K extends keyof AppState>(
    updates: Pick<AppState, K> | ((prev: AppState) => Pick<AppState, K>)
  ) => {
    setState(prev => ({
      ...prev,
      ...(typeof updates === 'function' ? updates(prev) : updates),
      stakingData: {
        ...prev.stakingData,
        ...(typeof updates === 'function' 
          ? (updates as (prev: AppState) => AppState)(prev).stakingData || {}
          : (updates as any).stakingData || {}
        )
      }
    }));
  }, []);

  // Handle wallet connection
  const handleConnect = useCallback(async () => {
    if (connected && publicKey) {
      console.log('[Wallet] Already connected to:', publicKey.toBase58());
      return true;
    }

    updateState({ isProcessing: true });

    try {
      await connect();
      toast.success('Wallet connected successfully');
      return true;
    } catch (error) {
      console.error('[Wallet] Connection error:', error);
      toast.error('Failed to connect wallet');
      return false;
    } finally {
      updateState({ isProcessing: false });
    }
  }, [connected, publicKey, connect, updateState]);

  // Handle wallet disconnection
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('[Wallet] Disconnection error:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnect]);

  // Handle stake action
  const handleStake = useCallback(async (amount: number) => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    updateState({ 
      isStaking: true,
      stakingData: { isStaking: true }
    });

    try {
      // Simulate staking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateState(prev => ({
        isStaking: false,
        stakingData: {
          ...prev.stakingData,
          stakedAmount: prev.stakingData.stakedAmount + amount,
          antBalance: prev.stakingData.antBalance - amount,
          isStaking: false
        }
      }));
      
      toast.success('Successfully staked ANTS tokens');
    } catch (error) {
      console.error('Staking error:', error);
      toast.error('Failed to stake tokens');
      updateState({
        isStaking: false,
        stakingData: { isStaking: false }
      });
    }
  }, [publicKey, updateState]);

  // Handle unstake action
  const handleUnstake = useCallback(async (amount: number) => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    updateState({
      isUnstaking: true,
      stakingData: { isUnstaking: true }
    });

    try {
      // Simulate unstaking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateState(prev => ({
        isUnstaking: false,
        stakingData: {
          ...prev.stakingData,
          stakedAmount: prev.stakingData.stakedAmount - amount,
          antBalance: prev.stakingData.antBalance + amount,
          isUnstaking: false
        }
      }));
      
      toast.success('Successfully unstaked ANTS tokens');
    } catch (error) {
      console.error('Unstaking error:', error);
      toast.error('Failed to unstake tokens');
      updateState({
        isUnstaking: false,
        stakingData: { isUnstaking: false }
      });
    }
  }, [publicKey, updateState]);

  // Handle claim rewards
  const handleClaim = useCallback(async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    updateState({
      isClaiming: true,
      stakingData: { isClaiming: true }
    });

    try {
      // Simulate claiming
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateState(prev => ({
        isClaiming: false,
        stakingData: {
          ...prev.stakingData,
          pendingRewards: { sol: 0, ant: 0, usdc: 0 },
          lifetimeRewards: {
            sol: prev.stakingData.lifetimeRewards.sol + prev.stakingData.pendingRewards.sol,
            ant: prev.stakingData.lifetimeRewards.ant + prev.stakingData.pendingRewards.ant,
            usdc: prev.stakingData.lifetimeRewards.usdc + prev.stakingData.pendingRewards.usdc,
          },
          isClaiming: false
        }
      }));
      
      toast.success('Successfully claimed rewards');
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Failed to claim rewards');
      updateState({
        isClaiming: false,
        stakingData: { isClaiming: false }
      });
    }
  }, [publicKey, updateState]);

  // Handle tab change
  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'stake':
        return (
          <StakingPanel
            stakingData={stakingData}
            onStake={handleStake}
            onUnstake={handleUnstake}
            onClaim={handleClaim}
            isStaking={state.isStaking}
            isUnstaking={state.isUnstaking}
            isClaiming={state.isClaiming}
            currentApy={currentApy}
          />
        );
      case 'swap':
        return <JupiterSwap onSuccess={onClose} />;
      case 'stripe':
        return <StripeCheckout onSuccess={onClose} />;
      default:
        return null;
    }
  }, [activeTab, stakingData, state, handleStake, handleUnstake, handleClaim, currentApy, onClose]);

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
            {activeTab === 'stripe' ? 'Buy with Card' : 'Stake'} ANTS
          </h2>
          <div className="flex items-center space-x-3">
            {/* Wallet Connection */}
            {!connected ? (
              <button
                onClick={handleConnect}
                disabled={isProcessing}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors flex items-center"
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-400">
                  {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                </span>
                <button
                  onClick={handleDisconnect}
                  className="p-1.5 rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="Disconnect wallet"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
