'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Award,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  BarChart3,
  Zap,
  Clock,
  ChevronRight,
  Info,
  AlertTriangle
} from 'lucide-react';

// UI Components
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/simple-tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Progress from '@/components/ui/progress';
import Slider from '@/components/ui/slider';
import Skeleton from '@/components/ui/Skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useToast from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Types
import { StakingStats, TransactionStatus, TxStatus } from './staking/types';

export interface StakingGoal {
  id: string;
  name: string;
  target: number;
  rewardMultiplier: number;
  icon?: React.ReactNode;
  color?: string;
  apy?: number;
}



interface FormData {
  amount: string;
  duration: number;
}

// Constants
const STAKING_GOALS: StakingGoal[] = [
  { 
    id: 'bronze', 
    name: 'Bronze', 
    target: 1000, 
    rewardMultiplier: 1,
    color: 'from-amber-600 to-amber-800', 
    apy: 5 
  },
  { 
    id: 'silver', 
    name: 'Silver', 
    target: 5000, 
    rewardMultiplier: 1.5,
    color: 'from-gray-400 to-gray-600', 
    apy: 7.5 
  },
  { 
    id: 'gold', 
    name: 'Gold', 
    target: 10000, 
    rewardMultiplier: 2,
    color: 'from-yellow-400 to-amber-500', 
    apy: 10 
  },
  { 
    id: 'platinum', 
    name: 'Platinum', 
    target: 25000, 
    rewardMultiplier: 2.5,
    color: 'from-blue-400 to-indigo-600', 
    apy: 12.5 
  },
  { 
    id: 'diamond', 
    name: 'Diamond', 
    target: 50000, 
    rewardMultiplier: 3,
    color: 'from-purple-400 to-pink-600', 
    apy: 15 
  },
];

export interface StakingTabProps {
  publicKey?: string;
  onStake: (amount: number) => Promise<void>;
  onUnstake: (amount: number) => Promise<void>;
  onClaim: () => Promise<void>;
  userBalance?: number;
  stakedAmount?: number;
  rewards?: number;
  apy?: number;
  totalStaked?: number;
  isLoading?: boolean;
  error?: string | null;
}

export function StakingTab({ 
  publicKey,
  onStake, 
  onUnstake, 
  onClaim, 
  userBalance = 0, 
  stakedAmount = 0, 
  rewards = 0, 
  apy = 0, 
  totalStaked = 0, 
  isLoading: propIsLoading = false, 
  error: propError = null 
}: StakingTabProps) {
  const { toast } = useToast();
  const wallet = useWallet();
  const { theme } = useTheme();
  
  // State
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
  const [formData, setFormData] = useState<FormData>({ amount: '', duration: 30 });
  const [txStatus, setTxStatus] = useState<TransactionStatus>({ status: 'idle', message: '' });
  const [selectedGoal, setSelectedGoal] = useState<StakingGoal | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showGoals, setShowGoals] = useState(true);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [error, setError] = useState<string | null>(propError);
  const [errors, setErrors] = useState<{ amount?: string }>({});
  
  const [stakingStats, setStakingStats] = useState<StakingStats>(() => ({
    isLoading: propIsLoading,
    totalStaked,
    userStaked: stakedAmount,
    userRewards: rewards,
    nextTier: 'Silver',
    progress: Math.min(100, (stakedAmount / 1000) * 100), // Example progress calculation
    daysRemaining: 30, // Example value
    apy,
    nextRewardDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Example: 1 day from now
    estimatedApy: apy * 1.2, // Example: 20% more than base APY
    selectedTier: {
      id: 'bronze',
      name: 'Bronze',
      apy: 10,
      minStake: 100,
      lockPeriod: 30,
      color: '#cd7f32',
      benefits: ['Basic rewards', 'Early access to features']
    },
    isAutoCompound: false,
    nextCompoundDate: new Date(Date.now() + 60 * 60 * 1000), // Example: 1 hour from now
    dailyReward: rewards / 30 // Example: monthly rewards divided by 30
  }));

  // Use prop publicKey if provided, otherwise use wallet publicKey
  const effectivePublicKey = publicKey || wallet.publicKey?.toString();
  const connected = wallet.connected;
  
  // Handle wallet connection
  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      await wallet.connect();
      toast?.({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully.',
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast?.({
        title: 'Connection Error',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  }, [wallet, toast]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({
      ...prev,
      duration: value[0]
    }));
  };

  // Handle max button click
  const handleMaxClick = () => {
    const maxAmount = activeTab === 'stake' ? userBalance : stakedAmount;
    setFormData(prev => ({
      ...prev,
      amount: maxAmount.toString()
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { amount?: string } = {};
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (activeTab === 'stake' && amount > (userBalance || 0)) {
      newErrors.amount = 'Insufficient balance';
    } else if (activeTab === 'unstake' && amount > (stakedAmount || 0)) {
      newErrors.amount = 'Insufficient staked amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const amount = parseFloat(formData.amount);
    setIsLoading(true);
    setTxStatus({ status: 'pending', message: 'Processing transaction...' });
    
    try {
      if (activeTab === 'stake') {
        await onStake(amount);
      } else {
        await onUnstake(amount);
      }
      
      setTxStatus({
        status: 'success',
        message: `${activeTab === 'stake' ? 'Stake' : 'Unstake'} successful!`,
      });
      
      // Reset form
      setFormData(prev => ({ ...prev, amount: '' }));
      
      toast?.({
        title: `${activeTab === 'stake' ? 'Stake' : 'Unstake'} Successful`,
        description: `You have successfully ${activeTab === 'stake' ? 'staked' : 'unstaked'} ${amount} tokens.`,
      });
    } catch (error) {
      console.error(`${activeTab === 'stake' ? 'Stake' : 'Unstake'} error:`, error);
      setTxStatus({
        status: 'error',
        message: `${activeTab === 'stake' ? 'Stake' : 'Unstake'} failed. Please try again.`,
      });
      
      toast?.({
        title: 'Error',
        description: `${activeTab === 'stake' ? 'Stake' : 'Unstake'} failed. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle claim rewards
  const handleClaimRewards = async () => {
    if (rewards <= 0) return;
    
    setIsLoading(true);
    setTxStatus({ status: 'pending', message: 'Claiming rewards...' });
    
    try {
      await onClaim();
      
      setTxStatus({
        status: 'success',
        message: 'Rewards claimed successfully!',
      });
      
      toast?.({
        title: 'Rewards Claimed',
        description: `You have successfully claimed ${rewards} tokens.`,
      });
    } catch (error) {
      console.error('Claim rewards error:', error);
      setTxStatus({
        status: 'error',
        message: 'Failed to claim rewards. Please try again.',
      });
      
      toast?.({
        title: 'Error',
        description: 'Failed to claim rewards. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const tabContentVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  // Status message component
  const StatusMessage = useCallback(() => {
    if (txStatus.status === 'idle') return null;
    
    type StatusConfig = {
      icon: React.ReactNode;
      bg: string;
      text: string;
    };

    const statusConfigs: Record<Exclude<TxStatus, 'idle'>, StatusConfig> = {
      pending: { 
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
      },
      success: { 
        icon: <CheckCircle className="h-4 w-4" />,
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
      },
      error: { 
        icon: <XCircle className="h-4 w-4" />,
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
      },
    };
    
    const status = txStatus.status as Exclude<TxStatus, 'idle'>;
    const statusConfig = statusConfigs[status];
    
    if (!statusConfig) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-3 rounded-lg ${statusConfig.bg} mb-6 flex items-start`}
      >
        <span className={`${statusConfig.text} mr-2`}>
          {statusConfig.icon}
        </span>
        <p className="text-sm">{txStatus.message}</p>
        {txStatus.txHash && (
          <a
            href={`https://explorer.solana.com/tx/${txStatus.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-400 hover:underline flex items-center"
          >
            <span>View</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </motion.div>
    );
  }, [txStatus]);

  // Calculate user's share of the pool
  const userShare = useMemo(() => {
    if (!totalStaked) return 0;
    return ((stakedAmount || 0) / totalStaked) * 100;
  }, [stakedAmount, totalStaked]);
  
  // Calculate estimated daily rewards
  const dailyReward = useMemo(() => {
    return ((stakedAmount || 0) * apy) / 36500; // APY / 365 days / 100 for percentage
  }, [stakedAmount, apy]);

  // Update staking stats when props change
  useEffect(() => {
    if (stakedAmount !== undefined || totalStaked !== undefined || apy !== undefined) {
      setStakingStats((prev: any) => ({
        ...prev,
        isLoading: false,
        totalStaked: totalStaked ?? 0,
        userStaked: stakedAmount ?? 0,
        userRewards: rewards ?? 0,
        nextTier: stakedAmount && stakedAmount >= 5000 ? 'Gold' : 
                 stakedAmount && stakedAmount >= 2500 ? 'Silver' : 'Bronze',
        progress: Math.min(100, ((stakedAmount || 0) / 5000) * 100), // Progress to next tier
        daysRemaining: 30 - (new Date().getDate() % 30), // Days until end of month
        apy: apy ?? 0,
        nextRewardDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        estimatedApy: apy ? apy * 1.1 : 0 // 10% boost for estimation
      }));
    }
  }, [stakedAmount, totalStaked, apy, rewards]);

  // Update error state when propError changes
  useEffect(() => {
    setError(propError);
  }, [propError]);

  // Update loading state when propIsLoading changes
  useEffect(() => {
    setIsLoading(propIsLoading);
  }, [propIsLoading]);

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      <StatusMessage />
      
      {/* Staking Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value: string) => setActiveTab(value as 'stake' | 'unstake')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stake">Stake</TabsTrigger>
          <TabsTrigger value="unstake">Unstake</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stake">
          <AnimatePresence mode="wait">
            <motion.div
              key="stake-form"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Stake Tokens</CardTitle>
                  <CardDescription>
                    {activeTab === 'stake' 
                      ? 'Stake your tokens to start earning rewards.'
                      : 'Unstake your tokens to withdraw them from the staking pool.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="amount">Amount</Label>
                        <button
                          type="button"
                          onClick={handleMaxClick}
                          className="text-sm text-blue-500 hover:text-blue-400"
                        >
                          Max: {activeTab === 'stake' ? userBalance.toLocaleString() : stakedAmount.toLocaleString()}
                        </button>
                      </div>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={cn("text-lg py-6", errors.amount && "border-red-500")}
                      />
                      {errors.amount && (
                        <p className="text-sm text-red-500">{errors.amount}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Staking Duration: {formData.duration} days</Label>
                      </div>
                      <Slider
                        min={7}
                        max={365}
                        step={1}
                        value={[formData.duration]}
                        onValueChange={handleSliderChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>7 days</span>
                        <span>1 year</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg"
                      disabled={isLoading || !connected}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `${activeTab === 'stake' ? 'Stake' : 'Unstake'} Tokens`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="unstake">
          <AnimatePresence mode="wait">
            <motion.div
              key="unstake-form"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Unstake Tokens</CardTitle>
                  <CardDescription>
                    Unstake your tokens to withdraw them from the staking pool.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="amount">Amount</Label>
                        <button
                          type="button"
                          onClick={handleMaxClick}
                          className="text-sm text-blue-500 hover:text-blue-400"
                        >
                          Max: {stakedAmount.toLocaleString()}
                        </button>
                      </div>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={cn("text-lg py-6", errors.amount && "border-red-500")}
                      />
                      {errors.amount && (
                        <p className="text-sm text-red-500">{errors.amount}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg"
                      disabled={isLoading || !connected}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Unstake Tokens'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
      
      {/* Staking Stats */}
      {stakingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stakingStats.totalStaked.toLocaleString()}
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
                {stakingStats.userStaked.toLocaleString()}
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
                {stakingStats.apy.toFixed(2)}%
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
                {stakingStats.userRewards.toFixed(2)}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {stakingStats.daysRemaining} days remaining
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={handleClaimRewards}
                  disabled={stakingStats.userRewards <= 0 || isLoading}
                >
                  Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Staking Goals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Staking Tiers</h3>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setShowGoals(!showGoals)}
          >
            {showGoals ? (
              <>
                Hide Tiers
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show Tiers
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        <AnimatePresence>
          {showGoals && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {STAKING_GOALS.map((goal) => (
                  <Card 
                    key={goal.id}
                    className={cn(
                      "relative overflow-hidden transition-all hover:shadow-lg",
                      selectedGoal?.id === goal.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div 
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-10",
                        goal.color
                      )}
                    />
                    <CardHeader className="relative">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <CardDescription>
                        {goal.target.toLocaleString()} tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-2xl font-bold">
                        {goal.apy}% APY
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.rewardMultiplier}x rewards
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default StakingTab;
