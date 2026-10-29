'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Building, Bot, ArrowRight, ChevronRight, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PremiumButton, GlassCard, GradientText, PremiumHeading } from '@/theme/premium-theme';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/simple-tabs';
import usePremiumTheme from '@/hooks/usePremiumTheme';

interface StakingTierProps {
  name: string;
  icon: React.ReactNode;
  apy: string;
  minStake: string;
  benefits: string[];
  gradient: string;
  isPopular?: boolean;
}

const StakingTier: React.FC<StakingTierProps> = ({
  name,
  icon,
  apy,
  minStake,
  benefits,
  gradient,
  isPopular = false,
}) => {
  const { entranceAnimation } = usePremiumTheme();
  
  return (
    <motion.div
      className={`relative ${entranceAnimation}`}
      whileHover={{ translateY: -8 }}
      transition={{ duration: 0.3 }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="bg-gradient-gold text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      
      <Card 
        variant="premium" 
        className={`p-6 h-full border-t-4 ${gradient}`}
      >
        <div className="flex items-center mb-6">
          <div className={`p-2 rounded-lg ${gradient} mr-3`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-amber-500">{apy}</span>
            <span className="text-gray-400 ml-1">APY</span>
          </div>
          <div className="text-sm text-gray-400">
            Min. Stake: <span className="text-white">{minStake}</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <ChevronRight className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{benefit}</span>
            </div>
          ))}
        </div>
        
        <PremiumButton className="w-full mt-auto">
          Stake Now
        </PremiumButton>
      </Card>
    </motion.div>
  );
};

const StakingPlatformSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('multi-tier');
  const { entranceAnimation } = usePremiumTheme();
  const stakingTiers: StakingTierProps[] = [
    {
      name: "Explorer",
      icon: <Coins className="h-5 w-5 text-white" />,
      apy: "8%",
      minStake: "1,000 ANT",
      benefits: [
        "Basic staking rewards",
        "Community voting rights",
        "Access to Explorer pools",
        "Monthly rewards distribution"
      ],
      gradient: "border-amber-500 from-amber-500/20 to-amber-700/20"
    },
    {
      name: "Pioneer",
      icon: <Building className="h-5 w-5 text-white" />,
      apy: "12%",
      minStake: "10,000 ANT",
      benefits: [
        "Enhanced staking rewards",
        "Priority governance voting",
        "Access to RWA farming pools",
        "Weekly rewards distribution",
        "Reduced platform fees"
      ],
      gradient: "border-blue-500 from-blue-500/20 to-blue-700/20",
      isPopular: true
    },
    {
      name: "Visionary",
      icon: <Bot className="h-5 w-5 text-white" />,
      apy: "18%",
      minStake: "50,000 ANT",
      benefits: [
        "Premium staking rewards",
        "Early access to new features",
        "AI-optimized strategy allocation",
        "Daily rewards distribution",
        "Zero platform fees",
        "Dedicated account manager"
      ],
      gradient: "border-purple-500 from-purple-500/20 to-purple-700/20"
    }
  ];

  return (
    <div className="py-8 md:py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="mb-8">
          <PremiumHeading className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6">
            DeFi ANT Staking Platform
          </PremiumHeading>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Our next-generation staking platform combines DeFi yields, real-world assets, and AI-optimized strategies for maximum returns.
          </p>
        </div>
        <div className="mt-8">
          <span className="inline-flex items-center rounded-md bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-500 ring-1 ring-inset ring-amber-400/30">
            Coming Soon - Q3 2025
          </span>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-8 md:gap-12 mb-12 md:mb-16">
        {/* Multi-Tier Staking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="p-3 rounded-full bg-gradient-gold mb-4">
            <Coins className="h-6 w-6 sm:h-7 sm:w-7 text-gray-900" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Multi-Tier Staking</h3>
          <p className="text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto">
            Choose from Explorer, Pioneer, or Visionary tiers with increasing rewards and benefits based on your stake amount.
          </p>
          <PremiumButton size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
            Stake Now
          </PremiumButton>
        </motion.div>

        {/* Real-World Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center text-center"
        >
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-4">
            <Building className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Real-World Assets</h3>
          <p className="text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto">
            Access tokenized real estate, commodities, carbon credits, and more through our RWA farming pools.
          </p>
          <PremiumButton size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
            Start Farming
          </PremiumButton>
        </motion.div>

        {/* AI-Optimized Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 mb-4">
            <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">AI-Optimized Strategies</h3>
          <p className="text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto">
            Our AI constantly analyzes market conditions to adjust your portfolio for optimal risk-adjusted returns.
          </p>
          <PremiumButton size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
            Explore Strategies
          </PremiumButton>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-12 md:mt-16 flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl text-center"
        style={{ background: 'linear-gradient(to right, rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.4))' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-green-500/10 mr-3">
            <Shield className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Secure Staking Protocol</h3>
        </div>
        <p className="text-gray-300 mb-0">
          Our staking platform is audited by leading security firms
        </p>
      </motion.div>
    </div>
  );
};

export default StakingPlatformSection;
