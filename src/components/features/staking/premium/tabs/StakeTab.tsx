import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertTriangle, Loader2, Info } from 'lucide-react';
import { LOCK_PERIODS, TIERS } from '../constants';
import { useStakingContext } from '@/contexts/StakingContext';
import { formatNumber } from '@/lib/utils/numbers';
import { useWallet } from '@solana/wallet-adapter-react';

interface StakeTabProps {
  onStakeSuccess?: () => void;
}

const StakeTab: React.FC<StakeTabProps> = ({ onStakeSuccess }) => {
  const { publicKey } = useWallet();
  const {
    stakingData,
    loading,
    error,
    stake,
    calculateRewards,
    isEligibleForTier,
    currentTier,
  } = useStakingContext();
  
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedLockPeriod, setSelectedLockPeriod] = useState('Medium');
  const [estimatedRewards, setEstimatedRewards] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleMaxClick = () => {
    setStakeAmount(stakingData.antBalance.toFixed(4));
  };

  const handleStake = async () => {
    if (!publicKey) {
      setLocalError('Please connect your wallet');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }

    if (amount > stakingData.antBalance) {
      setLocalError('Insufficient balance');
      return;
    }

    try {
      setIsConfirming(true);
      setLocalError(null);
      
      // Convert lock period to days
      const lockPeriods: Record<string, number> = {
        'Flexible': 0,
        'Short': 30,
        'Medium': 90,
        'Long': 180,
        'Maximum': 365,
      };
      
      const days = lockPeriods[selectedLockPeriod] || 0;
      await stake(amount, days);
      
      // Reset form
      setStakeAmount('');
      setEstimatedRewards(0);
      
      // Trigger success callback if provided
      if (onStakeSuccess) onStakeSuccess();
      
    } catch (err) {
      console.error('Staking failed:', err);
      setLocalError('Failed to stake tokens. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  // Calculate estimated rewards when amount or lock period changes
  useEffect(() => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      setEstimatedRewards(0);
      return;
    }
    
    const rewards = calculateRewards(amount, selectedLockPeriod);
    setEstimatedRewards(rewards);
  }, [stakeAmount, selectedLockPeriod, calculateRewards]);
  
  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setLocalError(null);
    };
  }, []);

  if (!publicKey) {
    return (
      <div className="p-8 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-700" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please connect your wallet to start staking
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border-2 border-gray-200 bg-white shadow-lg">
        <h3 className="text-2xl font-black mb-6 text-gray-800">Stake ANT Tokens</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-3 uppercase">
              Amount to Stake
            </label>
            <div className="relative">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Enter ANT amount"
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 text-xl font-bold focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
                min="0"
                step="0.01"
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-4 top-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-black py-1 px-3 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                disabled={loading || stakingData.antBalance <= 0}
              >
                MAX
              </button>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mt-2">
              <span>Available: {formatNumber(stakingData.antBalance, 4)} ANT</span>
              <span>Staked: {formatNumber(stakingData.stakedAmount, 4)} ANT</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 mb-3 uppercase">
              Lock Period & Multiplier
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(LOCK_PERIODS).map(([period, config]) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedLockPeriod(period)}
                  className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${
                    selectedLockPeriod === period
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 text-orange-700 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 bg-white'
                  }`}
                  disabled={loading}
                >
                  <div className="text-3xl mb-2">{config.icon}</div>
                  <div className="font-black text-lg">{period}</div>
                  <div className="text-xs text-gray-600 mb-1 font-bold">
                    {config.days} days
                  </div>
                  <div className="text-xs font-black text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {config.apy} APY
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Rewards */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-blue-800">Estimated Annual Rewards:</span>
              <span className="text-lg font-black text-blue-600">
                {formatNumber(estimatedRewards, 4)} ANT
              </span>
            </div>
            <div className="mt-1 text-xs text-blue-600">
              Based on current APY and selected lock period
            </div>
          </div>

          {/* Current Tier Info */}
          <div className="p-4 rounded-xl border-2 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Current Tier</div>
                <div className="text-xl font-black text-orange-700">{currentTier.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-orange-800">APY {currentTier.baseApy}</div>
                <div className="text-xs text-orange-600">
                  Min. {currentTier.minStake.toLocaleString()} ANT
                </div>
              </div>
            </div>
            
            {/* Tier Progress */}
            {currentTier.name !== 'Visionary' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-orange-800 mb-1">
                  <span>To {Object.entries(TIERS).find(([_, t]) => t.minStake > currentTier.minStake)?.[0] || 'Next'}:</span>
                  <span>
                    {Math.min(100, (stakingData.stakedAmount / currentTier.minStake) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2.5">
                  <div 
                    className="bg-orange-500 h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (stakingData.stakedAmount / currentTier.minStake) * 100)}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {(error || localError) && (
            <motion.div 
              className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold text-sm">{error || localError}</span>
            </motion.div>
          )}

          <button
            onClick={handleStake}
            disabled={!stakeAmount || loading || isConfirming || parseFloat(stakeAmount) > stakingData.antBalance || parseFloat(stakeAmount) <= 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl text-lg uppercase"
          >
            {loading || isConfirming ? (
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isConfirming ? 'CONFIRMING...' : 'PROCESSING...'}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>STAKE ANT TOKENS</span>
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* Staking Info */}
      <div className="p-6 rounded-xl border-2 border-blue-100 bg-blue-50">
        <h4 className="text-lg font-black text-blue-800 mb-3">How Staking Works</h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 font-black">•</span>
            <span>Stake ANT tokens to earn stANT, which represents your staked position</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 font-black">•</span>
            <span>Longer lock periods earn higher APY through multiplier effects</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 font-black">•</span>
            <span>Earn additional rewards in SOL, ANT, and other tokens</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 font-black">•</span>
            <span>Unstake at any time with a small fee based on lock period</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StakeTab;
