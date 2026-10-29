import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowUpRight, BarChart3, Info, Clock, Loader2, CheckCircle } from 'lucide-react';
import { RWA_ASSETS } from '../constants';
import { RiskMeter } from '../components/RiskMeter';

interface RWAFarmingTabProps {
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
  stakeAmount: string;
  setStakeAmount: (amount: string) => void;
  onStakeToRWA: (assetId: string, amount: number) => Promise<void>;
  loading: boolean;
  stakingData: {
    antBalance: number;
  };
}

const RWAFarmingTab: React.FC<RWAFarmingTabProps> = ({
  selectedAsset,
  setSelectedAsset,
  stakeAmount,
  setStakeAmount,
  onStakeToRWA,
  loading,
  stakingData
}) => {
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [allocationSuccess, setAllocationSuccess] = useState(false);
  
  const currentAsset = RWA_ASSETS.find(a => a.id === selectedAsset) || RWA_ASSETS[0];
  const availableToAllocate = stakingData.antBalance;
  
  const toggleAsset = (assetId: string) => {
    setExpandedAsset(expandedAsset === assetId ? null : assetId);
    setSelectedAsset(assetId);
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    
    try {
      await onStakeToRWA(selectedAsset, parseFloat(stakeAmount));
      setStakeAmount('');
      setAllocationSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setAllocationSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to stake to RWA:', error);
    }
  };

  const handleMaxClick = () => {
    setStakeAmount(availableToAllocate.toString());
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border-2 border-gray-200 bg-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-800">Real World Asset Farming</h3>
            <p className="text-gray-600">Earn yields backed by real-world assets with transparent on-chain verification</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
              <Info className="w-4 h-4 mr-2" />
              <span>All assets are tokenized and on-chain</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Selection */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="text-lg font-black text-gray-700">Available Assets</h4>
            <div className="space-y-3">
              {RWA_ASSETS.map(asset => (
                <div key={asset.id} className="relative">
                  <button
                    onClick={() => toggleAsset(asset.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAsset === asset.id
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{asset.icon}</div>
                        <div>
                          <div className="font-black text-gray-800">{asset.name}</div>
                          <div className="text-xs font-bold text-gray-500">{asset.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-green-600">{asset.apy}</div>
                        <RiskMeter risk={asset.risk as any} className="justify-end" />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs font-bold text-gray-500">TVL: {asset.tvl}</div>
                      <div className="flex items-center text-xs font-bold text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {asset.lockPeriod}
                      </div>
                    </div>
                  </button>
                  
                  {expandedAsset === asset.id && (
                    <motion.div 
                      className="p-4 mt-1 bg-gray-50 rounded-lg border border-gray-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <h5 className="font-bold text-sm text-gray-700 mb-2">Asset Details</h5>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li className="flex items-start">
                          <span className="inline-block w-3 h-3 mr-2 mt-0.5">•</span>
                          <span>{asset.description}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-3 h-3 mr-2 mt-0.5">•</span>
                          <span>Issuer: {asset.issuer}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-3 h-3 mr-2 mt-0.5">•</span>
                          <span>Collateralization: {asset.collateralization}</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Asset Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-black text-gray-800 flex items-center">
                    {currentAsset.icon} <span className="ml-2">{currentAsset.name}</span>
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{currentAsset.type} • {currentAsset.issuer}</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-500">APY</div>
                    <div className="text-2xl font-black text-green-600">{currentAsset.apy}</div>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-500">Risk</div>
                    <RiskMeter risk={currentAsset.risk as any} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white/50 rounded-lg border border-green-100">
                  <div className="text-xs font-bold text-gray-500 mb-1">TVL</div>
                  <div className="text-lg font-black text-gray-800">{currentAsset.tvl}</div>
                </div>
                <div className="p-4 bg-white/50 rounded-lg border border-green-100">
                  <div className="text-xs font-bold text-gray-500 mb-1">Lock Period</div>
                  <div className="text-lg font-black text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    {currentAsset.lockPeriod}
                  </div>
                </div>
                <div className="p-4 bg-white/50 rounded-lg border border-green-100">
                  <div className="text-xs font-bold text-gray-500 mb-1">Collateral</div>
                  <div className="text-lg font-black text-gray-800">{currentAsset.collateralization}</div>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-green-100">
                <h5 className="font-bold text-gray-700 mb-3">Asset Overview</h5>
                <p className="text-sm text-gray-600 mb-4">{currentAsset.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                      <span>Asset Type</span>
                      <span className="text-gray-800">{currentAsset.type}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                      <span>Issuer</span>
                      <span className="text-gray-800">{currentAsset.issuer}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                      <span>Collateralization</span>
                      <span className="text-gray-800">{currentAsset.collateralization}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stake to RWA */}
            <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
              <h5 className="text-lg font-black text-gray-800 mb-4">Stake to {currentAsset.name}</h5>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold text-gray-700">
                      Amount to Stake
                    </label>
                    <span className="text-xs text-gray-500">
                      Available: {availableToAllocate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ANT
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-4 rounded-lg border-2 border-gray-300 text-lg font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      max={availableToAllocate}
                    />
                    <div className="absolute right-3 top-4 text-sm font-bold text-gray-500">
                      ANT
                    </div>
                    <div className="absolute right-16 top-3">
                      <button
                        type="button"
                        onClick={handleMaxClick}
                        className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-bold text-gray-500 mb-1">Projected APY</div>
                    <div className="text-lg font-black text-green-600">{currentAsset.apy}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-bold text-gray-500 mb-1">Lock Period</div>
                    <div className="text-lg font-black text-gray-800">{currentAsset.lockPeriod}</div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      Staked assets will be locked for the selected period. Early unstaking is subject to a penalty fee.
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {allocationSuccess && (
                    <motion.div 
                      className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Successfully staked {stakeAmount} ANT to {currentAsset.name}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > availableToAllocate || loading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
                    !stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > availableToAllocate || loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-100'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Stake to ${currentAsset.name}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="p-6 rounded-xl border-2 border-blue-100 bg-blue-50">
        <h4 className="text-lg font-black text-blue-800 mb-6">Why Invest in Real World Assets?</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-xl border-2 border-blue-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl mb-4">
              💰
            </div>
            <h5 className="font-black text-gray-800 mb-2">Stable Yields</h5>
            <p className="text-sm text-gray-600">Earn consistent returns backed by real-world cash flows and collateralized assets</p>
          </div>
          
          <div className="p-5 bg-white rounded-xl border-2 border-blue-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl mb-4">
              🔗
            </div>
            <h5 className="font-black text-gray-800 mb-2">On-Chain Transparency</h5>
            <p className="text-sm text-gray-600">All assets are tokenized and verifiable on the blockchain</p>
          </div>
          
          <div className="p-5 bg-white rounded-xl border-2 border-blue-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl mb-4">
              🏦
            </div>
            <h5 className="font-black text-gray-800 mb-2">Diversification</h5>
            <p className="text-sm text-gray-600">Access traditional financial assets with crypto efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RWAFarmingTab;
