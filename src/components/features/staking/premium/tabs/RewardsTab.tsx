import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Zap, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  Copy, 
  ExternalLink, 
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info
} from 'lucide-react';

interface RewardToken {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  apy: string;
  icon: string;
  canClaim: boolean;
}

interface RewardsTabProps {
  pendingRewards: {
    sol: number;
    ant: number;
    usdc: number;
    [key: string]: number;
  };
  lifetimeRewards: {
    sol: number;
    ant: number;
    usdc: number;
    [key: string]: number;
  };
  onClaimRewards: (tokenSymbols: string[]) => Promise<void>;
  loading: boolean;
}

const RewardsTab: React.FC<RewardsTabProps> = ({
  pendingRewards,
  lifetimeRewards,
  onClaimRewards,
  loading
}) => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [expandedToken, setExpandedToken] = useState<string | null>(null);
  const [claimHistory, setClaimHistory] = useState<Array<{
    id: string;
    date: Date;
    tokens: { symbol: string; amount: number }[];
    txHash: string;
  }>>([]);

  // Mock claim history - in a real app, this would come from an API
  useEffect(() => {
    // Simulate loading claim history
    const mockHistory = [
      {
        id: '1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        tokens: [
          { symbol: 'ANT', amount: 10.5 },
          { symbol: 'SOL', amount: 2.3 }
        ],
        txHash: '5nXJ...8h2k'
      },
      {
        id: '2',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        tokens: [
          { symbol: 'ANT', amount: 8.2 },
          { symbol: 'USDC', amount: 15.75 }
        ],
        txHash: '9mY4...3pL7'
      }
    ];
    
    setClaimHistory(mockHistory);
  }, []);

  const tokens: RewardToken[] = [
    {
      symbol: 'ANT',
      name: 'Ant Token',
      amount: pendingRewards.ant,
      value: pendingRewards.ant * 1.25, // Assuming $1.25 per ANT
      apy: '15.75%',
      icon: '🪲',
      canClaim: pendingRewards.ant > 0
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      amount: pendingRewards.sol,
      value: pendingRewards.sol * 150, // Assuming $150 per SOL
      apy: '8.25%',
      icon: '🪙',
      canClaim: pendingRewards.sol > 0
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      amount: pendingRewards.usdc,
      value: pendingRewards.usdc, // 1:1 with USD
      apy: '5.50%',
      icon: '💵',
      canClaim: pendingRewards.usdc > 0
    },
    {
      symbol: 'JUP',
      name: 'Jupiter',
      amount: 0,
      value: 0,
      apy: '12.30%',
      icon: '🪐',
      canClaim: false
    },
    {
      symbol: 'RAY',
      name: 'Raydium',
      amount: 0,
      value: 0,
      apy: '9.75%',
      icon: '☀️',
      canClaim: false
    }
  ];

  const totalPendingValue = tokens.reduce((sum, token) => sum + token.value, 0);
  const totalLifetimeValue = 
    (lifetimeRewards.ant * 1.25) + 
    (lifetimeRewards.sol * 150) + 
    lifetimeRewards.usdc;

  const toggleTokenSelection = (symbol: string) => {
    if (selectedTokens.includes(symbol)) {
      setSelectedTokens(selectedTokens.filter(t => t !== symbol));
    } else {
      setSelectedTokens([...selectedTokens, symbol]);
    }
  };

  const toggleSelectAll = () => {
    const claimableTokens = tokens.filter(t => t.canClaim).map(t => t.symbol);
    if (selectedTokens.length === claimableTokens.length) {
      setSelectedTokens([]);
    } else {
      setSelectedTokens([...claimableTokens]);
    }
  };

  const handleClaim = async () => {
    if (selectedTokens.length === 0) return;
    
    setIsClaiming(true);
    try {
      await onClaimRewards(selectedTokens);
      setSelectedTokens([]);
      setClaimSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setClaimSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const toggleTokenExpansion = (symbol: string) => {
    setExpandedToken(expandedToken === symbol ? null : symbol);
  };

  return (
    <div className="space-y-6">
      {/* Rewards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-purple-800">Pending Rewards</h4>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900">
            ${totalPendingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-purple-600 mt-1">
            {tokens.filter(t => t.amount > 0).length} token{tokens.filter(t => t.amount > 0).length !== 1 ? 's' : ''} available
          </div>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-blue-800">Lifetime Rewards</h4>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-900">
            ${totalLifetimeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Total rewards earned
          </div>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-green-800">Next Reward Epoch</h4>
            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-green-900">
            2d 14h 23m
          </div>
          <div className="text-xs text-green-600 mt-1">
            Next reward distribution
          </div>
        </div>
      </div>
      
      {/* Claim Rewards Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-800">Claim Rewards</h3>
          <p className="text-sm text-gray-500">Claim your staking rewards to your wallet</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {/* Token List Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 text-xs font-bold text-gray-500">
            <div className="col-span-5 flex items-center">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedTokens.length > 0 && selectedTokens.length === tokens.filter(t => t.canClaim).length}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
              />
              <label htmlFor="selectAll" className="cursor-pointer">Token</label>
            </div>
            <div className="col-span-2 text-right">Balance</div>
            <div className="col-span-2 text-right">Value</div>
            <div className="col-span-2 text-right">APY</div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Token List */}
          {tokens.map((token) => (
            <div key={token.symbol} className="hover:bg-gray-50 transition-colors">
              <div 
                className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer"
                onClick={() => toggleTokenExpansion(token.symbol)}
              >
                <div className="col-span-5 flex items-center">
                  <input
                    type="checkbox"
                    id={`token-${token.symbol}`}
                    checked={selectedTokens.includes(token.symbol)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleTokenSelection(token.symbol);
                    }}
                    disabled={!token.canClaim}
                    className={`h-4 w-4 rounded border-gray-300 ${
                      token.canClaim 
                        ? 'text-indigo-600 focus:ring-indigo-500' 
                        : 'text-gray-300 cursor-not-allowed'
                    } mr-3`}
                  />
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{token.icon}</span>
                    <div>
                      <div className="font-bold text-gray-800">{token.symbol}</div>
                      <div className="text-xs text-gray-500">{token.name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-mono">{token.amount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                  {!token.canClaim && <div className="text-xs text-gray-400">No rewards</div>}
                </div>
                <div className="col-span-2 text-right font-mono">
                  ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="col-span-2 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    parseFloat(token.apy) > 10 
                      ? 'bg-green-100 text-green-800' 
                      : parseFloat(token.apy) > 5 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {token.apy}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  {expandedToken === token.symbol ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Expanded Token Details */}
              <AnimatePresence>
                {expandedToken === token.symbol && (
                  <motion.div 
                    className="bg-gray-50 px-4 pb-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-xs font-bold text-gray-500 mb-1">Daily Rewards</div>
                        <div className="font-mono">
                          {(token.amount / 30).toFixed(6)} {token.symbol}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">~${(token.value / 30).toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-xs font-bold text-gray-500 mb-1">Weekly Rewards</div>
                        <div className="font-mono">
                          {(token.amount / 4.285).toFixed(6)} {token.symbol}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">~${(token.value / 4.285).toFixed(2)}</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-xs font-bold text-gray-500 mb-1">Monthly Rewards</div>
                        <div className="font-mono">
                          {token.amount.toFixed(6)} {token.symbol}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">~${token.value.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <Info className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>Rewards are updated at the end of each epoch (approximately 2-3 days)</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-3 sm:mb-0">
            <div className="text-sm text-gray-500">Selected ({selectedTokens.length}):</div>
            <div className="font-bold text-gray-800">
              ${tokens
                .filter(t => selectedTokens.includes(t.symbol))
                .reduce((sum, t) => sum + t.value, 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="flex space-x-3 w-full sm:w-auto
          ">
            <button 
              onClick={toggleSelectAll}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              {selectedTokens.length === tokens.filter(t => t.canClaim).length ? 'Deselect All' : 'Select All'}
            </button>
            
            <button
              onClick={handleClaim}
              disabled={selectedTokens.length === 0 || isClaiming}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-bold text-white transition-all ${
                selectedTokens.length === 0 || isClaiming
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
              }`}
            >
              {isClaiming ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Claiming...</span>
                </div>
              ) : (
                `Claim ${selectedTokens.length > 0 ? `(${selectedTokens.length})` : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Claim History */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-800">Claim History</h3>
          <p className="text-sm text-gray-500">Your recent reward claims</p>
        </div>
        
        {claimHistory.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {claimHistory.map((claim) => (
              <div key={claim.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-gray-800">
                      {claim.tokens.map(t => `${t.amount} ${t.symbol}`).join(' + ')}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {claim.date.toLocaleDateString()} • {claim.date.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`https://solscan.io/tx/${claim.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>View on Solscan</span>
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">No claim history found</div>
            <div className="text-sm text-gray-500">Your claim history will appear here</div>
          </div>
        )}
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View All History
          </button>
        </div>
      </div>
      
      {/* Rewards Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-100">
          <h4 className="font-bold text-blue-800 mb-3">How Rewards Work</h4>
          <ul className="space-y-3 text-sm text-blue-700">
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="w-3 h-3" />
              </div>
              <span>Rewards are distributed from staking rewards and protocol fees</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="w-3 h-3" />
              </div>
              <span>Higher staking tiers earn bonus rewards and lower fees</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-0.5">
                <CheckCircle className="w-3 h-3" />
              </div>
              <span>Claiming more frequently may result in higher gas fees</span>
            </li>
          </ul>
        </div>
        
        <div className="p-5 bg-purple-50 rounded-xl border-2 border-purple-100">
          <h4 className="font-bold text-purple-800 mb-3">Maximizing Your Rewards</h4>
          <ul className="space-y-3 text-sm text-purple-700">
            <li className="flex items-start">
              <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-0.5">
                <Zap className="w-3 h-3" />
              </div>
              <span>Stake for longer periods to earn higher APY</span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-0.5">
                <Zap className="w-3 h-3" />
              </div>
              <span>Compound your rewards to benefit from exponential growth</span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-0.5">
                <Zap className="w-3 h-3" />
              </div>
              <span>Check back regularly for special reward programs</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Success Message */}
      <AnimatePresence>
        {claimSuccess && (
          <motion.div 
            className="fixed bottom-6 right-6 p-4 bg-green-500 text-white rounded-lg shadow-xl flex items-center space-x-3 z-50"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Successfully claimed your rewards!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsTab;
