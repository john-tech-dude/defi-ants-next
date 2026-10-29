# Wallet Integration Guide

This guide explains how to use the wallet integration components and hooks in the DeFi Ants application.

## Components

### 1. `WalletProvider`

The root provider component that should wrap your application to provide wallet functionality.

```tsx
import { WalletProvider } from '@/components/providers/WalletProvider';

function App({ children }) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
}
```

### 2. `WalletConnectButton`

A pre-styled button component that handles wallet connection and displays wallet status.

```tsx
import { WalletConnectButton } from '@/components/features/wallet/WalletConnectButton';

function Navbar() {
  return (
    <nav>
      {/* Other nav items */}
      <WalletConnectButton className="ml-auto" />
    </nav>
  );
}
```

### 3. `WalletStatus`

A component that displays detailed wallet information including balance, connection status, and quick actions.

```tsx
import { WalletStatus } from '@/components/features/wallet/WalletStatus';

function Sidebar() {
  return (
    <aside>
      {/* Other sidebar content */}
      <WalletStatus />
    </aside>
  );
}
```

## Hooks

### `useWalletConnection`

A custom hook that provides wallet connection state and methods.

```tsx
import { useWalletConnection } from '@/hooks/useWalletConnection';

function MyComponent() {
  const {
    isConnected,
    isConnecting,
    walletAddress,
    walletName,
    connect,
    disconnect,
    formatAddress,
    getBalance,
    status,
  } = useWalletConnection();

  // Use the wallet state and methods
}
```

## Best Practices

1. **Error Handling**: Always wrap wallet operations in try/catch blocks and provide user feedback.
2. **Loading States**: Show loading indicators during async operations like connecting or fetching balance.
3. **User Feedback**: Use toast notifications to inform users about the status of their wallet operations.
4. **Security**: Never store private keys or mnemonic phrases in the application state or local storage.
5. **Testing**: Use the Storybook stories to test different wallet states during development.

## Troubleshooting

### Common Issues

1. **Wallet Not Connecting**
   - Ensure the wallet extension is installed and unlocked
   - Check the browser console for any error messages
   - Try disconnecting and reconnecting the wallet

2. **Incorrect Network**
   - Verify that the wallet is connected to the correct network (mainnet/devnet)
   - Check the `NEXT_PUBLIC_SOLANA_NETWORK` environment variable

3. **Transaction Failures**
   - Ensure the wallet has enough SOL for transaction fees
   - Check the transaction in a Solana explorer for more details

## Environment Variables

The following environment variables are used for wallet configuration:

- `NEXT_PUBLIC_SOLANA_NETWORK`: The Solana network to connect to (e.g., 'mainnet-beta', 'devnet')
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Optional custom RPC endpoint URL
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID (required for WalletConnect support)

## Additional Resources

- [Solana Wallet Adapter Documentation](https://github.com/solana-labs/wallet-adapter)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Solana Cookbook](https://solanacookbook.com/)
