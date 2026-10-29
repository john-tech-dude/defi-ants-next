import React from 'react';
import { WalletIcon } from '@/components/ui/WalletIcon';

const SUPPORTED_WALLETS = [
  { id: 'phantom', name: 'Phantom', type: 'solana' },
  { id: 'solflare', name: 'Solflare', type: 'solana' },
  { id: 'metamask', name: 'MetaMask', type: 'evm' },
  { id: 'ledger', name: 'Ledger', type: 'both' },
  { id: 'backpack', name: 'Backpack', type: 'solana' },
  { id: 'coinbase', name: 'Coinbase', type: 'evm' },
  { id: 'glow', name: 'Glow', type: 'solana' },
  { id: 'torus', name: 'Torus', type: 'both' },
  { id: 'trust', name: 'Trust Wallet', type: 'both' },
  { id: 'math', name: 'Math Wallet', type: 'both' },
  { id: 'sollet', name: 'Sollet', type: 'solana' },
] as const;

type WalletType = typeof SUPPORTED_WALLETS[number]['type'];

export function WalletSupportSection() {
  const [activeTab, setActiveTab] = React.useState<WalletType | 'all'>('all');
  
  const filteredWallets = SUPPORTED_WALLETS.filter(
    wallet => activeTab === 'all' || wallet.type === activeTab || wallet.type === 'both'
  );

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Supported Wallets
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with your favorite Solana or EVM-compatible wallet
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                activeTab === 'all'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 border-primary-500'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Wallets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('solana')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                activeTab === 'solana'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 border-primary-500'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Solana
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('evm')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                activeTab === 'evm'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 border-primary-500'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              EVM
            </button>
          </div>
        </div>

        {/* Wallet Grid */}
        <div className="mt-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredWallets.map((wallet) => (
              <div 
                key={wallet.id}
                className="col-span-1 flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  <WalletIcon wallet={wallet.id} size={48} className="w-full h-full" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white text-center">
                  {wallet.name}
                </h3>
                <div className="mt-1 flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    wallet.type === 'solana' 
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                      : wallet.type === 'evm'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  }`}>
                    {wallet.type === 'both' ? 'Multi-Chain' : wallet.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Get Wallet CTA */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            Don't have a wallet yet?
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Get Phantom
            </a>
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Get MetaMask
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
