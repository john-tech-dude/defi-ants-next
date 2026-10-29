export interface StakingTier {
  id: string;
  name: string;
  apy: number;
  minStake: number;
  color: string;
  bgColor: string;
  borderColor: string;
  benefits: string[];
  icon: string;
  multiplier: number;
}

export interface LockPeriod {
  days: number;
  multiplier: number;
  apy: string;
  icon: string;
}

export interface StakingData {
  antBalance: number;
  stantBalance: number;
  stakedAmount: number;
  pendingRewards: {
    sol: number;
    ant: number;
  };
  tierLevel: string;
  lockPeriod: string;
  lockEndDate: Date | null;
  lifetimeRewards: {
    sol: number;
    ant: number;
  };
  currentApy: number;
  nextTierProgress: number;
  stantExchangeRate: number;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
}

export interface EnhancedStakingTabProps {
  publicKey?: string;
  onStake: (amount: number, lockPeriod: string) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaim: () => Promise<void>;
  userBalance?: number;
  stakedAmount?: number;
  rewards?: number;
  apy?: number;
  totalStaked?: number;
  isLoading?: boolean;
  error?: string | null;
}

export const LOCK_PERIODS: Record<string, LockPeriod> = {
  Flexible: { days: 0, multiplier: 1.0, apy: '+0%', icon: '🔄' },
  Short: { days: 30, multiplier: 1.2, apy: '+20%', icon: '📅' },
  Medium: { days: 90, multiplier: 1.5, apy: '+50%', icon: '📊' },
  Long: { days: 180, multiplier: 1.8, apy: '+80%', icon: '🎯' },
  Maximum: { days: 365, multiplier: 2.5, apy: '+150%', icon: '💎' }
};

export const STAKING_TIERS: Record<string, StakingTier> = {
  Explorer: {
    id: 'explorer',
    name: 'Explorer',
    apy: 5,
    minStake: 1000,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    borderColor: 'border-amber-300',
    benefits: ['Basic staking rewards', 'Jupiter swap access', 'Governance voting'],
    icon: '🌟',
    multiplier: 1.0
  },
  Pioneer: {
    id: 'pioneer',
    name: 'Pioneer',
    apy: 15,
    minStake: 10000,
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    borderColor: 'border-orange-300',
    benefits: ['Enhanced rewards', 'Auto-compounding', 'NFT staking', 'Yield farming'],
    icon: '⚡',
    multiplier: 1.5
  },
  Visionary: {
    id: 'visionary',
    name: 'Visionary',
    apy: 25,
    minStake: 50000,
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-purple-300',
    benefits: ['Maximum rewards', 'Leveraged farming', 'Private launchpad', 'Arbitrage tools'],
    icon: '👑',
    multiplier: 2.5
  }
};

export interface StakingTab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}
