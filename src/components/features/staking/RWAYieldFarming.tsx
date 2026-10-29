'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { Building2, Clock, ArrowUpRight, Info } from 'lucide-react';

interface RWAYieldFarmingProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const RWA_POOLS = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Invest in tokenized real estate properties',
    apy: '18-24%',
    tvl: '5.2M',
    lockup: '90 days',
    risk: 'Medium',
    icon: <Building2 className="w-5 h-5" />,
    details: 'Invest in a diversified portfolio of commercial and residential real estate properties.'
  },
  {
    id: 'private-credit',
    name: 'Private Credit',
    description: 'Earn yield from private lending',
    apy: '22-30%',
    tvl: '3.8M',
    lockup: '180 days',
    risk: 'High',
    icon: <Clock className="w-5 h-5" />,
    details: 'Participate in private credit markets with collateralized debt positions.'
  },
  {
    id: 'revenue-sharing',
    name: 'Revenue Sharing',
    description: 'Share revenue from real-world businesses',
    apy: '15-20%',
    tvl: '2.1M',
    lockup: '365 days',
    risk: 'High',
    icon: <Info className="w-5 h-5" />,
    details: 'Earn a share of revenue from vetted businesses and startups.'
  }
];

export default function RWAYieldFarming({ isOpen = false, onClose, className }: RWAYieldFarmingProps) {
  const [amount, setAmount] = useState('');
  const [activePool, setActivePool] = useState(RWA_POOLS[0]);
  const [userStakes, setUserStakes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();

  // Mock data - replace with actual contract calls
  useEffect(() => {
    if (publicKey) {
      // Fetch user's stakes in RWA pools
      const fetchUserStakes = async () => {
        try {
          // Replace with actual contract calls
          // const stakes = await getUserRWAStakes(publicKey);
          setUserStakes({
            'real-estate': 500,
            'private-credit': 0,
            'revenue-sharing': 0
          });
        } catch (error) {
          console.error('Error fetching RWA stakes:', error);
        }
      };
      
      fetchUserStakes();
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
      // await stakeInRWAPool(publicKey, activePool.id, amount);
      
      toast.success(`Successfully staked in ${activePool.name} pool`);
      setUserStakes(prev => ({
        ...prev,
        [activePool.id]: (prev[activePool.id] || 0) + Number(amount)
      }));
      setAmount('');
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Error staking in RWA pool:', error);
      toast.error('Failed to stake in RWA pool');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async (poolId: string) => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Replace with actual unstaking logic
      // await unstakeFromRWAPool(publicKey, poolId);
      
      toast.success('Successfully unstaked from RWA pool');
      setUserStakes(prev => ({
        ...prev,
        [poolId]: 0
      }));
    } catch (error) {
      console.error('Error unstaking from RWA pool:', error);
      toast.error('Failed to unstake from RWA pool');
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className={className}>
      <Tabs defaultValue={RWA_POOLS[0].id} onValueChange={(value) => {
        const pool = RWA_POOLS.find(p => p.id === value) || RWA_POOLS[0];
        setActivePool(pool);
      }}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {RWA_POOLS.map((pool) => (
            <TabsTrigger key={pool.id} value={pool.id} className="flex flex-col h-auto py-2">
              <div className="flex items-center gap-2">
                {pool.icon}
                {pool.name}
              </div>
              <span className="text-xs font-normal mt-1">{pool.apy} APY</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {RWA_POOLS.map((pool) => (
          <TabsContent key={pool.id} value={pool.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{pool.name} Pool</CardTitle>
                    <CardDescription className="mt-2">{pool.description}</CardDescription>
                  </div>
                  <Badge variant={pool.risk === 'High' ? 'destructive' : 'secondary'}>
                    {pool.risk} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">APY Range</div>
                    <div className="text-xl font-bold">{pool.apy}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">TVL</div>
                    <div className="text-xl font-bold">${pool.tvl}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Lockup</div>
                    <div className="text-xl font-bold">{pool.lockup}</div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {pool.details} This is a {pool.risk.toLowerCase()} risk pool with a {pool.lockup} lockup period.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Stake in {pool.name}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Stake (ANT)</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pr-20 text-lg"
                      />
                      <div className="absolute right-3 top-2.5">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => setAmount('1000')}
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
                  
                  <Button 
                    className="w-full mt-2"
                    size="lg"
                    onClick={handleStake}
                    disabled={isLoading || !publicKey}
                  >
                    {isLoading ? 'Processing...' : `Stake in ${pool.name}`}
                  </Button>
                </div>
                
                {userStakes[pool.id] > 0 && (
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Your Stake</h4>
                      <div className="text-xl font-bold">{userStakes[pool.id]} ANT</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Est. Daily Rewards</div>
                        <div className="font-medium">
                          {(userStakes[pool.id] * 0.0008).toFixed(4)} ANT
                        </div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Est. APY</div>
                        <div className="font-medium">{pool.apy}</div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUnstake(pool.id)}
                      disabled={isLoading}
                    >
                      Unstake All
                    </Button>
                    
                    <div className="mt-3 text-xs text-muted-foreground flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>Funds will be available after {pool.lockup}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">How it works</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Stake ANT tokens to earn yield from real-world assets</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Funds are deployed into {pool.name.toLowerCase()} investments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Earn variable APY based on the performance of the underlying assets</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Withdrawals are subject to the {pool.lockup} lockup period</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button variant="ghost" className="text-sm" size="sm">
                View Pool Analytics <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  if (isOpen && onClose) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>RWA Yield Farming</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
}
