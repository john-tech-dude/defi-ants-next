'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Copy, ExternalLink, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function WalletStatus() {
  const {
    isConnected,
    isConnecting,
    isDisconnecting,
    walletAddress,
    walletName,
    status,
    connect,
    disconnect,
    formatAddress,
    getBalance,
  } = useWalletConnection();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (!isConnected || !walletAddress) {
      setBalance(null);
      return;
    }

    const loadBalance = async () => {
      try {
        setIsLoadingBalance(true);
        const bal = await getBalance();
        setBalance(bal);
      } catch (error) {
        console.error('Error loading balance:', error);
        toast.error('Failed to load balance');
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadBalance();
    
    // Set up polling for balance updates
    const interval = setInterval(loadBalance, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [isConnected, walletAddress, getBalance]);

  const handleCopyAddress = () => {
    if (!walletAddress) return;
    
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        toast.success('Address copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy address:', error);
        toast.error('Failed to copy address');
      });
  };

  const handleViewOnExplorer = () => {
    if (!walletAddress) return;
    window.open(`https://solscan.io/address/${walletAddress}`, '_blank');
  };

  if (isConnecting) {
    return (
      <div className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center p-6 border rounded-lg space-y-4">
        <h3 className="text-lg font-medium">Connect your wallet</h3>
        <p className="text-sm text-muted-foreground">
          Connect your wallet to interact with the application
        </p>
        <Button 
          onClick={connect} 
          disabled={isConnecting}
          className="w-full"
        >
          <LogIn className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">{walletName?.charAt(0).toUpperCase() || 'W'}</span>
          </div>
          <div>
            <p className="font-medium">
              {walletName || 'Wallet'}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {formatAddress(walletAddress || '')}
              </span>
              <button 
                onClick={handleCopyAddress}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Copy address"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={handleViewOnExplorer}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="View on Solscan"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`h-2.5 w-2.5 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 
            status === 'connecting' ? 'bg-yellow-500' : 
            status === 'disconnecting' ? 'bg-yellow-500' : 
            'bg-gray-400'
          }`} />
          <span className="text-xs text-muted-foreground capitalize">
            {status}
          </span>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Balance</span>
          {isLoadingBalance ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <span className="font-mono">
              {balance !== null ? balance.toFixed(4) : '--'} SOL
            </span>
          )}
        </div>
      </div>
      
      <Button 
        onClick={disconnect} 
        variant="outline" 
        className="w-full mt-4"
        disabled={isDisconnecting}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
      </Button>
    </div>
  );
}
