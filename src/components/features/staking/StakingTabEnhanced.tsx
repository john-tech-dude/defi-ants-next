'use client';

import { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ZapOff, 
  Gift, 
  Info, 
  ArrowRight, 
  Copy, 
  Check,
  Lock,
  Unlock,
  BarChart2,
  ArrowDownUp,
  Coins,
  PieChart
} from 'lucide-react';
import Button from "@/components/ui/button";
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import useToast from '@/components/ui/use-toast';

interface StakingTabEnhancedProps {
  userBalance: number;
  stakedAmount: number;
  rewards: number;
  apy: number;
  totalStaked: number;
  isConnected: boolean;
  onStake: (amount: number, lockDays: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaim: () => Promise<void>;
  onWrapToStant: (amount: number) => Promise<void>;
  onUnwrapFromStant: (amount: number) => Promise<void>;
}

interface LockPeriod {
  id: string;
  name: string;
  days: number;
  multiplier: number;
  apyBonus: string;
}

const LOCK_PERIODS: LockPeriod[] = [
  { id: 'flexible', name: 'Flexible', days: 0, multiplier: 1.0, apyBonus: '+0%' },
  { id: 'short', name: '30 Days', days: 30, multiplier: 1.2, apyBonus: '+20%' },
  { id: 'medium', name: '90 Days', days: 90, multiplier: 1.5, apyBonus: '+50%' },
  { id: 'long', name: '180 Days', days: 180, multiplier: 1.8, apyBonus: '+80%' },
  { id: 'maximum', name: '1 Year', days: 365, multiplier: 2.5, apyBonus: '+150%' }
];

export function StakingTabEnhanced({
  userBalance,
  stakedAmount,
  rewards,
  apy,
  totalStaked,
  isConnected,
  onStake,
  onUnstake,
  onClaim,
  onWrapToStant,
  onUnwrapFromStant
}: StakingTabEnhancedProps) {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake' | 'wrap' | 'unwrap' | 'rewards'>('stake');
  const [amount, setAmount] = useState('');
  const [selectedLockPeriod, setSelectedLockPeriod] = useState<LockPeriod>(LOCK_PERIODS[2]); // Default to 90 days
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate derived values
  const effectiveApy = useMemo(() => {
    return apy * selectedLockPeriod.multiplier;
  }, [apy, selectedLockPeriod]);

  const stantBalance = useMemo(() => {
    // In a real app, this would come from the contract
    return stakedAmount * 0.98; // 2% penalty for early unstaking
  }, [stakedAmount]);

  const handleMax = () => {
    if (activeTab === 'stake' || activeTab === 'wrap') {
      setAmount(userBalance.toString());
    } else if (activeTab === 'unstake' || activeTab === 'unwrap') {
      setAmount(stakedAmount.toString());
    }
  };

  const handleAction = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (activeTab === 'stake') {
        await onStake(amountNum, selectedLockPeriod.days);
        toast({
          title: 'Success',
          description: `Successfully staked ${amountNum} ANT!`,
        });
      } else if (activeTab === 'unstake') {
        await onUnstake(amountNum);
        toast({
          title: 'Success',
          description: `Successfully unstaked ${amountNum} ANT!`,
        });
      } else if (activeTab === 'wrap') {
        await onWrapToStant(amountNum);
        toast({
          title: 'Success',
          description: `Wrapped ${amountNum} ANT to stANT!`,
        });
      } else if (activeTab === 'unwrap') {
        await onUnwrapFromStant(amountNum);
        toast({
          title: 'Success',
          description: `Unwrapped ${amountNum} stANT to ANT!`,
        });
      }
      
      setAmount('');
    } catch (error) {
      console.error('Action failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Action failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('stake')}
          className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'stake' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          Stake
        </button>
        <button
          onClick={() => setActiveTab('unstake')}
          className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'unstake' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ZapOff className="w-4 h-4" />
          Unstake
        </button>
        <button
          onClick={() => setActiveTab('wrap')}
          className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'wrap' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowDownUp className="w-4 h-4" />
          Wrap
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'rewards' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          Rewards
        </button>
      </div>

      {activeTab === 'rewards' ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-6 rounded-xl border border-purple-800/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  {rewards.toFixed(4)} ANT
                </h3>
                <p className="text-muted-foreground">Available to claim</p>
              </div>
              <Button 
                className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={onClaim}
                disabled={isLoading || rewards <= 0}
              >
                {isLoading ? 'Claiming...' : 'Claim Rewards'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
              <div className="text-sm text-muted-foreground">Next Reward</div>
              <div className="text-lg font-bold">
                {(rewards * 0.01).toFixed(4)} ANT
              </div>
              <div className="text-xs text-muted-foreground">~ $0.00</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
              <div className="text-sm text-muted-foreground">Daily Estimate</div>
              <div className="text-lg font-bold">
                {(stakedAmount * effectiveApy / 365).toFixed(4)} ANT
              </div>
              <div className="text-xs text-muted-foreground">~ $0.00</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
              <div className="text-sm text-muted-foreground">APY</div>
              <div className="text-lg font-bold text-green-400">
                {(effectiveApy * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">Annual Percentage Yield</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">
                {activeTab === 'stake' ? 'Amount to Stake' : 
                 activeTab === 'unstake' ? 'Amount to Unstake' :
                 activeTab === 'wrap' ? 'Amount to Wrap' : 'Amount to Unwrap'}
              </Label>
              <span className="text-sm text-muted-foreground">
                Balance: {activeTab === 'wrap' || activeTab === 'stake' ? 
                  `${userBalance.toLocaleString()} ANT` : 
                  `${stakedAmount.toLocaleString()} ${activeTab === 'unwrap' ? 'stANT' : 'ANT'}`}
              </span>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                className="text-lg py-6 pr-20"
                disabled={isLoading}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
                onClick={handleMax}
                disabled={isLoading}
              >
                MAX
              </Button>
            </div>
          </div>

          {/* Lock Period Selector (Stake only) */}
          {activeTab === 'stake' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Lock Period</Label>
                <div className="text-sm text-muted-foreground">
                  APY: <span className="text-green-400">{(effectiveApy * 100).toFixed(2)}%</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {LOCK_PERIODS.map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setSelectedLockPeriod(period)}
                    className={`py-2 text-xs rounded-md transition-colors ${
                      selectedLockPeriod.id === period.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                    disabled={isLoading}
                  >
                    <div>{period.name}</div>
                    <div className="text-xs opacity-80">{period.apyBonus}</div>
                  </button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <Info className="w-3 h-3 mr-1" />
                {selectedLockPeriod.days > 0
                  ? `Tokens will be locked for ${selectedLockPeriod.days} days`
                  : 'Flexible staking - unstake anytime'}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={handleAction}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                {activeTab === 'stake' ? (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Stake ANT
                  </>
                ) : activeTab === 'unstake' ? (
                  <>
                    <ZapOff className="w-5 h-5 mr-2" />
                    Unstake ANT
                  </>
                ) : activeTab === 'wrap' ? (
                  <>
                    <ArrowDownUp className="w-5 h-5 mr-2" />
                    Wrap to stANT
                  </>
                ) : (
                  <>
                    <ArrowDownUp className="w-5 h-5 mr-2" />
                    Unwrap to ANT
                  </>
                )}
              </>
            )}
          </Button>

          {/* stANT Info */}
          {(activeTab === 'wrap' || activeTab === 'unstake') && (
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 text-sm">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-200">stANT Tokens</p>
                  <p className="text-blue-300/80 mt-1">
                    stANT is a liquid staking token that represents your staked ANT. 
                    You can trade it or use it in DeFi while still earning staking rewards.
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-blue-200">Your stANT Balance: {stantBalance.toFixed(4)}</span>
                    <button 
                      onClick={() => copyToClipboard('stANT_CONTRACT_ADDRESS')}
                      className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Address
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-sm text-muted-foreground">Staked</div>
          <div className="text-xl font-bold">{stakedAmount.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">ANT</div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="text-sm text-muted-foreground">APY</div>
          <div className="text-xl font-bold text-green-400">
            {(effectiveApy * 100).toFixed(2)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedLockPeriod.name !== 'Flexible' ? `with ${selectedLockPeriod.name} lock` : 'Flexible staking'}
          </div>
        </div>
      </div>
    </div>
  );
}
