import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Gem, Info, Lock, Rocket, Shield, Star } from 'lucide-react';
import { 
  PremiumCard, 
  GlassCard, 
  PremiumHeading, 
  PremiumButton, 
  GlassButton,
  GradientText,
  PremiumGradientBorder,
  HoverScaleWrapper
} from '@/theme/premium-theme';
import dynamic from 'next/dynamic';

import { Tabs } from '@/components/ui/simple-tabs';

// Destructure the Tabs components from the Tabs namespace
const { List: TabsList, Trigger: TabsTrigger, Content: TabsContent } = Tabs;
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Input from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import usePremiumTheme from '@/hooks/usePremiumTheme';

const PremiumThemeShowcase: React.FC = () => {
  const { accent, glassMedium, hoverAnimation, entranceAnimation } = usePremiumTheme({
    accentColor: 'gold'
  });
  
  const [activeTab, setActiveTab] = useState('cards');
  
  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <PremiumHeading className="text-4xl mb-4">Premium Dark Theme</PremiumHeading>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Enhanced UI components with premium styling, animations, and glassmorphism effects
          for a sophisticated cryptocurrency platform experience.
        </p>
      </div>
      
      <Tabs 
        defaultValue="cards" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList variant="premium" className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger variant="premium" value="cards" className="flex-1">Cards</TabsTrigger>
          <TabsTrigger variant="premium" value="buttons" className="flex-1">Buttons</TabsTrigger>
          <TabsTrigger variant="premium" value="inputs" className="flex-1">Inputs</TabsTrigger>
          <TabsTrigger variant="premium" value="tooltips" className="flex-1">Tooltips</TabsTrigger>
        </TabsList>
        
        <TabsContent variant="premium" value="cards" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Premium Card */}
            <HoverScaleWrapper>
              <PremiumCard className="p-6 h-full">
                <div className="flex items-center mb-4">
                  <Gem className="h-6 w-6 text-amber-500 mr-2" />
                  <h3 className="text-xl font-semibold text-white">Premium Card</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Enhanced card with gradient background, premium border, and subtle shadow effects.
                </p>
                <div className="mt-auto pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-500 font-medium">12.5% APY</span>
                    <div className="flex items-center text-gray-400">
                      <Lock className="h-4 w-4 mr-1" />
                      <span className="text-sm">Secure</span>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </HoverScaleWrapper>
            
            {/* Glass Card */}
            <HoverScaleWrapper>
              <GlassCard className="p-6 h-full">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400 mr-2" />
                  <h3 className="text-xl font-semibold text-white">Glass Card</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Modern glassmorphism effect with backdrop blur, transparent background, and subtle border.
                </p>
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-medium">Real-world Assets</span>
                    <div className="flex items-center text-gray-400">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-sm">Verified</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </HoverScaleWrapper>
            
            {/* Gradient Border Card */}
            <HoverScaleWrapper>
              <PremiumGradientBorder className="h-full">
                <div className="flex items-center mb-4">
                  <Star className="h-6 w-6 text-amber-500 mr-2" />
                  <h3 className="text-xl font-semibold text-white">Gradient Border</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Sophisticated card with animated gradient border effect for highlighting important content.
                </p>
                <div className="mt-auto pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-500 font-medium">Featured</span>
                    <div className="flex items-center text-gray-400">
                      <Rocket className="h-4 w-4 mr-1" />
                      <span className="text-sm">Trending</span>
                    </div>
                  </div>
                </div>
              </PremiumGradientBorder>
            </HoverScaleWrapper>
          </div>
        </TabsContent>
        
        <TabsContent variant="premium" value="buttons" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Premium Buttons</h3>
              <div className="space-y-4">
                <PremiumButton className="w-full">
                  Connect Wallet
                </PremiumButton>
                
                <PremiumButton className="w-full flex items-center justify-center">
                  <span>Stake ANT Tokens</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </PremiumButton>
                
                <PremiumButton className="w-full" disabled>
                  Disabled State
                </PremiumButton>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Glass Buttons</h3>
              <div className="space-y-4">
                <GlassButton className="w-full">
                  View Dashboard
                </GlassButton>
                
                <GlassButton className="w-full flex items-center justify-center">
                  <span>Explore Assets</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </GlassButton>
                
                <GlassButton className="w-full" disabled>
                  Disabled State
                </GlassButton>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent variant="premium" value="inputs" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Premium Inputs</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Wallet Address</label>
                  <Input 
                    variant="premium" 
                    placeholder="0x000...000" 
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Amount to Stake</label>
                  <Input 
                    variant="premium" 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Lock Period (Days)</label>
                  <Input 
                    variant="premium" 
                    type="number" 
                    placeholder="30" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Glass Inputs</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Email Address</label>
                  <Input 
                    variant="glass" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">API Key</label>
                  <Input 
                    variant="glass" 
                    type="password" 
                    placeholder="Enter your API key" 
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Search Assets</label>
                  <Input 
                    variant="glass" 
                    placeholder="Search..." 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent variant="premium" value="tooltips" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Premium Tooltips</h3>
              <div className="flex flex-wrap gap-6 justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full bg-gray-800 p-3 hover:bg-gray-700 transition-colors">
                        <Info className="h-5 w-5 text-amber-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent variant="premium" side="top" className="w-64">
                      <div>
                        <h4 className="font-semibold text-amber-400 mb-2 flex items-center">
                          <Gem className="h-4 w-4 mr-2" />
                          Premium Staking
                        </h4>
                        <p className="text-gray-200 text-sm">
                          Stake your ANT tokens to earn up to 12.5% APY with our premium staking program.
                          Minimum lock period of 30 days required.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full bg-gray-800 p-3 hover:bg-gray-700 transition-colors">
                        <Shield className="h-5 w-5 text-blue-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent variant="premium" side="top" className="w-64">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Security Features
                        </h4>
                        <p className="text-gray-200 text-sm">
                          All transactions are secured with military-grade encryption and multi-signature verification.
                          Your assets are protected by our advanced security protocols.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Glass Tooltips</h3>
              <div className="flex flex-wrap gap-6 justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full bg-gray-800 p-3 hover:bg-gray-700 transition-colors">
                        <Rocket className="h-5 w-5 text-purple-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent variant="glass" side="bottom" className="w-64">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2 flex items-center">
                          <Rocket className="h-4 w-4 mr-2" />
                          AI Trading Strategies
                        </h4>
                        <p className="text-gray-200 text-sm">
                          Our AI-powered trading algorithms analyze market trends and execute trades
                          with precision timing for optimal returns.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full bg-gray-800 p-3 hover:bg-gray-700 transition-colors">
                        <Star className="h-5 w-5 text-amber-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent variant="glass" side="bottom" className="w-64">
                      <div>
                        <h4 className="font-semibold text-amber-500 mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          ANT Ambassador Program
                        </h4>
                        <p className="text-gray-200 text-sm">
                          Join our Ambassador Program to earn rewards for promoting ANT tokens
                          and helping grow our community.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PremiumThemeShowcase;
