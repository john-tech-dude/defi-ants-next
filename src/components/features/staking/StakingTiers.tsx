import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

// UI Components
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Types
import { StakingGoal, STAKING_GOALS } from '../types';

interface StakingTiersProps {
  selectedGoal: StakingGoal | null;
  onSelectGoal: (goal: StakingGoal) => void;
}

export const StakingTiers = ({
  selectedGoal,
  onSelectGoal,
}: StakingTiersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Staking Tiers</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
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
        {isExpanded && (
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
                    "relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
                    selectedGoal?.id === goal.id && "ring-2 ring-primary"
                  )}
                  onClick={() => onSelectGoal(goal)}
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
  );
};
