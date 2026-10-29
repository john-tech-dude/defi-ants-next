import { FC } from 'react';
import { Token, Route } from './swap';

declare module '@/components/swap/TokenInput' {
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
  
  const TokenInput: FC<TokenInputProps>;
  export default TokenInput;
}

declare module '@/components/swap/TokenSelectDialog' {
  export interface TokenSelectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tokens: Token[];
    selectedToken: Token | null;
    onSelectToken: (token: Token) => void;
  }
  
  const TokenSelectDialog: FC<TokenSelectDialogProps>;
  export default TokenSelectDialog;
}

declare module '@/components/swap/RouteSelector' {
  export interface RouteSelectorProps {
    routes: Route[];
    selectedRouteIndex: number;
    onSelectRoute: (index: number) => void;
    className?: string;
  }
  
  const RouteSelector: FC<RouteSelectorProps>;
  export default RouteSelector;
}

declare module '@/components/swap/SlippageSettings' {
  export interface SlippageSettingsProps {
    slippage: number;
    onSlippageChange: (value: number) => void;
  }
  
  const SlippageSettings: FC<SlippageSettingsProps>;
  export default SlippageSettings;
}

declare module '@/components/swap/TokenInfoPanel' {
  export interface TokenInfoPanelProps {
    token: Token;
  }
  
  const TokenInfoPanel: FC<TokenInfoPanelProps>;
  export default TokenInfoPanel;
}

declare module '@/components/swap/TransactionHistory' {
  export interface TransactionHistoryProps {
    className?: string;
  }
  
  const TransactionHistory: FC<TransactionHistoryProps>;
  export default TransactionHistory;
}
