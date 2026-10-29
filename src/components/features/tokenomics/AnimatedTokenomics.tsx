'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { createTransition } from '@/lib/animations';
import {
  Zap,
  Shield,
  Coins,
  Users,
  ArrowRight,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import Button from "@/components/ui/button";
import { cn } from '@/lib/utils';

// Types
interface TokenAllocation {
  name: string;
  percentage: number;
  color: string;
  gradient: string;
  description: string;
}

interface TokenUtility {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

// Tokenomics data - updated with modern vesting info
const TOKEN_ALLOCATIONS: TokenAllocation[] = [
  {
    name: 'Community & Ecosystem',
    percentage: 35,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    description: '8% at launch, 48-month linear vesting'
  },
  {
    name: 'Liquidity',
    percentage: 25,
    color: '#10B981',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Fully unlocked at launch for trading'
  },
  {
    name: 'Staking Rewards',
    percentage: 20,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-violet-600',
    description: 'Distributed over 4 years to stakers'
  },
  {
    name: 'Team & Advisors',
    percentage: 12,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-600',
    description: '12-month cliff, 36-month linear vesting'
  },
  {
    name: 'Marketing & Partnerships',
    percentage: 8,
    color: '#EC4899',
    gradient: 'from-pink-500 to-pink-600',
    description: '5% at launch, 24-month linear vesting'
  }
];

const TOKEN_UTILITIES: TokenUtility[] = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Fast Transactions',
    description: 'Low fees and instant settlement on Solana',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Governance',
    description: 'Vote on protocol upgrades and proposals',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: 'Staking Rewards',
    description: 'Earn passive income by staking your tokens',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Community Access',
    description: 'Exclusive benefits and early access to features',
    gradient: 'from-amber-500 to-orange-500',
  },
];

// Modern Pie Chart with better animations
const AnimatedPieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full h-[350px] md:h-[450px] lg:h-[500px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={130}
            paddingAngle={4}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            animationBegin={isInView ? 0 : undefined}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={isInView}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="none"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: activeIndex === null || activeIndex === index ? 1 : 0.6,
                  transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center',
                }}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
              padding: '12px 16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
            itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

const AnimatedTokenAllocation = ({
  allocation,
  index,
  isActive,
  onClick
}: {
  allocation: TokenAllocation,
  index: number,
  isActive: boolean,
  onClick: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const variants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: createTransition(0.6, [0.25, 0.1, 0.25, 1], index * 0.1)
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={cn(
        'p-4 rounded-xl cursor-pointer transition-all duration-300',
        'border border-gray-200 dark:border-gray-700',
        'hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg',
        isActive
          ? 'scale-[1.02] shadow-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700'
          : 'bg-white dark:bg-gray-800/50 hover:scale-[1.01]',
        'relative overflow-hidden group',
        'transform-gpu'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              allocation.gradient.replace('from-', 'from-').replace('to-', 'to-')
            )}
          />
          <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
            {allocation.name}
          </h3>
        </div>
        <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
          {allocation.percentage}%
        </span>
      </div>
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {allocation.description}
      </p>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          layoutId="activeIndicator"
        />
      )}
    </motion.div>
  );
};

// Modern utility card with clean design
const TokenUtilityCard = ({
  utility,
  index
}: {
  utility: TokenUtility,
  index: number
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl transition-all duration-300 group"
    >
      <div
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
          'bg-gradient-to-br',
          utility.gradient,
          'text-white shadow-lg group-hover:scale-110 transition-transform duration-300'
        )}
      >
        {utility.icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {utility.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {utility.description}
      </p>
      <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
        Learn more
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

// Main component with modern design
const AnimatedTokenomics = () => {
  const [activeAllocation, setActiveAllocation] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prepare data for the pie chart
  const chartData = TOKEN_ALLOCATIONS.map(item => ({
    name: item.name,
    value: item.percentage,
    color: item.color,
  }));

  if (!mounted) {
    return (
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full mx-auto"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="tokenomics"
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/5 via-transparent to-transparent opacity-30" />
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)] opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-500/10 mb-6">
              <PieChartIcon className="w-5 h-5 mr-2 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Tokenomics</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Token Distribution
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A fair and sustainable token distribution designed for long-term growth with transparent vesting schedules
            </p>
          </motion.div>
        </div>

        {/* Token Allocation Section */}
        <div className="mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <AnimatedPieChart data={chartData} />
              </div>
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
                    Allocation Breakdown
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {TOKEN_ALLOCATIONS.map((allocation, index) => (
                      <AnimatedTokenAllocation
                        key={allocation.name}
                        allocation={allocation}
                        index={index}
                        isActive={activeAllocation === index}
                        onClick={() => setActiveAllocation(index)}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Utilities Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Token Utilities
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Powering the DeFiANT ecosystem with multiple use cases
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOKEN_UTILITIES.map((utility, index) => (
            <TokenUtilityCard
              key={utility.title}
              utility={utility}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AnimatedTokenomics;
