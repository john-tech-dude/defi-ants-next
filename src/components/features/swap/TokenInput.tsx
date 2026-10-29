import { ChevronDown } from 'lucide-react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Token } from '@/types/swap';

export interface TokenInputProps {
  token: Token | null;
  amount: string;
  onAmountChange: (amount: string) => void;
  onTokenSelect: () => void;
  balance?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TokenInput({
  token,
  amount,
  onAmountChange,
  onTokenSelect,
  balance,
  loading = false,
  disabled = false,
  className,
}: TokenInputProps) {
  return (
    <div className={cn('bg-muted/20 rounded-xl p-3 border border-border/30', className)}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-muted-foreground">
          {disabled ? 'You receive' : 'You pay'}
        </label>
        {balance !== undefined && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Balance: {balance}</span>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 text-xs px-1.5 text-primary hover:text-primary/80"
                onClick={() => onAmountChange(balance)}
                disabled={!balance || disabled}
              >
                MAX
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTokenSelect}
          className={cn(
            "flex items-center gap-2 h-10 px-3",
            disabled ? "opacity-70" : "hover:bg-muted/50"
          )}
          disabled={disabled}
        >
          {token?.logoURI ? (
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="h-5 w-5 rounded-full"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                
                if (token?.symbol) {
                  const fallback = document.createElement('div');
                  fallback.className = 'flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs';
                  fallback.textContent = token.symbol.slice(0, 3);
                  target.parentNode?.insertBefore(fallback, target);
                }
              }}
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
              {token?.symbol?.slice(0, 3) || '---'}
            </div>
          )}
          <span className="font-medium">{token?.symbol || 'Select'}</span>
          {!disabled && <ChevronDown className="h-4 w-4 opacity-50" />}
        </Button>
        <Input
          type="text"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
              onAmountChange(value);
            }
          }}
          placeholder="0.0"
          className={cn(
            "border-0 bg-transparent text-right text-2xl font-medium p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0",
            disabled && "opacity-70"
          )}
          disabled={!token || disabled || loading}
        />
      </div>
    </div>
  );
}
