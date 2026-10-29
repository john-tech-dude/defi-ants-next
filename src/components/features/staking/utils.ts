import { LOCK_PERIODS, STAKING_TIERS, StakingData } from './types';

/**
 * Calculate the projected rewards for a given stake amount and lock period
 */
export const calculateProjectedRewards = (
  amount: number,
  lockPeriod: keyof typeof LOCK_PERIODS,
  currentApy: number
) => {
  const period = LOCK_PERIODS[lockPeriod];
  const baseAPY = currentApy;
  const boostedAPY = baseAPY * period.multiplier;
  
  return {
    daily: (amount * (boostedAPY / 100)) / 365,
    weekly: (amount * (boostedAPY / 100) * 7) / 365,
    monthly: (amount * (boostedAPY / 100) * 30) / 365,
    yearly: amount * (boostedAPY / 100),
    apy: boostedAPY
  };
};

/**
 * Calculate the user's current staking tier based on their staked amount
 */
export const calculateUserTier = (stakedAmount: number) => {
  const tiers = Object.values(STAKING_TIERS).sort((a, b) => b.minStake - a.minStake);
  const currentTier = tiers.find(tier => stakedAmount >= tier.minStake) || tiers[tiers.length - 1];
  
  // Find next tier for progress calculation
  const currentTierIndex = tiers.findIndex(tier => tier.id === currentTier.id);
  const nextTier = tiers[currentTierIndex - 1];
  
  let nextTierProgress = 100;
  if (nextTier) {
    const progress = ((stakedAmount - currentTier.minStake) / (nextTier.minStake - currentTier.minStake)) * 100;
    nextTierProgress = Math.min(Math.max(0, Math.round(progress)), 100);
  }
  
  return {
    currentTier: currentTier.id,
    nextTierProgress
  };
};

/**
 * Format a number with commas and optional decimal places
 */
export const formatNumber = (value: number, decimals = 2) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a duration in days to a human-readable string
 */
export const formatDuration = (days: number) => {
  if (days === 0) return 'Flexible';
  if (days < 30) return `${days} day${days > 1 ? 's' : ''}`;
  if (days < 365) return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''}`;
  return `${(days / 365).toFixed(1)} year${days >= 730 ? 's' : ''}`;
};

/**
 * Calculate the remaining lock time in days
 */
export const getRemainingLockTime = (lockEndDate: Date | null) => {
  if (!lockEndDate) return 0;
  const now = new Date();
  const diffTime = lockEndDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

/**
 * Calculate the early unstaking penalty
 */
export const calculateUnstakePenalty = (
  amount: number,
  lockEndDate: Date | null,
  lockPeriod: keyof typeof LOCK_PERIODS
) => {
  if (!lockEndDate) return 0;
  
  const now = new Date();
  if (now >= lockEndDate) return 0;
  
  const totalLockDays = LOCK_PERIODS[lockPeriod]?.days || 0;
  if (totalLockDays === 0) return 0; // No penalty for flexible staking
  
  const remainingDays = getRemainingLockTime(lockEndDate);
  const penaltyRate = Math.min(0.1 + (remainingDays / totalLockDays) * 0.9, 1); // 10-100% penalty
  
  return amount * penaltyRate;
};

/**
 * Validate stake amount
 */
export const validateStakeAmount = (amount: number, balance: number) => {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a valid amount';
  }
  
  if (amount > balance) {
    return 'Insufficient balance';
  }
  
  return null;
};

/**
 * Validate unstake amount
 */
export const validateUnstakeAmount = (amount: number, stakedAmount: number) => {
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a valid amount';
  }
  
  if (amount > stakedAmount) {
    return 'Insufficient staked amount';
  }
  
  return null;
};
