'use client';

import { useWallet, useWalletModal } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import Button from '@/components/ui/button';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { CustomWalletModal } from './CustomWalletModal';
import { toast } from 'sonner';

// Default styles that can be overridden with Tailwind classes
export function ConnectButton({ className = '' }: { className?: string }) {
  const { connected, publicKey, disconnect } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  // Truncate the public key for display
  const base58 = publicKey?.toBase58();
  const displayAddress = base58 ? `${base58.slice(0, 4)}...${base58.slice(-4)}` : '';

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      toast.error('Failed to disconnect wallet');
    }
  };

  const handleCopyAddress = () => {
    if (base58) {
      navigator.clipboard.writeText(base58);
      toast.success('Address copied to clipboard');
    }
  };

  return (
    <>
      {connected ? (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddress(!showAddress)}
            className={`${className} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-10 px-4 rounded-lg transition-all duration-200 flex items-center gap-2`}
          >
            <Wallet className="h-4 w-4" />
            <span>{displayAddress}</span>
          </Button>
          {showAddress && (
            <div className="flex items-center gap-1">
              <Button
                onClick={handleCopyAddress}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-lg"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={() => setShowModal(true)}
          className={`${className} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-10 px-4 rounded-lg transition-all duration-200 flex items-center gap-2`}
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </Button>
      )}
      <CustomWalletModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
