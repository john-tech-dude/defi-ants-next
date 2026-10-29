export type Tab = 'stripe' | 'swap' | 'stake';

export interface Rewards {
  sol: number;
  ant: number;
  usdc: number;
}

export interface StakingData {
  stakedAmount: number;
  pendingRewards: Rewards;
  lifetimeRewards: Rewards;
  antBalance: number;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  currentApy: number;
}

export interface AppState {
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  stakingData: StakingData;
  isProcessing: boolean;
}

export interface JupiterSwapProps {
  onSuccess: () => void;
}

export interface BuyPanelProps {
  onClose: () => void;
  defaultTab?: Tab;
}

export interface StakingPanelProps {
  stakingData: StakingData;
  onStake: (amount: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaim: () => Promise<void>;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  currentApy: number;
}
