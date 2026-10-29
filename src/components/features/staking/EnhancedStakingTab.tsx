import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Loader2, ExternalLink, Copy, Check } from 'lucide-react';

// Import Tabs components from simple-tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/simple-tabs';

import Button from "@/components/ui/button";
import Input from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Progress from '@/components/ui/progress';
// Using styled span instead of Badge component
import Slider from '@/components/ui/slider';
import useToast from '@/components/ui/use-toast';

import { formatNumber, calculateProjectedRewards } from './utils';
import { LOCK_PERIODS, STAKING_TIERS, StakingData, EnhancedStakingTabProps } from './types';

const DEFAULT_STAKING_DATA: StakingData = {
  antBalance: 0,
  stantBalance: 0,
  stakedAmount: 0,
  pendingRewards: {
    sol: 0,
    ant: 0,
  },
  lifetimeRewards: {
    sol: 0,
    ant: 0,
  },
  tierLevel: 'explorer',
  lockPeriod: 'Flexible',
  lockEndDate: null,
  currentApy: 5,
  nextTierProgress: 0,
  stantExchangeRate: 1.05,
  isStaking: false,
  isUnstaking: false,
  isClaiming: false,
};

export const EnhancedStakingTab: React.FC<EnhancedStakingTabProps> = ({
  publicKey,
  onStake,
  onUnstake,
  onClaim,
  userBalance = 0,
  stakedAmount = 0,
  rewards = 0,
  apy = 15,
  totalStaked = 0,
  isLoading = false,
  error = null,
}) => {
  const { toast } = useToast();
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [stakingData, setStakingData] = useState<StakingData>(DEFAULT_STAKING_DATA);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [selectedLockPeriod, setSelectedLockPeriod] = useState<keyof typeof LOCK_PERIODS>('Flexible');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Initialize staking data
  useEffect(() => {
    const initStakingData = async () => {
      try {
        // In a real app, you would fetch this data from the blockchain
        const data: StakingData = {
          ...DEFAULT_STAKING_DATA,
          antBalance: userBalance,
          stakedAmount,
          pendingRewards: {
            sol: rewards * 0.2, // Mock SOL rewards
            ant: rewards,
          },
          lifetimeRewards: {
            sol: rewards * 0.2 * 3, // Mock lifetime rewards (3x pending)
            ant: rewards * 3,
          },
          currentApy: apy,
        };
        
        setStakingData(data);
      } catch (err) {
        console.error('Failed to load staking data:', err);
        toast({
          title: 'Error',
          description: 'Failed to load staking data',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    initStakingData();
  }, [userBalance, stakedAmount, rewards, apy, toast]);

  // Handle staking
  const handleStake = useCallback(async () => {
    if (!publicKey || !stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    try {
      setStakingData(prev => ({ ...prev, isStaking: true }));
      
      if (onStake) {
        await onStake(parseFloat(stakeAmount), selectedLockPeriod);
      }
      
      // Update local state
      setStakingData(prev => ({
        ...prev,
        antBalance: prev.antBalance - parseFloat(stakeAmount),
        stakedAmount: prev.stakedAmount + parseFloat(stakeAmount),
        isStaking: false,
      }));
      
      toast({
        title: 'Success',
        description: `${stakeAmount} ANT staked successfully!`,
      });
      
      setStakeAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to stake tokens',
        variant: 'destructive',
      });
      setStakingData(prev => ({ ...prev, isStaking: false }));
    }
  }, [publicKey, stakeAmount, selectedLockPeriod, onStake, toast]);

  // Handle unstaking
  const handleUnstake = useCallback(async () => {
    if (!publicKey || !unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    
    try {
      setStakingData(prev => ({ ...prev, isUnstaking: true }));
      
      if (onUnstake) {
        await onUnstake(parseFloat(unstakeAmount));
      }
      
      // Update local state
      setStakingData(prev => ({
        ...prev,
        stantBalance: Math.max(0, prev.stantBalance - parseFloat(unstakeAmount)),
        isUnstaking: false,
      }));
      
      toast({
        title: 'Success',
        description: `${unstakeAmount} stANT unstaked successfully!`,
      });
      
      setUnstakeAmount('');
    } catch (error) {
      console.error('Unstaking failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to unstake tokens',
        variant: 'destructive',
      });
      setStakingData(prev => ({ ...prev, isUnstaking: false }));
    }
  }, [publicKey, unstakeAmount, onUnstake, toast]);

  // Handle claiming rewards
  const handleClaimRewards = useCallback(async () => {
    if (!publicKey || (stakingData.pendingRewards.sol === 0 && stakingData.pendingRewards.ant === 0)) return;
    
    try {
      setStakingData(prev => ({ ...prev, isClaiming: true }));
      
      if (onClaim) {
        await onClaim();
      }
      
      // Update local state
      setStakingData(prev => ({
        ...prev,
        pendingRewards: { sol: 0, ant: 0 },
        lifetimeRewards: {
          sol: prev.lifetimeRewards.sol + prev.pendingRewards.sol,
          ant: prev.lifetimeRewards.ant + prev.pendingRewards.ant,
        },
        isClaiming: false,
      }));
      
      toast({
        title: 'Success',
        description: 'Rewards claimed successfully!',
      });
    } catch (error) {
      console.error('Claim failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to claim rewards',
        variant: 'destructive',
      });
      setStakingData(prev => ({ ...prev, isClaiming: false }));
    }
  }, [publicKey, stakingData.pendingRewards, onClaim, toast]);

  // Handle copy to clipboard
  const handleCopyAddress = useCallback((e: React.MouseEvent) => {
    if (!publicKey) return;
    
    navigator.clipboard.writeText(publicKey.toString())
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy address:', err);
        toast({
          title: 'Error',
          description: 'Failed to copy wallet address',
          variant: 'destructive',
        });
      });
  }, [publicKey, toast]);

  // Calculate projected rewards
  const projectedRewards = calculateProjectedRewards(
    parseFloat(stakeAmount) || 0,
    selectedLockPeriod,
    stakingData.currentApy
  );

  // Handle max stake
  const handleMaxStake = useCallback(() => {
    setStakeAmount(userBalance.toString());
  }, [userBalance]);

  // Handle max unstake
  const handleMaxUnstake = useCallback(() => {
    setUnstakeAmount(stakingData.stantBalance.toString());
  }, [stakingData.stantBalance]);

  // Render loading state
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading staking data...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>Error loading staking data. Please try again later.</p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stake">Stake</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="unstake">Unstake</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staking Dashboard</CardTitle>
              <CardDescription>Manage your staked tokens and track your rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wallet Info */}
              {connected && publicKey && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Connected Wallet</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={handleCopyAddress}
                    >
                      {`${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`}
                      {isCopied ? (
                        <Check className="ml-1 h-3 w-3" />
                      ) : (
                        <Copy className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Staking Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">ANT Balance</div>
                  <div className="text-2xl font-bold">
                    {formatNumber(stakingData.antBalance)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${(stakingData.antBalance * 0.5).toFixed(2)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Staked</div>
                  <div className="text-2xl font-bold">
                    {formatNumber(stakingData.stakedAmount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${(stakingData.stakedAmount * 0.5).toFixed(2)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Current APY</div>
                  <div className="text-2xl font-bold text-primary">
                    {stakingData.currentApy}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stakingData.lockPeriod} Lock
                  </div>
                </div>
              </div>

              {/* Staking Tier */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Your Staking Tier</h3>
                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 uppercase">
                    {stakingData.tierLevel}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Next Tier</span>
                    <span>{Math.round(stakingData.nextTierProgress)}%</span>
                  </div>
                  <Progress value={stakingData.nextTierProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Rewards */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Rewards</CardTitle>
              <CardDescription>Claim your staking rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">SOL Rewards</div>
                  <div className="text-2xl font-bold">
                    {stakingData.pendingRewards.sol.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${(stakingData.pendingRewards.sol * 100).toFixed(2)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">ANT Rewards</div>
                  <div className="text-2xl font-bold">
                    {stakingData.pendingRewards.ant.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${(stakingData.pendingRewards.ant * 0.5).toFixed(2)}
                  </div>
                </div>
                </div>

                {/* Rewards History */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Rewards History</h3>
                    <Button variant="ghost" size="sm" className="text-sm">
                      View All
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                      <div className="col-span-4">Date</div>
                      <div className="col-span-3 text-right">Type</div>
                      <div className="col-span-3 text-right">Amount</div>
                      <div className="col-span-2 text-right">Status</div>
                    </div>
                    <div className="divide-y">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="grid grid-cols-12 p-3 text-sm">
                          <div className="col-span-4">2023-06-{10 + item}</div>
                          <div className="col-span-3 text-right">Staking Rewards</div>
                          <div className="col-span-3 text-right font-medium">
                            {item * 2.5} ANT
                          </div>
                          <div className="col-span-2 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Claimed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unstake Tab */}
          <TabsContent value="unstake" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Unstake ANT Tokens</CardTitle>
                <CardDescription>
                  Unstake your stANT to receive your original ANT tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Unstake Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="unstake-amount" className="text-sm font-medium">Amount to Unstake</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setUnstakeAmount(stakingData.stantBalance.toString())}
                    >
                      Max: {stakingData.stantBalance.toFixed(2)} stANT
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="unstake-amount"
                      type="number"
                      placeholder="0.00"
                      value={unstakeAmount}
                      onChange={(e) => {
                        setUnstakeAmount(e.target.value);
                        // Clear any previous errors
                      }}
                      className="pr-20 text-lg py-6"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      <span className="text-muted-foreground text-sm font-medium">stANT</span>
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>

                {/* Unstake Info */}
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Exchange Rate</span>
                      <span className="text-sm font-medium">1 stANT = {stakingData.stantExchangeRate.toFixed(4)} ANT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">You'll Receive</span>
                      <span className="text-sm font-medium">
                        {unstakeAmount ? (parseFloat(unstakeAmount) * stakingData.stantExchangeRate).toFixed(4) : '0.00'} ANT
                      </span>
                    </div>
                    {stakingData.lockEndDate && new Date(stakingData.lockEndDate) > new Date() && (
                      <div className="flex items-center justify-between text-amber-600 text-sm">
                        <span>Early Unstaking Penalty</span>
                        <span>2% ({(parseFloat(unstakeAmount || '0') * 0.02).toFixed(4)} stANT)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Unstake Button */}
                <Button 
                  size="lg" 
                  className="w-full mt-4"
                  onClick={handleUnstake}
                  disabled={!unstakeAmount || stakingData.isUnstaking || parseFloat(unstakeAmount) <= 0}
                >
                  {stakingData.isUnstaking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Unstaking...
                    </>
                  ) : (
                    'Unstake stANT'
                  )}
                </Button>

                {/* Unstaking Info */}
                <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Lock Period</span>
                    <span className="font-medium">
                      {LOCK_PERIODS[stakingData.lockPeriod as keyof typeof LOCK_PERIODS]?.days || 0} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lock End Date</span>
                    <span className="font-medium">
                      {stakingData.lockEndDate?.toLocaleDateString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Early Unstaking Fee</span>
                    <span className="font-medium">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
};

export default EnhancedStakingTab;
