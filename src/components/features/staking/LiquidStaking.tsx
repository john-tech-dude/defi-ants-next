'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Progress from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { ArrowUpRight, Info, ArrowLeftRight, Zap } from 'lucide-react';

interface LiquidStakingProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function LiquidStaking({ isOpen = false, onClose, className }: LiquidStakingProps) {
  const [activeTab, setActiveTab] = useState('stake');
  const [amount, setAmount] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [lsANTBalance, setLsANTBalance] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1.05);
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();

  // Mock data - replace with actual contract calls
  useEffect(() => {
    if (publicKey) {
      // Fetch user's staked amount and lsANT balance
      const fetchBalances = async () => {
        try {
          // Replace with actual contract calls
          // const staked = await getStakedAmount(publicKey);
          // const lsANT = await getLsANTBalance(publicKey);
          setStakedAmount(1200);
          setLsANTBalance(1140); // 1200 / 1.05 (accounting for exchange rate)
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
      };
      
      fetchBalances();
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
      // const tx = await stakeTokens(publicKey, amount);
      // await tx.confirm();
      
      const staked = Number(amount);
      const received = staked / exchangeRate;
      
      toast.success(`Staked ${staked} ANT, received ${received.toFixed(2)} lsANT`);
      
      setStakedAmount(prev => prev + staked);
      setLsANTBalance(prev => prev + received);
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
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (Number(amount) > lsANTBalance) {
      toast.error('Insufficient lsANT balance');
      return;
    }

    setIsLoading(true);
    
    try {
      // Replace with actual unstaking logic
      // const tx = await unstakeTokens(publicKey, amount);
      // await tx.confirm();
      
      const unstaked = Number(amount);
      const received = unstaked * exchangeRate * 0.99; // 1% unstaking fee
      
      toast.success(`Unstaked ${unstaked} lsANT, received ${received.toFixed(2)} ANT`);
      
      setLsANTBalance(prev => prev - unstaked);
      setStakedAmount(prev => prev - received);
      setAmount('');
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      toast.error('Failed to unstake tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMax = () => {
    if (activeTab === 'stake') {
      setAmount('5000'); // Available balance from mock data
    } else {
      setAmount(lsANTBalance.toString());
    }
  };

  const content = (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="stake" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Stake</span>
          </TabsTrigger>
          <TabsTrigger value="unstake" className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Unstake</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stake" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stake ANT for lsANT</CardTitle>
              <CardDescription>
                Stake your ANT tokens to receive lsANT tokens that earn staking rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stake-amount">Amount to Stake</Label>
                <div className="relative">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    className="pr-20 text-lg"
                  />
                  <div className="absolute right-3 top-2.5">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={handleMax}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Available: 5,000 ANT</span>
                  <span>~$4,250</span>
                </div>
              </div>
              
              <div className="flex justify-center py-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>You'll Receive</Label>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">
                    {amount ? (Number(amount) / exchangeRate).toFixed(4) : '0.0000'} lsANT
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Exchange Rate: 1 ANT = {(1/exchangeRate).toFixed(4)} lsANT
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current APY</span>
                  <span className="font-medium">8.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unstaking Fee</span>
                  <span className="font-medium">1%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unstaking Period</span>
                  <span className="font-medium">Instant</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-2"
                size="lg"
                onClick={handleStake}
                disabled={isLoading || !publicKey}
              >
                {isLoading ? 'Processing...' : 'Stake ANT'}
              </Button>
            </CardContent>
          </Card>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">About Liquid Staking</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Stake ANT to receive lsANT tokens 1:1 (minus fees)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>lsANT automatically earns staking rewards that compound over time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use lsANT in DeFi while still earning staking rewards</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Redeem lsANT for ANT at any time (1% unstaking fee applies)</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="unstake" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unstake lsANT for ANT</CardTitle>
              <CardDescription>
                Convert your lsANT back to ANT (1% unstaking fee applies)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="unstake-amount">Amount to Unstake</Label>
                <div className="relative">
                  <Input
                    id="unstake-amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    className="pr-20 text-lg"
                  />
                  <div className="absolute right-3 top-2.5">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={handleMax}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Available: {lsANTBalance.toFixed(4)} lsANT</span>
                  <span>~${(lsANTBalance * 1.02 * 0.85).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-center py-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ArrowUp className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>You'll Receive</Label>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">
                    {amount ? (Number(amount) * exchangeRate * 0.99).toFixed(4) : '0.0000'} ANT
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Exchange Rate: 1 lsANT = {(exchangeRate * 0.99).toFixed(4)} ANT (after 1% fee)
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Value</span>
                  <span className="font-medium">
                    {amount ? `$${(Number(amount) * 0.85).toFixed(2)}` : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unstaking Fee (1%)</span>
                  <span className="font-medium">
                    -{amount ? (Number(amount) * 0.01 * 0.85).toFixed(4) : '0.0000'} ANT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unstaking Period</span>
                  <span className="font-medium">3-5 days</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-2"
                size="lg"
                variant="outline"
                onClick={handleUnstake}
                disabled={isLoading || !publicKey || !amount || Number(amount) > lsANTBalance}
              >
                {isLoading ? 'Processing...' : 'Unstake lsANT'}
              </Button>
            </CardContent>
          </Card>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Your Liquid Staking Positions</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <div>
                  <div className="font-medium">lsANT Balance</div>
                  <div className="text-sm text-muted-foreground">Liquid Staked ANT</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{lsANTBalance.toFixed(4)} lsANT</div>
                  <div className="text-sm">~${(lsANTBalance * 0.85).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <div>
                  <div className="font-medium">Estimated Rewards (24h)</div>
                  <div className="text-sm text-muted-foreground">Auto-compounding</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">+{(lsANTBalance * 0.00023).toFixed(4)} lsANT</div>
                  <div className="text-sm">~${(lsANTBalance * 0.00023 * 0.85).toFixed(4)}</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isOpen && onClose) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Liquid Staking</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
}

// Simple arrow components for the flow indicators
function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function ArrowUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
