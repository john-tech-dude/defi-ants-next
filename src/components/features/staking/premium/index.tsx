'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Icons
import { 
  Coins, TrendingUp, Clock, Award, Lock, Unlock, Info, Copy, CheckCircle, 
  ArrowUpRight, X, Maximize2, Minimize2, Loader2, AlertTriangle, Zap, 
  Target, Shield, Building, Globe, Wallet, BarChart3, Bot, PieChart, 
  RefreshCw, Users, Home, Gem, Leaf, Factory, Calculator, Rocket, 
  Network, ChevronDown, Star, Activity, LineChart, Gauge, Briefcase
} from 'lucide-react';

// Constants
import { 
  TIERS, 
  LOCK_PERIODS, 
  RWA_ASSETS, 
  DEFI_STRATEGIES, 
  TABS, 
  INITIAL_STAKING_DATA 
} from './constants';

// Components
import { LoadingSpinner } from './components/LoadingSpinner';
import { StatusBadge } from './components/StatusBadge';
import { RiskMeter } from './components/RiskMeter';

// Dynamic Imports for Tab Content
const OverviewTab = dynamic(() => import('./tabs/OverviewTab'), { 
  loading: () => <div className="flex justify-center p-8"><LoadingSpinner size="md" /></div> 
});

const StakeTab = dynamic(() => import('./tabs/StakeTab'), { 
  loading: () => <div className="flex justify-center p-8"><LoadingSpinner size="md" /></div> 
});

interface PremiumStakingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumStakingPanel: React.FC<PremiumStakingPanelProps> = ({ isOpen, onClose }) => {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMinimized, setIsMinimized] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedLockPeriod, setSelectedLockPeriod] = useState('Medium');
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');
  const [selectedRWA, setSelectedRWA] = useState('real-estate');
  const [leverageAmount, setLeverageAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stakingData, setStakingData] = useState(INITIAL_STAKING_DATA);

  // Handlers
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('stANT-contract-address-here');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  const handleStake = useCallback(async () => {
    if (!stakeAmount || parseFloat(stakeAmount) > stakingData.antBalance) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStakingData(prev => ({
        ...prev,
        stakedAmount: prev.stakedAmount + parseFloat(stakeAmount),
        antBalance: prev.antBalance - parseFloat(stakeAmount),
        stantBalance: prev.stantBalance + parseFloat(stakeAmount)
      }));
      setStakeAmount('');
    } catch (err) {
      setError('Failed to stake tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [stakeAmount, stakingData.antBalance]);

  const handleClaimRewards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStakingData(prev => ({
        ...prev,
        pendingRewards: { sol: 0, ant: 0, usdc: 0 },
        lifetimeRewards: {
          sol: prev.lifetimeRewards.sol + prev.pendingRewards.sol,
          ant: prev.lifetimeRewards.ant + prev.pendingRewards.ant,
          usdc: prev.lifetimeRewards.usdc + prev.pendingRewards.usdc
        }
      }));
    } catch (err) {
      setError('Failed to claim rewards. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Live updates
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setStakingData(prev => ({
        ...prev,
        pendingRewards: {
          sol: prev.pendingRewards.sol + 0.001,
          ant: prev.pendingRewards.ant + 0.05,
          usdc: prev.pendingRewards.usdc + 0.12
        },
        portfolioValue: Math.max(0, prev.portfolioValue + (Math.random() - 0.5) * 50),
        dayChange: prev.dayChange + (Math.random() - 0.5) * 0.2
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // Get current tier info
  const getCurrentTier = () => TIERS[stakingData.tierLevel as keyof typeof TIERS];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stakingData={stakingData} currentTier={getCurrentTier()} />;
      case 'stake':
        return (
          <StakeTab 
            stakeAmount={stakeAmount}
            setStakeAmount={setStakeAmount}
            selectedLockPeriod={selectedLockPeriod}
            setSelectedLockPeriod={setSelectedLockPeriod}
            stakingData={stakingData}
            loading={loading}
            error={error}
            onStake={handleStake}
          />
        );
      // Add other tab cases here
      default:
        return (
          <div className="p-6 text-center">
            <div className="text-2xl font-black mb-2">Coming Soon</div>
            <p className="text-gray-600">This feature is under development.</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isMinimized ? 'pointer-events-none' : ''}`}>
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isMinimized ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClose}
      />
      
      <motion.div 
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col z-10 ${isMinimized ? 'translate-y-[calc(100%-60px)]' : ''}`}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black">Premium Staking</h2>
              <div className="flex items-center space-x-2 text-xs">
                <StatusBadge status="active" />
                <StatusBadge status="beta" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
          {TABS.map(tab => {
            const Icon = eval(tab.icon); // Convert string icon name to component
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-500">
              Connected: {connected ? 'Yes' : 'No'}
            </div>
            {connected && publicKey && (
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <span>{`${publicKey.toString().substring(0, 4)}...${publicKey.toString().substring(publicKey.toString().length - 4)}`}</span>
                <button 
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Copy address"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            v1.0.0-beta • Powered by DeFiANT
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumStakingPanel;
