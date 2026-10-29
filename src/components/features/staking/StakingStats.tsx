import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart3, Zap, TrendingUp, Clock } from 'lucide-react';

// Types
import { StakingStats as StakingStatsType } from '../types';

interface StakingStatsProps {
  stats: StakingStatsType;
  userShare: number;
  dailyReward: number;
  isLoading: boolean;
  onClaim: () => void;
}

export const StakingStats = ({
  stats,
  userShare,
  dailyReward,
  isLoading,
  onClaim,
}: StakingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalStaked.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Total value locked</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Stake</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.userStaked.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {userShare.toFixed(2)}% of pool
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">APY</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.apy.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            ~{dailyReward.toFixed(2)} tokens/day
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Reward</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.userRewards.toFixed(2)}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {stats.daysRemaining} days remaining
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={onClaim}
              disabled={stats.userRewards <= 0 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : 'Claim'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
