import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Token } from '@/types/swap';

export interface TokenSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: Token[];
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
}

export function TokenSelectDialog({
  open,
  onOpenChange,
  tokens,
  selectedToken,
  onSelectToken,
}: TokenSelectDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokens;
    const query = searchQuery.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address.toLowerCase() === query
    );
  }, [tokens, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search token name or paste address"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredTokens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tokens found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  className={cn(
                    'flex w-full items-center gap-3 p-3 text-left hover:bg-muted/50 rounded-lg',
                    selectedToken?.address === token.address ? 'bg-muted' : ''
                  )}
                  onClick={() => {
                    onSelectToken(token);
                    onOpenChange(false);
                  }}
                >
                  {token.logoURI ? (
                    <div className="relative h-8 w-8">
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="h-8 w-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          
                          // Check if fallback already exists
                          if (!target.nextElementSibling?.classList.contains('token-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className =
                              'token-fallback absolute inset-0 flex items-center justify-center rounded-full bg-muted text-xs';
                            fallback.textContent = token.symbol.slice(0, 3);
                            target.parentNode?.insertBefore(fallback, target.nextSibling);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs">
                      {token.symbol.slice(0, 3)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {token.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
