// Staking Data Types
export interface StakingRewards {
  sol: number;
  ant: number;
  usdc: number;
  [key: string]: number; // For additional reward tokens
}

export interface RWAPosition {
  id: string;
  amount: number;
  value: number;
  apy: number;
}

export interface StakingData {
  antBalance: number;
  stantBalance: number;
  stakedAmount: number;
  pendingRewards: StakingRewards;
  tierLevel: string;
  lockPeriod: string;
  lockEndDate: Date | null;
  lifetimeRewards: StakingRewards;
  currentApy: number;
  nextTierProgress: number;
  portfolioValue: number;
  dayChange: number;
  weekChange: number;
  monthChange: number;
  rwaPositions: RWAPosition[];
}

// Component Props
export interface PremiumStakingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface OverviewTabProps {
  stakingData: StakingData;
  currentTier: {
    icon: string;
    multiplier: number;
    baseApy: string;
    bgColor: string;
    borderColor: string;
    benefits: string[];
  };
}

export interface StakeTabProps {
  stakeAmount: string;
  setStakeAmount: (amount: string) => void;
  selectedLockPeriod: string;
  setSelectedLockPeriod: (period: string) => void;
  stakingData: {
    antBalance: number;
  };
  loading: boolean;
  error: string | null;
  onStake: () => Promise<void>;
}

// Utility Types
export type LockPeriod = 'Flexible' | 'Short' | 'Medium' | 'Long' | 'Maximum';
export type TierLevel = 'Explorer' | 'Pioneer' | 'Visionary';

// Constants Types
export interface LockPeriodConfig {
  days: number;
  multiplier: number;
  apy: string;
  icon: string;
}

export interface TierConfig {
  minStake: number;
  multiplier: number;
  baseApy: string;
  color: string;
  bgColor: string;
  borderColor: string;
  benefits: string[];
  icon: string;
}

export interface RWAConfig {
  id: string;
  name: string;
  icon: string;
  apy: string;
  tvl: string;
  risk: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
}

export interface DeFiStrategy {
  id: string;
  name: string;
  risk: string;
  apy: string;
  icon: string;
  color: string;
}

export interface TabConfig {
  id: string;
  name: string;
  icon: string;
}
