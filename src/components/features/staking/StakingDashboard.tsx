'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

interface StakingDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function StakingDashboard({ isOpen = false, onClose, className }: StakingDashboardProps) {
  const [amount, setAmount] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [totalStaked, setTotalStaked] = useState(2500000);
  const [apy, setApy] = useState(15.5);
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();

  // Mock data - replace with actual contract calls
  useEffect(() => {
    if (publicKey) {
      // Fetch user's staked amount
      const fetchStakedAmount = async () => {
        try {
          // Replace with actual contract call
          // const staked = await contract.getStakedAmount(publicKey);
          setStakedAmount(1200); // Mock data
        } catch (error) {
          console.error('Error fetching staked amount:', error);
        }
      };
      
      fetchStakedAmount();
    }
  }, [publicKey]);

  const handleStake = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    
    try {
      // Replace with actual staking logic
      // await stakeTokens(publicKey, amount);
      
      toast.success('Successfully staked tokens');
      setStakedAmount(prev => prev + Number(amount));
      setAmount('');
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Error staking tokens:', error);
      toast.error('Failed to stake tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Replace with actual unstaking logic
      // await unstakeTokens(publicKey);
      
      toast.success('Successfully unstaked tokens');
      setStakedAmount(0);
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      toast.error('Failed to unstake tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className={className}>
      <div className="space-y-6">
        {/* Staking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Staked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStaked.toLocaleString()} <span className="text-sm font-normal">ANT</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Stake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stakedAmount.toLocaleString()} <span className="text-sm font-normal">ANT</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Current APY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {apy}%
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Staking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Stake ANT Tokens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Stake</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-20 text-lg"
                />
                <div className="absolute right-3 top-2.5 flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={() => setAmount('1000')}
                  >
                    MAX
                  </Button>
                  <span className="text-sm text-gray-500">ANT</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Available: 5,000 ANT</span>
                <button className="text-primary hover:underline">Use Max</button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Est. APY</span>
                <span className="font-medium">{apy}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Lockup Period</span>
                <span className="font-medium">14 days</span>
              </div>
              <div className="pt-2">
                <Progress value={75} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 ANT</span>
                  <span>Pool Limit: 5,000,000 ANT</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleStake}
              disabled={isLoading || !publicKey}
            >
              {isLoading ? 'Processing...' : 'Stake ANT Tokens'}
            </Button>
            
            {stakedAmount > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium">Your Staked Tokens</h4>
                    <p className="text-sm text-gray-500">Staked: {stakedAmount} ANT</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleUnstake}
                    disabled={isLoading}
                  >
                    Unstake All
                  </Button>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Est. Rewards</span>
                    <span className="font-medium">{(stakedAmount * (apy / 100) / 365).toFixed(2)} ANT/day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Reward</span>
                    <span className="font-medium">In 24h</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isOpen && onClose) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Stake ANT Tokens</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
}
