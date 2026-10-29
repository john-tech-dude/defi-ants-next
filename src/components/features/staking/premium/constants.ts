// Staking Tiers
export const TIERS = {
  Explorer: {
    minStake: 1000,
    multiplier: 1.0,
    baseApy: '8-12%',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    borderColor: 'border-amber-300',
    benefits: ['Basic staking', 'Jupiter access', 'Governance', 'Basic RWA'],
    icon: '🌟'
  },
  Pioneer: {
    minStake: 10000,
    multiplier: 1.5,
    baseApy: '15-20%',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    borderColor: 'border-orange-300',
    benefits: ['Enhanced rewards', 'Auto-compound', 'NFT staking', 'Premium RWA'],
    icon: '⚡'
  },
  Visionary: {
    minStake: 50000,
    multiplier: 2.0,
    baseApy: '25-35%',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-purple-300',
    benefits: ['Maximum rewards', 'AI optimization', 'Full RWA access', 'Private deals'],
    icon: '👑'
  }
};

// Lock Periods
export const LOCK_PERIODS = {
  Flexible: { days: 0, multiplier: 1.0, apy: '+0%', icon: '🔄' },
  Short: { days: 30, multiplier: 1.2, apy: '+20%', icon: '📅' },
  Medium: { days: 90, multiplier: 1.5, apy: '+50%', icon: '📊' },
  Long: { days: 180, multiplier: 1.8, apy: '+80%', icon: '🎯' },
  Maximum: { days: 365, multiplier: 2.5, apy: '+150%', icon: '💎' }
};

// RWA Assets
export const RWA_ASSETS = [
  { id: 'real-estate', name: 'Real Estate', icon: '🏠', apy: '8.2%', tvl: '$2.4B', risk: 'Medium' },
  { id: 'commodities', name: 'Commodities', icon: '🥇', apy: '6.5%', tvl: '$1.8B', risk: 'Low' },
  { id: 'carbon-credits', name: 'Carbon Credits', icon: '🌱', apy: '15.4%', tvl: '$890M', risk: 'High' },
  { id: 'treasury', name: 'Treasury Bills', icon: '🏛️', apy: '4.8%', tvl: '$5.2B', risk: 'Very Low' },
  { id: 'art', name: 'Art & Collectibles', icon: '🎨', apy: '12.3%', tvl: '$450M', risk: 'High' },
  { id: 'infrastructure', name: 'Infrastructure', icon: '🌉', apy: '9.1%', tvl: '$1.2B', risk: 'Medium' }
];

// DeFi Strategies
export const DEFI_STRATEGIES = [
  { id: 'conservative', name: 'Conservative', risk: 'Low', apy: '8-15%', icon: '🛡️', color: 'from-green-400 to-emerald-500' },
  { id: 'balanced', name: 'Balanced', risk: 'Medium', apy: '15-25%', icon: '⚖️', color: 'from-blue-400 to-cyan-500' },
  { id: 'aggressive', name: 'Aggressive', risk: 'High', apy: '25-45%', icon: '🚀', color: 'from-orange-400 to-red-500' },
  { id: 'ai-optimized', name: 'AI-Optimized', risk: 'Dynamic', apy: '20-60%', icon: '🤖', color: 'from-purple-400 to-pink-500' }
];

// Navigation Tabs
export const TABS = [
  { id: 'overview', name: 'Overview', icon: 'TrendingUp' },
  { id: 'stake', name: 'Stake', icon: 'Coins' },
  { id: 'defi-strategies', name: 'DeFi Strategies', icon: 'BarChart3' },
  { id: 'rwa-farming', name: 'RWA Farming', icon: 'Building' },
  { id: 'advanced-tools', name: 'Tools', icon: 'Bot' },
  { id: 'rewards', name: 'Rewards', icon: 'Award' },
  { id: 'portfolio', name: 'Portfolio', icon: 'PieChart' },
  { id: 'unstake', name: 'Unstake', icon: 'Unlock' }
];

// Initial Staking Data
export const INITIAL_STAKING_DATA = {
  antBalance: 25000,
  stantBalance: 12500,
  stakedAmount: 12500,
  pendingRewards: { sol: 1.2456, ant: 45.8, usdc: 125.30 },
  tierLevel: 'Pioneer',
  lockPeriod: 'Medium',
  lockEndDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  lifetimeRewards: { sol: 15.67, ant: 580.4, usdc: 2250.80 },
  currentApy: 18.5,
  nextTierProgress: 75,
  portfolioValue: 48653.80,
  dayChange: 2.4,
  weekChange: 8.7,
  monthChange: 15.3,
  rwaPositions: [
    { id: 'real-estate', amount: 5000, value: 5240.50, apy: 8.2 },
    { id: 'treasury', amount: 3000, value: 3067.20, apy: 4.8 },
    { id: 'carbon-credits', amount: 2000, value: 2145.80, apy: 15.4 }
  ]
};
