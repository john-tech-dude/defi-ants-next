'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { ArrowLeftRight, CreditCard, Loader2, RefreshCw, Wallet as WalletIcon, X, Zap } from 'lucide-react';
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
  stakingPeriod: number;
  lastStakeTime: number;
  isStaking?: boolean;
  isUnstaking?: boolean;
  isClaiming?: boolean;
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



const StakingPanel: React.FC<{
  stakingData: StakingData;
  onStake: (amount: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaim: () => Promise<void>;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  currentApy: number;
}> = ({ stakingData, onStake, onUnstake, onClaim, isStaking, isUnstaking, isClaiming, currentApy }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const { connected } = useWallet();

  const handleStake = async () => {
    if (!stakeAmount || isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount to stake');
      return;
    }
    await onStake(Number(stakeAmount));
    setStakeAmount('');
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || isNaN(Number(unstakeAmount)) || Number(unstakeAmount) <= 0) {
      toast.error('Please enter a valid amount to unstake');
      return;
    }
    if (Number(unstakeAmount) > stakingData.stakedAmount) {
      toast.error('Cannot unstake more than your staked amount');
      return;
    }
    await onUnstake(Number(unstakeAmount));
    setUnstakeAmount('');
  };

  return (
    <div className="space-y-6 p-4">
      {/* Staking Card */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Stake ANTS</h3>
        
        {/* Staking Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Amount to Stake</label>
            <span className="text-xs text-gray-400">Balance: {stakingData.antBalance.toLocaleString()} ANTS</span>
          </div>
          <div className="flex">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!connected}
            />
            <button
              onClick={() => setStakeAmount(stakingData.antBalance.toString())}
              className="bg-gray-600 hover:bg-gray-500 px-3 text-sm font-medium transition-colors"
              disabled={!connected}
            >
              MAX
            </button>
          </div>
          <button
            onClick={handleStake}
            disabled={!connected || isStaking || !stakeAmount}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStaking ? 'Staking...' : 'Stake ANTS'}
          </button>
        </div>

        {/* Unstaking Input */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Amount to Unstake</label>
            <span className="text-xs text-gray-400">Staked: {stakingData.stakedAmount.toLocaleString()} ANTS</span>
          </div>
          <div className="flex">
            <input
              type="number"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!connected || stakingData.stakedAmount === 0}
            />
            <button
              onClick={() => setUnstakeAmount(stakingData.stakedAmount.toString())}
              className="bg-gray-600 hover:bg-gray-500 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!connected || stakingData.stakedAmount === 0}
            >
              MAX
            </button>
          </div>
          <button
            onClick={handleUnstake}
            disabled={!connected || isUnstaking || !unstakeAmount || stakingData.stakedAmount === 0}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUnstaking ? 'Unstaking...' : 'Unstake ANTS'}
          </button>
        </div>
      </div>

      {/* Rewards Card */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Rewards</h3>
          <div className="text-sm bg-primary-900/30 text-primary-400 px-3 py-1 rounded-full">
            APY: {currentApy}%
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Pending SOL:</span>
            <span className="font-medium">{stakingData.pendingRewards.sol.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pending ANTS:</span>
            <span className="font-medium">{stakingData.pendingRewards.ant.toFixed(2)} ANTS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pending USDC:</span>
            <span className="font-medium">${stakingData.pendingRewards.usdc.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onClaim}
          disabled={!connected || isClaiming || 
            (stakingData.pendingRewards.sol === 0 && 
             stakingData.pendingRewards.ant === 0 && 
             stakingData.pendingRewards.usdc === 0)}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isClaiming ? 'Claiming...' : 'Claim All Rewards'}
        </button>
      </div>

      {!connected && (
        <div className="text-center py-4 text-yellow-400">
          <WalletIcon className="h-6 w-6 mx-auto mb-2" />
          <p>Connect your wallet to start staking</p>
        </div>
      )}
    </div>
  );
};

const JupiterSwap: React.FC<JupiterSwapProps> = ({ onSuccess }) => {
  // Default to SOL as input and project token as output
  const inputMint = 'So11111111111111111111111111111111111111112'; // SOL
  const outputMint = process.env.NEXT_PUBLIC_TOKEN_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Project token or USDC
  
  return (
    <JupiterSwapComponent 
      onSuccess={onSuccess} 
      inputMint={inputMint}
      outputMint={outputMint}
      fixedInputMint={false}
      fixedOutputMint={false}
    />
  );
};

// Tabs configuration
const TABS = [

  { id: 'swap' as const, label: 'Swap Tokens', icon: <ArrowLeftRight className="h-4 w-4" /> },
  { id: 'stake' as const, label: 'Stake ANTS', icon: <Zap className="h-4 w-4" /> },
];

export default function BuyPanel({ onClose, defaultTab = 'swap' }: BuyPanelProps) {
  const { publicKey, connected, connect, disconnect, wallet, select, wallets } = useWallet();
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
      stakingPeriod: 0,
      lastStakeTime: 0,
      isStaking: false,
      isUnstaking: false,
      isClaiming: false,
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

    try {
      updateState({ isProcessing: true });
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection is only available in the browser');
      }

      // Check if we have any wallets available
      if (!wallets || wallets.length === 0) {
        throw new Error('No wallet adapters available. Please install a Solana wallet like Phantom or Solflare.');
      }

      // Filter out wallets that might cause conflicts
      const compatibleWallets = wallets.filter(w => {
        const name = w.adapter.name.toLowerCase();
        return ![
          'metamask',
          'coin98',
          'mathwallet',
          'trust wallet',
          'tokenpocket'
        ].some(badName => name.includes(badName));
      });

      // Sort wallets to prefer Phantom and Solflare
      const sortedWallets = [...compatibleWallets].sort((a, b) => {
        const aName = a.adapter.name.toLowerCase();
        const bName = b.adapter.name.toLowerCase();
        
        if (aName.includes('phantom')) return -1;
        if (bName.includes('phantom')) return 1;
        if (aName.includes('solflare')) return -1;
        if (bName.includes('solflare')) return 1;
        return 0;
      });

      const walletToUse = sortedWallets[0];

      if (!walletToUse) {
        throw new Error('No compatible wallet found. Please install Phantom or Solflare.');
      }

      try {
        // If we have a different wallet selected, switch to the new one
        if (wallet?.adapter.name !== walletToUse.adapter.name) {
          console.log(`[Wallet] Selecting wallet: ${walletToUse.adapter.name}`);
          select(walletToUse.adapter.name);
          // Give some time for the wallet to initialize
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Now try to connect
        console.log('[Wallet] Attempting to connect...');
        await connect();
        console.log('[Wallet] Connected successfully');
        toast.success('Wallet connected successfully');
        return true;
      } catch (error) {
        console.error('[Wallet] Connection error:', error);
        
        // If connection fails, try a full reset
        try {
          console.log('[Wallet] Connection failed, attempting to reset...');
          await disconnect();
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Try one more time with a clean state
          select(walletToUse.adapter.name);
          await new Promise(resolve => setTimeout(resolve, 500));
          await connect();
          toast.success('Wallet connected successfully');
          return true;
        } catch (retryError) {
          console.error('[Wallet] Retry connection failed:', retryError);
          throw new Error('Failed to connect. Please try refreshing the page or using a different wallet.');
        }
      }
    } catch (error) {
      console.error('[Wallet] Connection failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect wallet');
      return false;
    } finally {
      updateState({ isProcessing: false });
    }
  }, [connected, publicKey, wallet, connect, disconnect, select, wallets, updateState]);

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
  
  // Update isProcessing state when wallet connection state changes
  useEffect(() => {
    if (connected) {
      updateState({ isProcessing: false });
    }
  }, [connected, updateState]);

  // Handle stake action
  const handleStake = useCallback(async (amount: number) => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    updateState({ 
      isStaking: true,
      stakingData: { 
        stakedAmount: state.stakingData.stakedAmount,
        pendingRewards: state.stakingData.pendingRewards,
        lifetimeRewards: state.stakingData.lifetimeRewards,
        antBalance: state.stakingData.antBalance,
        stakingPeriod: state.stakingData.stakingPeriod,
        lastStakeTime: state.stakingData.lastStakeTime,
        isStaking: true
      }
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
        stakingData: { 
          stakedAmount: state.stakingData.stakedAmount,
          pendingRewards: state.stakingData.pendingRewards,
          lifetimeRewards: state.stakingData.lifetimeRewards,
          antBalance: state.stakingData.antBalance,
          stakingPeriod: state.stakingData.stakingPeriod,
          lastStakeTime: state.stakingData.lastStakeTime,
          isStaking: false
        }
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
      stakingData: { 
        stakedAmount: state.stakingData.stakedAmount,
        pendingRewards: state.stakingData.pendingRewards,
        lifetimeRewards: state.stakingData.lifetimeRewards,
        antBalance: state.stakingData.antBalance,
        stakingPeriod: state.stakingData.stakingPeriod,
        lastStakeTime: state.stakingData.lastStakeTime,
        isUnstaking: true
      }
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
        stakingData: { 
          stakedAmount: state.stakingData.stakedAmount,
          pendingRewards: state.stakingData.pendingRewards,
          lifetimeRewards: state.stakingData.lifetimeRewards,
          antBalance: state.stakingData.antBalance,
          stakingPeriod: state.stakingData.stakingPeriod,
          lastStakeTime: state.stakingData.lastStakeTime,
          isUnstaking: false
        }
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
      stakingData: { 
        stakedAmount: state.stakingData.stakedAmount,
        pendingRewards: state.stakingData.pendingRewards,
        lifetimeRewards: state.stakingData.lifetimeRewards,
        antBalance: state.stakingData.antBalance,
        stakingPeriod: state.stakingData.stakingPeriod,
        lastStakeTime: state.stakingData.lastStakeTime,
        isClaiming: true
      }
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
        stakingData: { 
          stakedAmount: state.stakingData.stakedAmount,
          pendingRewards: state.stakingData.pendingRewards,
          lifetimeRewards: state.stakingData.lifetimeRewards,
          antBalance: state.stakingData.antBalance,
          stakingPeriod: state.stakingData.stakingPeriod,
          lastStakeTime: state.stakingData.lastStakeTime,
          isClaiming: false
        }
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
        return <JupiterSwapComponent onSuccess={onClose} />;

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
            {activeTab === 'swap' ? 'Swap' : 'Stake'} ANTS
          </h2>
          <div className="flex items-center space-x-3">
            {/* Wallet Connection */}
            <div className="relative">
              {!connected ? (
                <button
                  onClick={handleConnect}
                  disabled={state.isProcessing}
                  className={`text-sm ${
                    state.isProcessing ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white px-4 py-1.5 rounded-md transition-colors flex items-center`}
                >
                  {state.isProcessing ? (
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
              
              {/* Tooltip for better UX */}
              {!connected && !state.isProcessing && (
                <div className="absolute z-10 w-48 p-2 mt-1 text-xs text-center text-white bg-gray-800 rounded-md shadow-lg -left-16">
                  Select a wallet provider
                </div>
              )}
            </div>
            
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
                    ? 'text-primary-400 border-b-2 border-primary-500'
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
