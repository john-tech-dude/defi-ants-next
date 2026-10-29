import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Building, Bot, CheckCircle } from 'lucide-react';

interface OverviewTabProps {
  stakingData: {
    stakedAmount: number;
    currentApy: number;
    dayChange: number;
    weekChange: number;
    monthChange: number;
    portfolioValue: number;
    rwaPositions: Array<{ id: string; amount: number; value: number; apy: number }>;
  };
  currentTier: {
    icon: string;
    multiplier: number;
    baseApy: string;
    bgColor: string;
    borderColor: string;
    benefits: string[];
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stakingData, currentTier }) => {
  const stats = [
    { 
      icon: Coins, 
      label: 'Total Staked', 
      value: stakingData.stakedAmount.toLocaleString(), 
      subtitle: `$${(stakingData.stakedAmount * 0.0325).toFixed(2)}`, 
      color: 'from-green-400 to-emerald-500' 
    },
    { 
      icon: TrendingUp, 
      label: 'Portfolio APY', 
      value: `${stakingData.currentApy}%`, 
      subtitle: 'AI-Optimized', 
      color: 'from-blue-400 to-cyan-500' 
    },
    { 
      icon: Building, 
      label: 'RWA Exposure', 
      value: '35%', 
      subtitle: `${stakingData.rwaPositions.length} Assets`, 
      color: 'from-purple-400 to-pink-500' 
    },
    { 
      icon: Bot, 
      label: 'AI Score', 
      value: '8.7/10', 
      subtitle: 'Optimizing', 
      color: 'from-orange-400 to-red-500' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <motion.div
        className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-black text-gray-800">Total Portfolio Value</h3>
            <p className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ${stakingData.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-black ${stakingData.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stakingData.dayChange >= 0 ? '+' : ''}{stakingData.dayChange.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 font-bold">24h Change</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-sm font-bold text-gray-600">7d Change</div>
            <div className="text-lg font-black text-blue-600">+{stakingData.weekChange}%</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-sm font-bold text-gray-600">30d Change</div>
            <div className="text-lg font-black text-green-600">+{stakingData.monthChange}%</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-sm font-bold text-gray-600">Risk Score</div>
            <div className="text-lg font-black text-orange-600">6.8/10</div>
          </div>
        </div>
      </motion.div>

      {/* Tier Progress */}
      <motion.div
        className={`p-6 rounded-xl border-2 ${currentTier.bgColor} ${currentTier.borderColor} shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{currentTier.icon}</div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">Pioneer Tier</h3>
              <p className="text-sm font-bold text-gray-600">Multiplier: {currentTier.multiplier}x</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm shadow-md`}>
            {currentTier.baseApy}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {currentTier.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="p-4 rounded-xl border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="w-5 h-5 text-gray-700" />
                <span className="text-xs font-black text-gray-700 uppercase">{stat.label}</span>
              </div>
              <div className={`text-xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-xs font-bold text-gray-600">{stat.subtitle}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewTab;
