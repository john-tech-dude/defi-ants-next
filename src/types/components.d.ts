declare module '@/components/swap/TokenInput' {
  import { FC } from 'react';
  import { Token } from '@/types/swap';

  interface TokenInputProps {
    token: Token | null;
    amount: string;
    onAmountChange: (amount: string) => void;
    onTokenSelect: () => void;
    balance?: string;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
  }

  export const TokenInput: FC<TokenInputProps>;
}

declare module '@/components/swap/TokenSelectDialog' {
  import { FC } from 'react';
  import { Token } from '@/types/swap';

  interface TokenSelectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tokens: Token[];
    selectedToken: Token | null;
    onSelectToken: (token: Token) => void;
  }

  export const TokenSelectDialog: FC<TokenSelectDialogProps>;
}

declare module '@/components/swap/RouteSelector' {
  import { FC } from 'react';
  import { Route } from '@/types/swap';

  interface RouteSelectorProps {
    routes: Route[];
    selectedRouteIndex: number;
    onSelectRoute: (index: number) => void;
    className?: string;
  }

  export const RouteSelector: FC<RouteSelectorProps>;
}

declare module '@/components/swap/SlippageSettings' {
  import { FC } from 'react';

  interface SlippageSettingsProps {
    slippage: number;
    onSlippageChange: (value: number) => void;
  }

  export const SlippageSettings: FC<SlippageSettingsProps>;
}

declare module '@/components/swap/TokenInfoPanel' {
  import { FC } from 'react';
  import { Token } from '@/types/swap';

  interface TokenInfoPanelProps {
    token: Token;
  }

  export const TokenInfoPanel: FC<TokenInfoPanelProps>;
}

declare module '@/components/swap/TransactionHistory' {
  import { FC } from 'react';

  export const TransactionHistory: FC<{}>;
}

declare module '@/hooks/useSwap' {
  import { Token, Route } from '@/types/swap';

  interface UseSwapReturn {
    fromToken: Token | null;
    toToken: Token | null;
    fromAmount: string;
    toAmount: string;
    loading: boolean;
    error: string | null;
    slippage: number;
    priceImpact: number | null;
    routes: Route[];
    selectedRoute: Route | null;
    selectedRouteIndex: number;
    setFromToken: (token: Token | null) => void;
    setToToken: (token: Token | null) => void;
    setFromAmount: (amount: string) => void;
    setSlippage: (value: number) => void;
    setSelectedRoute: (route: Route | null) => void;
    setSelectedRouteIndex: (index: number) => void;
    executeSwap: () => Promise<string>;
  }

  export function useSwap(): UseSwapReturn;
}
