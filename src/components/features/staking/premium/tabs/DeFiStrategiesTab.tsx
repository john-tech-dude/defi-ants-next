import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart2, Info, ArrowUpRight, ChevronDown, Loader2 } from 'lucide-react';
import { DEFI_STRATEGIES } from '../constants';
import { RiskMeter } from '../components/RiskMeter';

interface DeFiStrategiesTabProps {
  selectedStrategy: string;
  setSelectedStrategy: (strategy: string) => void;
  leverageAmount: number;
  setLeverageAmount: (amount: number) => void;
  onStakeToStrategy: (strategyId: string, amount: number, leverage: number) => Promise<void>;
  loading: boolean;
}

const DeFiStrategiesTab: React.FC<DeFiStrategiesTabProps> = ({
  selectedStrategy,
  setSelectedStrategy,
  leverageAmount,
  setLeverageAmount,
  onStakeToStrategy,
  loading
}) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  
  const currentStrategy = DEFI_STRATEGIES.find(s => s.id === selectedStrategy) || DEFI_STRATEGIES[1];
  
  const toggleStrategy = (strategyId: string) => {
    setExpandedStrategy(expandedStrategy === strategyId ? null : strategyId);
    setSelectedStrategy(strategyId);
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    await onStakeToStrategy(selectedStrategy, parseFloat(stakeAmount), leverageAmount);
    setStakeAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border-2 border-gray-200 bg-white shadow-lg">
        <h3 className="text-2xl font-black mb-6 text-gray-800">DeFi Yield Strategies</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategy Selection */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-gray-700">Select Strategy</h4>
            <div className="space-y-3">
              {DEFI_STRATEGIES.map(strategy => (
                <div key={strategy.id} className="relative">
                  <button
                    onClick={() => toggleStrategy(strategy.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedStrategy === strategy.id
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{strategy.icon}</div>
                        <div>
                          <div className="font-black text-gray-800">{strategy.name}</div>
                          <div className="text-xs font-bold text-gray-500">Risk: {strategy.risk}</div>
                        </div>
                      </div>
                      <div className={`bg-gradient-to-r ${strategy.color} text-white text-sm font-black py-1 px-3 rounded-full`}>
                        {strategy.apy}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <RiskMeter risk={strategy.risk as any} />
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedStrategy === strategy.id ? 'transform rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {expandedStrategy === strategy.id && (
                    <motion.div 
                      className="p-4 mt-1 bg-gray-50 rounded-lg border border-gray-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <h5 className="font-bold text-sm text-gray-700 mb-2">Strategy Details</h5>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li className="flex items-start">
                          <span className="inline-block w-3 h-3 mr-2 mt-0.5">•</span>
                          <span>Automated yield optimization across multiple protocols</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-3 h-3 mr-2 mt-0.5">•</span>
                          <span>Dynamic risk management</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-3 h-3 mr-2 mt-0.5">•</span>
                          <span>Compound interest optimization</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Leverage</span>
                <span className="text-sm font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {leverageAmount}x
                </span>
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={leverageAmount}
                  onChange={(e) => setLeverageAmount(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500 mt-1">
                <span>1x</span>
                <span>10x</span>
              </div>
            </div>
          </div>
          
          {/* Strategy Details */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-black text-indigo-800">{currentStrategy.name} Strategy</h4>
                <div className={`text-sm font-black py-1 px-3 rounded-full ${currentStrategy.color} text-white`}>
                  {currentStrategy.apy} APY
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Risk Level</span>
                  <span className="text-sm font-black text-gray-800">{currentStrategy.risk}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Leverage</span>
                  <span className="text-sm font-black text-blue-600">{leverageAmount}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Platforms</span>
                  <div className="flex space-x-1">
                    <span className="text-xs font-black bg-blue-100 text-blue-800 px-2 py-1 rounded">JUP</span>
                    <span className="text-xs font-black bg-purple-100 text-purple-800 px-2 py-1 rounded">RAY</span>
                    <span className="text-xs font-black bg-orange-100 text-orange-800 px-2 py-1 rounded">ORCA</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/50 rounded-lg border border-gray-200">
                <h5 className="text-sm font-black text-gray-700 mb-2">Strategy Composition</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-bold text-gray-700">Liquidity Pools</span>
                    </div>
                    <span className="text-xs font-black">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs font-bold text-gray-700">Lending</span>
                    </div>
                    <span className="text-xs font-black">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs font-bold text-gray-700">Stablecoin Yield</span>
                    </div>
                    <span className="text-xs font-black">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs font-bold text-gray-700">Leverage</span>
                    </div>
                    <span className="text-xs font-black">{leverageAmount}x</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stake to Strategy */}
            <div className="p-5 rounded-xl border-2 border-gray-200 bg-white">
              <h5 className="text-sm font-black text-gray-700 mb-4">Stake to Strategy</h5>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-base font-bold focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute right-3 top-3.5 text-sm font-bold text-gray-500">
                      ANT
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Projected APY</span>
                  <span className="font-black text-green-600">
                    {currentStrategy.apy}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Risk Level</span>
                  <span className="font-black">{currentStrategy.risk}</span>
                </div>
                
                <button
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Stake to ${currentStrategy.name} Strategy`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Strategy Benefits */}
      <div className="p-6 rounded-xl border-2 border-blue-100 bg-blue-50">
        <h4 className="text-lg font-black text-blue-800 mb-3">Strategy Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentStrategy.id === 'ai-optimized' && (
            <>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🤖</div>
                <h5 className="font-black text-gray-800 mb-1">AI Optimization</h5>
                <p className="text-sm text-gray-600">Advanced algorithms continuously optimize yields across protocols</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">📈</div>
                <h5 className="font-black text-gray-800 mb-1">Maximized Returns</h5>
                <p className="text-sm text-gray-600">Dynamically allocates to highest yielding opportunities</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🛡️</div>
                <h5 className="font-black text-gray-800 mb-1">Risk Management</h5>
                <p className="text-sm text-gray-600">Automated risk controls to protect your capital</p>
              </div>
            </>
          )}
          {currentStrategy.id === 'aggressive' && (
            <>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🚀</div>
                <h5 className="font-black text-gray-800 mb-1">High Growth</h5>
                <p className="text-sm text-gray-600">Targets emerging protocols with high yield potential</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">⚡</div>
                <h5 className="font-black text-gray-800 mb-1">Rapid Returns</h5>
                <p className="text-sm text-gray-600">Capitalizes on short-term market opportunities</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🎯</div>
                <h5 className="font-black text-gray-800 mb-1">Focused Allocation</h5>
                <p className="text-sm text-gray-600">Concentrated positions in highest conviction plays</p>
              </div>
            </>
          )}
          {currentStrategy.id === 'balanced' && (
            <>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">⚖️</div>
                <h5 className="font-black text-gray-800 mb-1">Balanced Growth</h5>
                <p className="text-sm text-gray-600">Diversified across multiple yield sources</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🔄</div>
                <h5 className="font-black text-gray-800 mb-1">Consistent Yields</h5>
                <p className="text-sm text-gray-600">Steady returns with moderate risk</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🛡️</div>
                <h5 className="font-black text-gray-800 mb-1">Risk Managed</h5>
                <p className="text-sm text-gray-600">Protects against extreme market conditions</p>
              </div>
            </>
          )}
          {currentStrategy.id === 'conservative' && (
            <>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🛡️</div>
                <h5 className="font-black text-gray-800 mb-1">Capital Preservation</h5>
                <p className="text-sm text-gray-600">Focuses on protecting your principal</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🏦</div>
                <h5 className="font-black text-gray-800 mb-1">Stable Yields</h5>
                <p className="text-sm text-gray-600">Reliable, consistent returns</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <div className="text-blue-500 text-2xl mb-2">🔄</div>
                <h5 className="font-black text-gray-800 mb-1">Low Volatility</h5>
                <p className="text-sm text-gray-600">Minimizes exposure to market swings</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeFiStrategiesTab;
