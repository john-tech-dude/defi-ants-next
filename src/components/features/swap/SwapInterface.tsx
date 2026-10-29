'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Button from "@/components/ui/button";
import { useSwap } from '@/hooks/useSwap';
import { Token, SwapQuote, Route } from '@/types/swap';
import { Tabs } from '@/components/ui/simple-tabs';

// Destructure the Tabs components from the Tabs namespace
const { List: TabsList, Trigger: TabsTrigger, Content: TabsContent } = Tabs;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Settings, ArrowDown, Info, ArrowUpDown, Zap } from 'lucide-react';

// Import Jupiter Terminal
// JupiterTerminal is now IntegratedJupiterTerminal
import { IntegratedJupiterTerminal } from './IntegratedJupiterTerminal';

// Import all types from the local types file
import type {
  TokenInputProps,
  TokenSelectDialogProps,
  RouteSelectorProps,
  SlippageSettingsProps,
  TokenInfoPanelProps,
  TransactionHistoryProps,
  ExtendedSwapQuote
} from './types';

// Re-export all types for easier access
export type {
  TokenInputProps,
  TokenSelectDialogProps,
  RouteSelectorProps,
  SlippageSettingsProps,
  TokenInfoPanelProps,
  TransactionHistoryProps,
  ExtendedSwapQuote
};

// Dynamically import components with no SSR to avoid window is not defined errors
const TokenInput = dynamic<TokenInputProps>(
  () => import('./TokenInput').then((mod) => mod.TokenInput),
  { 
    ssr: false, 
    loading: () => <div className="h-24 bg-muted/20 rounded-lg animate-pulse" /> 
  }
);

const TokenSelectDialog = dynamic<TokenSelectDialogProps>(
  () => import('./TokenSelectDialog').then((mod) => mod.TokenSelectDialog),
  { ssr: false }
);

const RouteSelector = dynamic<RouteSelectorProps>(
  () => import('./RouteSelector').then((mod) => mod.RouteSelector),
  { 
    ssr: false, 
    loading: () => <div className="h-32 bg-muted/20 rounded-lg animate-pulse my-2" /> 
  }
);

const SlippageSettings = dynamic<SlippageSettingsProps>(
  () => import('./SlippageSettings').then((mod) => mod.SlippageSettings),
  { 
    ssr: false,
    loading: () => <div className="h-24 bg-muted/20 rounded-lg animate-pulse" />
  }
);

const TokenInfoPanel = dynamic<TokenInfoPanelProps>(
  () => import('./TokenInfoPanel').then((mod) => mod.TokenInfoPanel),
  { ssr: false }
);

const TransactionHistory = dynamic<TransactionHistoryProps>(
  () => import('./TransactionHistory').then((mod) => mod.TransactionHistory),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-muted/20 rounded-lg animate-pulse" />
  }
);

interface SwapInterfaceProps {
  onSuccess?: (txSignature: string) => void;
  className?: string;
}

export function SwapInterface({ onSuccess, className }: SwapInterfaceProps) {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [showFromTokenSelect, setShowFromTokenSelect] = useState(false);
  const [showToTokenSelect, setShowToTokenSelect] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('swap'); // 'swap' or 'jupiter'

  // Dialog states
  const [showFromTokenDialog, setShowFromTokenDialog] = useState(false);
  const [showToTokenDialog, setShowToTokenDialog] = useState(false);

  // Local form state
  const [localFromAmount, setLocalFromAmount] = useState('');
  const [localSlippage, setLocalSlippage] = useState(0.5);
  const [localSelectedRouteIndex, setLocalSelectedRouteIndex] = useState(0);
  const [fromTokenBalance, setFromTokenBalance] = useState<number | null>(null);

  // Mock function for swap execution
  const executeSwap = async (): Promise<string> => {
    // In a real implementation, this would create and send a transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('mock-tx-signature');
      }, 2000);
    });
  };

  // Use the useSwap hook
  const swap = useSwap();

  // Mock data for initial development
  const [fromToken, setFromToken] = useState<Token | null>({
    symbol: 'SOL',
    name: 'Solana',
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  });
  
  const [toToken, setToToken] = useState<Token | null>({
    symbol: 'ANT',
    name: 'ANT Token',
    address: 'YOUR_ANT_TOKEN_MINT_ADDRESS',
    decimals: 9,
    logoURI: 'https://example.com/ant-logo.png'
  });

  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const handleSwapSuccess = (txSignature: string) => {
    console.log('Swap successful with signature:', txSignature);
    if (isMounted && toast) {
      toast({
        title: 'Swap Successful',
        description: 'Your swap has been executed successfully!',
        variant: 'default',
      });
    }
  };

  const handleSlippageChange = (value: number) => {
    // Update slippage value
  };

  // Destructure swap values with defaults
  const {
    fromToken: swapFromToken,
    toToken: swapToToken,
    toAmount: swapToAmount,
    loading: swapLoading,
    error: swapError,
    priceImpact,
    routes: swapRoutes,
    selectedRoute,
    setFromToken: setSwapFromToken,
    setToToken: setSwapToToken,
    setFromAmount: setSwapFromAmount,
    setSlippage: setSwapSlippage,
    setSelectedRoute,
    setSelectedRouteIndex: setSwapSelectedRouteIndex,
    executeSwap: swapExecuteSwap
  } = swap || {
    fromToken: null,
    toToken: null,
    toAmount: '',
    loading: false,
    error: null,
    priceImpact: null,
    routes: [],
    selectedRoute: null,
    setFromToken: () => {},
    setToToken: () => {},
    setFromAmount: () => {},
    setSlippage: () => {},
    setSelectedRoute: () => {},
    setSelectedRouteIndex: () => {},
    executeSwap: async () => 'mock-tx-signature'
  };
  
  // Sync local state with swap state
  useEffect(() => {
    if (swap) {
      setSwapFromAmount?.(localFromAmount);
    }
  }, [localFromAmount, setSwapFromAmount, swap]);
  
  useEffect(() => {
    if (swap) {
      setSwapSlippage?.(localSlippage);
    }
  }, [localSlippage, setSwapSlippage, swap]);
  
  useEffect(() => {
    if (swap) {
      setSwapSelectedRouteIndex?.(localSelectedRouteIndex);
    }
  }, [localSelectedRouteIndex, setSwapSelectedRouteIndex, swap]);

  // Load tokens
  useEffect(() => {
    const loadTokens = async () => {
      // In a real implementation, fetch from Jupiter API
      setTokens([
        {
          symbol: 'SOL',
          name: 'Solana',
          address: 'So11111111111111111111111111111111111111112',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          symbol: 'ANT',
          name: 'ANT Token',
          address: 'YOUR_ANT_TOKEN_MINT_ADDRESS',
          decimals: 9,
          logoURI: 'https://example.com/ant-logo.png'
        }
      ]);
    };

    loadTokens();
  }, []);

  // Update quote when inputs change
  useEffect(() => {
    if (!fromToken || !toToken || !localFromAmount || parseFloat(localFromAmount) <= 0) {
      setToAmount('');
      setRoutes([]);
      return;
    }

    const getQuote = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, fetch from Jupiter API
        // This is mock data
        setTimeout(() => {
          const mockRate = fromToken.symbol === 'SOL' && toToken.symbol === 'ANT' 
            ? 100 
            : fromToken.symbol === 'SOL' && toToken.symbol === 'USDC'
            ? 142.5
            : 0.007;
          
          const calculatedAmount = parseFloat(localFromAmount) * mockRate;
          setToAmount(calculatedAmount.toFixed(toToken.decimals));
          
          // Mock routes
          setRoutes([
            {
              id: 'route-1',
              marketInfos: [
                { id: 'market-1', label: 'Jupiter', inputMint: fromToken.address, outputMint: toToken.address, percent: 100 }
              ],
              outAmount: calculatedAmount.toString(),
              outAmountWithSlippage: (calculatedAmount * 0.995).toString(),
              priceImpactPct: 0.2,
              slippageBps: 50
            },
            {
              id: 'route-2',
              marketInfos: [
                { id: 'market-2', label: 'Orca', inputMint: fromToken.address, outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', percent: 50 },
                { id: 'market-3', label: 'Raydium', inputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', outputMint: toToken.address, percent: 50 }
              ],
              outAmount: (calculatedAmount * 0.99).toString(),
              outAmountWithSlippage: (calculatedAmount * 0.985).toString(),
              priceImpactPct: 0.5,
              slippageBps: 50
            }
          ]);
          
          setSelectedRouteIndex(0);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setError('Failed to fetch quote. Please try again.');
        setLoading(false);
      }
    };

    getQuote();
  }, [fromToken, toToken, localFromAmount]);

const handleConnect = useCallback(async () => {
  if (!wallet.connected) {
    try {
      await wallet.connect();
      return;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      if (toast) {
        toast({
          title: 'Wallet Connection Failed',
          description: 'Please try connecting your wallet again.',
          variant: 'destructive',
        });
      }
      return;
    }
  }

  if (!fromToken || !toToken || !localFromAmount || parseFloat(localFromAmount) <= 0) {
    return;
  }
}, [wallet, fromToken, toToken, localFromAmount, toast]);

const handleSwap = async () => {
  if (!wallet.connected) {
    try {
      await wallet.connect();
      return;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Wallet Connection Failed',
        description: 'Please try connecting your wallet again.',
        variant: 'destructive',
      });
      return;
    }
  }

  if (!fromToken || !toToken || !localFromAmount || parseFloat(localFromAmount) <= 0) {
    return;
  }

  setLoading(true);
  setError(null);

  try {
    // In a real implementation, execute swap via Jupiter API
    // This is a mock
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const txSignature = 'mock-transaction-signature';
    
    handleSwapSuccess(txSignature);
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess(txSignature);
    }
    
    // Reset form
    setLocalFromAmount('');
    setToAmount('');
  } catch (error) {
    console.error('Swap failed:', error);
    setError('Swap failed. Please try again.');
    toast({
      title: 'Swap Failed',
      description: 'There was an error processing your swap.',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};

const switchTokens = () => {
  if (fromToken && toToken) {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setLocalFromAmount(toAmount);
  }
};

// Show loading state if tokens are not loaded yet
if (!fromToken || !toToken) {
  return (
    <div className="w-full max-w-md mx-auto p-4 text-center">
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Loading Tokens</h3>
        <p className="text-muted-foreground text-sm">Please wait while we load token information...</p>
      </div>
    </div>
  );
}

return (
  <div className={cn("w-full max-w-md mx-auto", className)}>
    <Tabs 
      defaultValue="swap" 
      className="w-full"
      onValueChange={setActiveTab}
      value={activeTab}
    >
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="swap">Swap</TabsTrigger>
        <TabsTrigger value="jupiter" className="flex items-center gap-1">
          <Zap className="h-4 w-4" /> Jupiter
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="swap" className="space-y-4">
        <div className="bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden">
          <div className="p-4 border-b border-border/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Swap</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <TokenInput
              token={fromToken}
              amount={localFromAmount}
              onAmountChange={setLocalFromAmount}
              onTokenSelect={() => setShowFromTokenDialog(true)}
              balance={fromTokenBalance?.toString() || '0'}
              loading={loading}
              disabled={loading}
            />

            <div className="flex justify-center -my-2 z-10 relative">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full bg-background border-border/50 hover:bg-muted/50 transition-colors"
                onClick={switchTokens}
                disabled={loading}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            <TokenInput
              token={toToken}
              amount={toAmount}
              onAmountChange={() => {}} // Read-only
              onTokenSelect={() => setShowToTokenDialog(true)}
              disabled={true}
              loading={loading}
              className="opacity-100"
            />

            {routes.length > 0 && (
              <RouteSelector
                routes={routes}
                selectedRouteIndex={selectedRouteIndex}
                onSelectRoute={setSelectedRouteIndex}
              />
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleSwap}
              disabled={!fromToken || !toToken || !localFromAmount || parseFloat(localFromAmount) <= 0 || loading}
              className="w-full h-12 text-base font-medium"
            >
              {!wallet.connected
              ? 'Connect Wallet'
              : !fromToken || !toToken
              ? 'Select Tokens'
              : !localFromAmount || parseFloat(localFromAmount) <= 0
              ? 'Enter Amount'
              : loading
              ? 'Swapping...'
              : 'Swap'}
            </Button>
          </div>
        </div>

      </TabsContent>

      <TabsContent value="jupiter" className="mt-0">
        <div className="bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden p-4">
          <IntegratedJupiterTerminal 
            publicKey={wallet.publicKey}
            connected={wallet.connected}
            onSuccess={(txid: string) => {
              if (isMounted && toast) {
                toast({
                  title: 'Swap Successful',
                  description: 'Your transaction was successful!',
                });
              }
              onSuccess?.(txid);
            }}
            onConnectWallet={async () => {
              try {
                await wallet.connect();
                return true;
              } catch (error) {
                console.error('Failed to connect wallet:', error);
                if (toast) {
                  toast({
                    title: 'Connection Failed',
                    description: 'Failed to connect wallet',
                    variant: 'destructive',
                  });
                }
                return false;
              }
            }}
            className="w-full"
          />
        </div>
      </TabsContent>

        <TabsContent value="history">
          <div className="bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden p-4">
            <TransactionHistory />
          </div>
        </TabsContent>
      </Tabs>

      {/* Token Selection Dialogs */}
      <TokenSelectDialog
        open={showFromTokenDialog}
        onOpenChange={setShowFromTokenDialog}
        tokens={tokens.filter(t => t.address !== toToken?.address)}
        selectedToken={fromToken}
        onSelectToken={setFromToken}
      />

      <TokenSelectDialog
        open={showToTokenDialog}
        onOpenChange={setShowToTokenDialog}
        tokens={tokens.filter(t => t.address !== fromToken?.address)}
        selectedToken={toToken}
        onSelectToken={setToToken}
      />

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Settings</DialogTitle>
          </DialogHeader>
          <SlippageSettings
            slippage={localSlippage}
            onSlippageChange={setLocalSlippage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
