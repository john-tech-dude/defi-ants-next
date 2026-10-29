// Common types for staking functionality

export enum TransactionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum TxStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface StakingStats {
  totalStaked: number;
  userStaked: number;
  rewards: number;
  apy: number;
}
