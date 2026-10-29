declare module 'jupiverse-kit' {
  import { FC } from 'react';

  interface SwapProps {
    rpcUrl: string;
    onSuccess?: (txHash: string) => void;
    onError?: (error: Error) => void;
    className?: string;
    style?: React.CSSProperties;
  }

  export const Swap: FC<SwapProps>;
}
