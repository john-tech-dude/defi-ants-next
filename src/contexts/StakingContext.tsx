import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useStaking, StakingData } from '@/hooks/useStaking';
import { useWallet } from '@solana/wallet-adapter-react';
import { TIERS, LOCK_PERIODS } from '@/components/features/staking/premium/constants';

// Extend TIERS with name property for type safety
const TIERS_WITH_NAMES = Object.entries(TIERS).map(([name, tier]) => ({
  ...tier,
  name,
}));

type TierWithName = typeof TIERS_WITH_NAMES[number];

interface StakingContextType {
  stakingData: StakingData;
  loading: boolean;
  error: string | null;
  stake: (amount: number, lockPeriod: number) => Promise<void>;
  unstake: (amount: number) => Promise<void>;
  claimRewards: () => Promise<void>;
  refresh: () => Promise<void>;
  currentTier: TierWithName;
  isEligibleForTier: (tier: string) => boolean;
  calculateRewards: (amount: number, lockPeriod: string) => number;
  getLockPeriodDays: (period: string) => number;
}

const initialState: StakingContextType = {
  stakingData: {
    stakedAmount: 0,
    antBalance: 0,
    stantBalance: 0,
    pendingRewards: { sol: 0, ant: 0, usdc: 0 },
    lifetimeRewards: { sol: 0, ant: 0, usdc: 0 },
    portfolioValue: 0,
    dayChange: 0,
    tierLevel: 'Explorer',
    lockEndsAt: null,
  },
  loading: false,
  error: null,
  stake: async () => {},
  unstake: async () => {},
  claimRewards: async () => {},
  refresh: async () => {},
  currentTier: TIERS_WITH_NAMES[0], // Default to Explorer tier
  isEligibleForTier: () => false,
  calculateRewards: () => 0,
  getLockPeriodDays: () => 0, // Default implementation
};

const StakingContext = createContext<StakingContextType>(initialState);

export const StakingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey } = useWallet();
  const {
    stakingData,
    loading,
    error,
    stake: stakeTokens,
    unstake: unstakeTokens,
    claimRewards: claimStakingRewards,
    refresh: refreshStaking,
  } = useStaking();

  // Get current tier based on staked amount
  const getCurrentTier = (): TierWithName => {
    const stakedAmount = stakingData.stakedAmount;
    
    // Find the highest tier the user qualifies for
    const tier = TIERS_WITH_NAMES
      .slice() // Create a copy to avoid mutating the original
      .reverse() // Check from highest to lowest
      .find(tier => stakedAmount >= tier.minStake);
    
    return tier || TIERS_WITH_NAMES[0]; // Default to Explorer if no tier matches
  };

  // Check if wallet is eligible for a specific tier
  const isEligibleForTier = (tierName: string) => {
    const tier = TIERS_WITH_NAMES.find(t => t.name === tierName);
    if (!tier) return false;
    
    return stakingData.stakedAmount >= tier.minStake;
  };
  
  // Get number of days for a lock period
  const getLockPeriodDays = (period: string): number => {
    return LOCK_PERIODS[period as keyof typeof LOCK_PERIODS]?.days || 0;
  };

  // Calculate estimated rewards based on amount and lock period
  const calculateRewards = (amount: number, lockPeriod: string) => {
    const lockPeriods: Record<string, number> = {
      'Flexible': 0,
      'Short': 20,
      'Medium': 50,
      'Long': 80,
      'Maximum': 150,
    };
    
    const multiplier = (lockPeriods[lockPeriod] || 0) / 100 + 1;
    const baseApy = getCurrentTier().baseApy;
    const apy = parseFloat(baseApy.split('-')[0]); // Take the lower bound of APY range
    
    return amount * (apy / 100) * multiplier;
  };

  // Refresh staking data when wallet changes
  useEffect(() => {
    if (publicKey) {
      refreshStaking();
    }
  }, [publicKey, refreshStaking]);

  // Wrap staking functions to handle loading states
  const stake = async (amount: number, lockPeriod: number) => {
    try {
      await stakeTokens(amount, lockPeriod);
      await refreshStaking();
    } catch (err) {
      console.error('Staking failed:', err);
      throw err;
    }
  };

  const unstake = async (amount: number) => {
    try {
      await unstakeTokens(amount);
      await refreshStaking();
    } catch (err) {
      console.error('Unstaking failed:', err);
      throw err;
    }
  };

  const claimRewards = async () => {
    try {
      await claimStakingRewards();
      await refreshStaking();
    } catch (err) {
      console.error('Claim rewards failed:', err);
      throw err;
    }
  };

  const refresh = async () => {
    await refreshStaking();
  };

  const value = {
    stakingData: {
      ...stakingData,
      tierLevel: getCurrentTier().name,
    },
    loading,
    error,
    stake,
    unstake,
    claimRewards,
    refresh,
    currentTier: getCurrentTier(),
    isEligibleForTier,
    calculateRewards,
    getLockPeriodDays,
  };

  return (
    <StakingContext.Provider value={value}>
      {children}
    </StakingContext.Provider>
  );
};

export const useStakingContext = () => {
  const context = useContext(StakingContext);
  if (context === undefined) {
    throw new Error('useStakingContext must be used within a StakingProvider');
  }
  return context;
};
