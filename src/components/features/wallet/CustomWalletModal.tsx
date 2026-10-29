'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { useEffect, useState, useMemo } from 'react';
import { Clock, Wallet, Sparkles, Zap, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const RECENT_WALLETS_KEY = 'recentWallets';

interface RecentWallet {
  name: string;
  timestamp: number;
}

// Wallet metadata with chain information
const WALLET_METADATA: Record<string, { recommended?: boolean; chain?: string }> = {
  'Phantom': { recommended: true, chain: 'Solana' },
  'Solflare': { recommended: false, chain: 'Solana' },
  'Coinbase': { recommended: false, chain: 'Multi-chain' },
  'Backpack': { recommended: false, chain: 'Solana' },
  'Glow': { recommended: false, chain: 'Solana' },
  'Ledger': { recommended: false, chain: 'Hardware' },
};

export function CustomWalletModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { wallets, select } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [recentWallets, setRecentWallets] = useState<RecentWallet[]>([]);

  // Load recent wallets from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(RECENT_WALLETS_KEY);
      if (stored) {
        setRecentWallets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent wallets:', error);
    }
  }, []);

  const handleSelectWallet = (walletName: WalletName) => {
    // Update recent wallets
    const walletStr = walletName.toString();
    const newRecentWallets = [
      { name: walletStr, timestamp: Date.now() },
      ...recentWallets
        .filter(w => w.name !== walletStr)
        .slice(0, 4) // Keep only the 4 most recent
    ];

    setRecentWallets(newRecentWallets);
    localStorage.setItem(RECENT_WALLETS_KEY, JSON.stringify(newRecentWallets));

    select(walletName);
    onClose();
  };

  if (!isClient) return null;

  // Group wallets into recent and others, and deduplicate
  const recentWalletNames = new Set(recentWallets.map(w => w.name));
  const seenWallets = new Set<string>();
  const recentWalletsList = wallets.filter(w => {
    const name = w.adapter.name;
    if (recentWalletNames.has(name) && !seenWallets.has(name)) {
      seenWallets.add(name);
      return true;
    }
    return false;
  });
  const otherWallets = wallets.filter(w => {
    const name = w.adapter.name;
    if (!recentWalletNames.has(name) && !seenWallets.has(name)) {
      seenWallets.add(name);
      return true;
    }
    return false;
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connect Wallet</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred wallet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Recent Wallets */}
            {recentWalletsList.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Recently Used
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {recentWalletsList.map((wallet, index) => (
                    <ModernWalletButton
                      key={`${wallet.adapter.name}-${index}`}
                      wallet={wallet}
                      isRecent={true}
                      onClick={() => handleSelectWallet(wallet.adapter.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Wallets */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {recentWalletsList.length > 0 ? 'All Wallets' : 'Available Wallets'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {otherWallets.map((wallet, index) => (
                  <ModernWalletButton
                    key={`${wallet.adapter.name}-${index}`}
                    wallet={wallet}
                    isRecent={false}
                    onClick={() => handleSelectWallet(wallet.adapter.name)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModernWalletButton({
  wallet,
  isRecent,
  onClick,
}: {
  wallet: any;
  isRecent: boolean;
  onClick: () => void;
}) {
  const walletName = wallet.adapter.name;
  const metadata = WALLET_METADATA[walletName] || {};

  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 text-left w-full"
    >
      {wallet.adapter.icon ? (
        <div className="relative w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
          <Image
            src={wallet.adapter.icon}
            alt={`${walletName} icon`}
            width={32}
            height={32}
            className="object-contain"
            unoptimized
          />
        </div>
      ) : (
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Wallet className="w-6 h-6 text-gray-400" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {walletName}
          </span>
          {metadata.recommended && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-medium">
              <Zap className="w-3 h-3" />
              Recommended
            </span>
          )}
          {isRecent && !metadata.recommended && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-medium">
              Recent
            </span>
          )}
        </div>
        {metadata.chain && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {metadata.chain}
          </span>
        )}
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
    </button>
  );
}
