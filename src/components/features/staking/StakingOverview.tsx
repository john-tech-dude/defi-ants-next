'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useStakingData } from '@/hooks/useStakingData';
import { useWallet } from '@solana/wallet-adapter-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Zap, Clock, Lock, BarChart3 } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

export function StakingOverview() {
  const { publicKey } = useWallet();
  const { data: stakingData, isLoading } = useStakingData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Value Locked',
      value: `$${formatNumber(stakingData?.totalStaked || 0, true)}`,
      description: 'Across all staking pools',
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
      change: '+12.5%',
    },
    {
      title: 'Your Staked',
      value: publicKey ? `${formatNumber(stakingData?.userStaked || 0)} ANT` : 'Connect Wallet',
      description: publicKey ? 'Your staked amount' : 'Connect to view',
      icon: <Lock className="w-5 h-5 text-primary" />,
      change: publicKey ? `+${stakingData?.rewardsEarned.toFixed(2)} ANT` : '',
    },
    {
      title: 'Average APY',
      value: `${stakingData?.apy}%`,
      description: 'Current estimated APY',
      icon: <Zap className="w-5 h-5 text-primary" />,
      change: 'Variable',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </span>
                </div>
                {stat.change && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staking Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stakingData?.stakingPools.map((pool) => (
              <div 
                key={pool.id}
                className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <h4 className="font-medium">{pool.name} Staking</h4>
                  <p className="text-sm text-muted-foreground">
                    {pool.name === 'Standard' 
                      ? 'Basic staking with fixed APY' 
                      : pool.name === 'RWA' 
                        ? 'Earn from real-world assets' 
                        : 'Liquid staking with lsANT'}
                  </p>
                </div>
                
                <div className="w-full md:w-1/3 space-y-2 mb-4 md:mb-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">APY</span>
                    <span className="font-medium">{pool.apy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVL</span>
                    <span>${pool.tvl}</span>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 flex justify-end">
                  <Button variant="outline" className="w-full md:w-auto">
                    Stake <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
