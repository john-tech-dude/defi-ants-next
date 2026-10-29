import { useState, useEffect, useRef } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Token } from '@/types/swap';
import { cn } from '@/lib/utils';

export interface TokenInfoPanelProps {
  token: Token | null;
  className?: string;
}

export function TokenInfoPanel({ token, className }: TokenInfoPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!token || !expanded) {
      return;
    }

    const fetchTokenData = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from an API
        // This is mock data
        setTimeout(() => {
          setTokenData({
            price: token.symbol === 'SOL' ? 142.58 : token.symbol === 'USDC' ? 1.00 : 0.85,
            priceChange24h: token.symbol === 'SOL' ? 2.4 : token.symbol === 'USDC' ? 0.01 : -0.7,
            marketCap: token.symbol === 'SOL' ? '5.2B' : token.symbol === 'USDC' ? '25B' : '120M',
            volume24h: token.symbol === 'SOL' ? '320M' : token.symbol === 'USDC' ? '1.2B' : '3.2M',
            holders: token.symbol === 'SOL' ? '1.2M' : token.symbol === 'USDC' ? '3.5M' : '12.4K',
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching token data:', error);
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [token, expanded]);

  if (!token) return null;

  return (
    <div className={cn('border border-border/50 rounded-lg overflow-hidden', className)}>
      <button
        className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {token.logoURI && !imageError ? (
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="h-6 w-6 rounded-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
              {token.symbol.slice(0, 3)}
            </div>
          )}
          <div>
            <div className="font-medium">{token.name}</div>
            <div className="text-xs text-muted-foreground">{token.symbol}</div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="p-3 border-t border-border/30 space-y-3">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ) : tokenData ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <div className="text-right">
                  <span className="font-medium">${tokenData.price}</span>
                  <span className={cn(
                    'text-xs ml-1',
                    tokenData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <span className="font-medium">${tokenData.marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">24h Volume</span>
                <span className="font-medium">${tokenData.volume24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Holders</span>
                <span className="font-medium">{tokenData.holders}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://solscan.io/token/${token.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View on Solscan
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-2">
              No data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
