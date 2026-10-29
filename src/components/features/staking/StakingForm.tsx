import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowDown, ArrowUp, Info, Zap, Clock, Lock, BarChart3 } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/formatters';

// Types
import { FormData } from '../types';

interface StakingFormProps {
  type: 'stake' | 'unstake';
  formData: FormData;
  maxAmount: number;
  isLoading: boolean;
  isConnected: boolean;
  apy?: number;
  errors: { amount?: string };
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSliderChange: (value: number[]) => void;
  onMaxClick: () => void;
  onPercentageChange?: (value: number) => void;
}

export const StakingForm = ({
  type,
  formData,
  maxAmount,
  isLoading,
  isConnected,
  apy = 15.5,
  errors,
  onSubmit,
  onInputChange,
  onSliderChange,
  onMaxClick,
  onPercentageChange,
}: StakingFormProps) => {
  const [estimatedRewards, setEstimatedRewards] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate estimated rewards based on amount and APY
  useEffect(() => {
    if (formData.amount && !isNaN(Number(formData.amount)) && apy) {
      const amountNum = Number(formData.amount);
      const dailyRate = apy / 100 / 365;
      setEstimatedRewards(amountNum * dailyRate);
    } else {
      setEstimatedRewards(0);
    }
  }, [formData.amount, apy]);

  // Handle percentage change for the slider
  const handlePercentageSliderChange = (value: number[]) => {
    const percent = value[0];
    setPercentage(percent);
    if (onPercentageChange) onPercentageChange(percent);
  };

  // Quick percentage buttons
  const percentageOptions = [25, 50, 75, 100];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          {type === 'stake' ? (
            <ArrowDown className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowUp className="h-5 w-5 text-red-500" />
          )}
          {type === 'stake' ? 'Stake' : 'Unstake'} ANT Tokens
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={onSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Amount to {type}</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Available: {formatNumber(maxAmount)} ANT
                </span>
                <button
                  type="button"
                  onClick={onMaxClick}
                  className="text-sm text-primary hover:underline"
                  disabled={!isConnected}
                >
                  Max
                </button>
              </div>
            </div>
            
            <div className="relative">
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={onInputChange}
                className={cn(
                  "text-lg h-14 pr-24",
                  errors.amount && "border-red-500 focus-visible:ring-red-500"
                )}
                disabled={!isConnected || isLoading}
                step="any"
                min="0"
                max={maxAmount}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">ANT</span>
              </div>
            </div>
            
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
            
            {/* Percentage Slider */}
            <div className="pt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>0%</span>
                <div className="flex gap-1">
                  {percentageOptions.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const value = (maxAmount * p) / 100;
                        const event = {
                          target: { name: 'amount', value: value.toString() }
                        } as React.ChangeEvent<HTMLInputElement>;
                        onInputChange(event);
                        setPercentage(p);
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded hover:bg-accent",
                        percentage >= p && "bg-primary/10 text-primary"
                      )}
                      disabled={!isConnected || isLoading}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
              <Slider
                value={[percentage]}
                onValueChange={handlePercentageSliderChange}
                max={100}
                step={1}
                className="w-full"
                disabled={!isConnected || isLoading}
              />
            </div>
          </div>
          
          {/* Estimated Rewards (Staking only) */}
          {type === 'stake' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Daily Rewards</span>
                <span className="font-medium">
                  {estimatedRewards > 0 ? formatNumber(estimatedRewards, 6) : '0'} ANT
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Yearly Rewards</span>
                <span className="font-medium">
                  {estimatedRewards > 0 ? formatNumber(estimatedRewards * 365, 4) : '0'} ANT
                </span>
              </div>
            </div>
          )}
          
          {/* Staking Duration (Staking only) */}
          {type === 'stake' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label>Staking Duration</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formData.duration} days</span>
                </div>
              </div>
              <div className="relative w-full">
                <Slider
                  min={7}
                  max={365}
                  step={1}
                  value={[formData.duration]}
                  onValueChange={onSliderChange}
                  className="w-full"
                  disabled={!isConnected || isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>7 days</span>
                  <span>1 year</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3 flex-shrink-0" />
                <span>Longer staking periods may qualify for bonus rewards</span>
              </div>
            </div>
          )}
          
          {/* Unstaking Info */}
          {type === 'unstake' && (
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <p className="font-medium">Unstaking Notice</p>
                  <p className="text-muted-foreground">
                    Unstaked tokens will be subject to a 14-day unbonding period before they can be withdrawn.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-6">
          <Button 
            type="submit" 
            className="w-full h-12 text-base relative overflow-hidden"
            disabled={!isConnected || isLoading || !formData.amount || Number(formData.amount) <= 0}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence>
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center w-full"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </motion.div>
              ) : !isConnected ? (
                <motion.span
                  key="connect-wallet"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Connect Wallet
                </motion.span>
              ) : (
                <motion.span
                  key="action"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {type === 'stake' ? 'Stake' : 'Unstake'} {formData.amount || ''} ANT
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Animated background effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Button>
        </CardFooter>
      </form>
      
      {/* APY Info */}
      {type === 'stake' && (
        <div className="border-t p-4 bg-muted/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated APY</span>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{apy}%</span>
              <Badge variant="outline" className="text-xs">
                {formData.duration >= 180 ? 'Long-term' : 'Standard'} Bonus
              </Badge>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
