import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  BarChart2, 
  Clock, 
  Settings, 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  Info, 
  Loader2,
  CheckCircle,
  ArrowUpRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { RiskMeter } from '../components/RiskMeter';

interface AdvancedToolsTabProps {
  stakingData: {
    stakedAmount: number;
    pendingRewards: {
      sol: number;
      ant: number;
      [key: string]: number;
    };
    portfolioValue: number;
  };
  onAutoCompound: (options: { enabled: boolean, threshold: number, frequency: string }) => Promise<void>;
  onSetStopLoss: (options: { enabled: boolean, threshold: number, token: string }) => Promise<void>;
  loading: boolean;
}

const AdvancedToolsTab: React.FC<AdvancedToolsTabProps> = ({
  stakingData,
  onAutoCompound,
  onSetStopLoss,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'auto' | 'stop-loss' | 'yield'>('auto');
  const [autoCompound, setAutoCompound] = useState({
    enabled: false,
    threshold: 10, // 10 ANT
    frequency: 'daily' // daily, weekly, monthly
  });
  
  const [stopLoss, setStopLoss] = useState({
    enabled: false,
    threshold: 5, // 5% below current price
    token: 'SOL' // SOL, ANT, etc.
  });
  
  const [slippage, setSlippage] = useState(1); // 1%
  const [transactionDeadline, setTransactionDeadline] = useState(20); // 20 minutes
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Simulate loading saved settings
  useEffect(() => {
    // In a real app, you would fetch these from the user's settings
    const timer = setTimeout(() => {
      setAutoCompound({
        enabled: true,
        threshold: 10,
        frequency: 'daily'
      });
      
      setStopLoss({
        enabled: false,
        threshold: 5,
        token: 'SOL'
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save auto-compound settings
      if (activeTab === 'auto') {
        await onAutoCompound(autoCompound);
      }
      
      // Save stop-loss settings
      if (activeTab === 'stop-loss') {
        await onSetStopLoss(stopLoss);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border-2 border-gray-200 bg-white shadow-lg">
        <h3 className="text-2xl font-black mb-6 text-gray-800">Advanced Staking Tools</h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('auto')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'auto' 
                ? 'bg-white shadow-sm text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Auto-Compound
          </button>
          <button
            onClick={() => setActiveTab('stop-loss')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'stop-loss' 
                ? 'bg-white shadow-sm text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Stop-Loss
          </button>
          <button
            onClick={() => setActiveTab('yield')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'yield' 
                ? 'bg-white shadow-sm text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Yield Optimizer
          </button>
        </div>
        
        {/* Auto-Compound Tab */}
        {activeTab === 'auto' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-start">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mr-4">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-indigo-800 mb-1">Auto-Compound Rewards</h4>
                  <p className="text-sm text-indigo-700">
                    Automatically compound your staking rewards to maximize your returns through the power of compounding.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Enable Auto-Compounding</label>
                  <p className="text-xs text-gray-500">Automatically restake your rewards to earn compound interest</p>
                </div>
                <button
                  onClick={() => setAutoCompound({ ...autoCompound, enabled: !autoCompound.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    autoCompound.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                      autoCompound.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Minimum Reward Threshold
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={autoCompound.threshold}
                      onChange={(e) => setAutoCompound({ ...autoCompound, threshold: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-base font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                      step="0.1"
                      disabled={!autoCompound.enabled}
                    />
                    <div className="absolute right-3 top-3.5 text-sm font-bold text-gray-500">
                      ANT
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically compound when rewards reach this amount
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Compounding Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'daily', label: 'Daily' },
                      { id: 'weekly', label: 'Weekly' },
                      { id: 'monthly', label: 'Monthly' }
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setAutoCompound({ ...autoCompound, frequency: freq.id })}
                        disabled={!autoCompound.enabled}
                        className={`py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
                          autoCompound.frequency === freq.id
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                            : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
                        } ${!autoCompound.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      Auto-compounding will automatically claim and restake your rewards when they reach the threshold amount.
                      A small transaction fee will apply for each auto-compound operation.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving || loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : 'Save Auto-Compound Settings'}
              </button>
              
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div 
                    className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>Auto-compound settings saved successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        
        {/* Stop-Loss Tab */}
        {activeTab === 'stop-loss' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-5 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-start">
                <div className="p-2 bg-red-100 rounded-lg text-red-600 mr-4">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-red-800 mb-1">Stop-Loss Protection</h4>
                  <p className="text-sm text-red-700">
                    Automatically sell your assets if the price drops below a certain threshold to limit potential losses.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Enable Stop-Loss</label>
                  <p className="text-xs text-gray-500">Automatically sell assets if price drops below threshold</p>
                </div>
                <button
                  onClick={() => setStopLoss({ ...stopLoss, enabled: !stopLoss.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    stopLoss.enabled ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                      stopLoss.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {stopLoss.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Select Asset
                    </label>
                    <select
                      value={stopLoss.token}
                      onChange={(e) => setStopLoss({ ...stopLoss, token: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-base font-bold focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="SOL">SOL (Solana)</option>
                      <option value="ANT">ANT (Ant Token)</option>
                      <option value="USDC">USDC (USD Coin)</option>
                      <option value="BTC">BTC (Bitcoin)</option>
                      <option value="ETH">ETH (Ethereum)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Price Drop Threshold
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={stopLoss.threshold}
                        onChange={(e) => setStopLoss({ ...stopLoss, threshold: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1%</span>
                        <span className="text-red-600 font-bold">{stopLoss.threshold}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Trigger stop-loss if price drops by this percentage from the highest price
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-yellow-700">
                        <p className="font-bold">Important:</p>
                        <p className="mt-1">
                          Stop-loss orders are executed on-chain and may be subject to price slippage and network congestion.
                          In extreme market conditions, the actual execution price may differ from the trigger price.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving || loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : 'Save Stop-Loss Settings'}
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Yield Optimizer Tab */}
        {activeTab === 'yield' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mr-4">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-purple-800 mb-1">Yield Optimization</h4>
                  <p className="text-sm text-purple-700">
                    Advanced tools to maximize your staking yields across different protocols and strategies.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-white rounded-xl border-2 border-gray-100">
                <h5 className="font-bold text-gray-800 mb-4">Portfolio Allocation</h5>
                
                <div className="space-y-4">
                  {[
                    { name: 'Staked ANT', value: 65, color: 'bg-purple-500' },
                    { name: 'Liquidity Pools', value: 20, color: 'bg-blue-500' },
                    { name: 'Lending', value: 10, color: 'bg-green-500' },
                    { name: 'Yield Farming', value: 5, color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-700">{item.name}</span>
                        <span className="font-black">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${item.color}`} 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-bold text-gray-500 mb-1">Current APY</div>
                    <div className="text-xl font-black text-purple-600">18.75%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-bold text-gray-500 mb-1">Projected APY</div>
                    <div className="text-xl font-black text-green-600">24.5%</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      Based on your current allocation, you could increase your yields by up to 5.75% by rebalancing your portfolio.
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition-all">
                  Optimize Portfolio
                </button>
              </div>
              
              <div className="p-5 bg-white rounded-xl border-2 border-gray-100">
                <h5 className="font-bold text-gray-800 mb-4">Transaction Settings</h5>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Slippage Tolerance
                    </label>
                    <div className="flex space-x-2">
                      {[0.5, 1, 3].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSlippage(value)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
                            slippage === value
                              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                              : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {value}%
                        </button>
                      ))}
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={slippage}
                          onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                          className="w-full h-full px-3 py-2 rounded-lg border-2 border-gray-300 text-sm font-bold text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          min="0.1"
                          max="50"
                          step="0.1"
                        />
                        <div className="absolute right-3 top-2 text-xs font-bold text-gray-500">%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Transaction Deadline
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={transactionDeadline}
                        onChange={(e) => setTransactionDeadline(parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 rounded-lg border-2 border-gray-300 text-sm font-bold text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        min="1"
                        max="60"
                      />
                      <span className="text-sm font-bold text-gray-700">minutes</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Transaction will revert if it is pending for longer than this time
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-yellow-700">
                      <p className="font-bold">Warning:</p>
                      <p className="mt-1">
                        Setting a very low slippage tolerance may cause your transactions to fail when the market is volatile.
                        Setting it too high may result in a poor exchange rate.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-3 px-6 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  Save Transaction Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Advanced Analytics */}
      <div className="p-6 rounded-xl border-2 border-indigo-100 bg-indigo-50">
        <h4 className="text-lg font-black text-indigo-800 mb-4">Advanced Analytics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-indigo-100">
            <div className="text-xs font-bold text-indigo-600 mb-1">Portfolio Value</div>
            <div className="text-2xl font-black text-gray-800">${stakingData.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="flex items-center text-xs font-bold text-green-600 mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +5.2% (7d)
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-indigo-100">
            <div className="text-xs font-bold text-indigo-600 mb-1">Pending Rewards</div>
            <div className="text-2xl font-black text-gray-800">
              {stakingData.pendingRewards.ant.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ANT
            </div>
            <div className="text-xs font-bold text-indigo-600 mt-1">
              ${(stakingData.pendingRewards.ant * 1.25).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-xl border border-indigo-100">
            <div className="text-xs font-bold text-indigo-600 mb-1">Staked Amount</div>
            <div className="text-2xl font-black text-gray-800">
              {stakingData.stakedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ANT
            </div>
            <div className="text-xs font-bold text-indigo-600 mt-1">
              ${(stakingData.stakedAmount * 1.25).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold text-indigo-800">Performance (30d)</h5>
            <div className="flex space-x-2">
              <button className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded">1M</button>
              <button className="text-xs font-bold px-2 py-1 text-gray-500 hover:bg-indigo-50 rounded">3M</button>
              <button className="text-xs font-bold px-2 py-1 text-gray-500 hover:bg-indigo-50 rounded">1Y</button>
              <button className="text-xs font-bold px-2 py-1 text-gray-500 hover:bg-indigo-50 rounded">ALL</button>
            </div>
          </div>
          
          {/* Placeholder for chart */}
          <div className="h-48 bg-white rounded-lg border border-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <BarChart2 className="w-10 h-10 text-indigo-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Performance chart will be displayed here</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Jan 1</span>
            <span>Jan 7</span>
            <span>Jan 14</span>
            <span>Jan 21</span>
            <span>Jan 28</span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors text-left">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <Copy className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-gray-800 mb-1">Copy Trading</h5>
          <p className="text-sm text-gray-600">Follow top traders and copy their strategies automatically</p>
        </button>
        
        <button className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors text-left">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-3">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-gray-800 mb-1">Bridge Assets</h5>
          <p className="text-sm text-gray-600">Move assets between different blockchains with low fees</p>
        </button>
        
        <button className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors text-left">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <ExternalLink className="w-5 h-5" />
          </div>
          <h5 className="font-bold text-gray-800 mb-1">DEX Aggregator</h5>
          <p className="text-sm text-gray-600">Get the best prices across multiple decentralized exchanges</p>
        </button>
      </div>
    </div>
  );
};

export default AdvancedToolsTab;
