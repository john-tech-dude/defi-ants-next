# Enhanced Staking Tab

A comprehensive staking interface for DeFi applications, featuring tiered staking, lock periods, liquid staking tokens, and rewards management.

## Features

- **Tiered Staking System**: Multiple tiers (Explorer, Pioneer, Visionary) with increasing APY and benefits
- **Flexible Lock Periods**: Choose from multiple lock periods with APY multipliers
- **Liquid Staking Tokens (stANT)**: Tradeable stANT tokens representing staked positions
- **Comprehensive Rewards**: Track and claim SOL and ANT rewards
- **Responsive Design**: Works on all device sizes
- **Wallet Integration**: Seamless integration with Solana wallet adapters
- **Animated UI**: Smooth animations and transitions for better UX

## Installation

```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js framer-motion lucide-react
```

## Usage

```tsx
import { EnhancedStakingTab } from './components/staking/enhanced';

function App() {
  const { publicKey, connected } = useWallet();
  
  const handleStake = async (amount: number, lockPeriod: string) => {
    // Implement your staking logic here
    console.log(`Staking ${amount} ANT for ${lockPeriod} days`);
  };

  const handleUnstake = async (amount: number) => {
    // Implement your unstaking logic here
    console.log(`Unstaking ${amount} stANT`);
  };

  const handleClaim = async () => {
    // Implement your claim rewards logic here
    console.log('Claiming rewards');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <EnhancedStakingTab
        publicKey={publicKey?.toString()}
        onStake={handleStake}
        onUnstake={handleUnstake}
        onClaim={handleClaim}
        userBalance={1000} // User's ANT balance
        stakedAmount={500} // User's staked amount
        rewards={50} // User's pending rewards in ANT
        apy={15} // Current APY percentage
        totalStaked={1000000} // Total staked in the protocol
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `publicKey` | `string` | No | User's public key from wallet |
| `onStake` | `(amount: number, lockPeriod: string) => Promise<void>` | Yes | Callback when user stakes tokens |
| `onUnstake` | `(amount: number) => Promise<void>` | Yes | Callback when user unstakes tokens |
| `onClaim` | `() => Promise<void>` | Yes | Callback when user claims rewards |
| `userBalance` | `number` | No | User's ANT token balance |
| `stakedAmount` | `number` | No | Amount of tokens currently staked |
| `rewards` | `number` | No | Pending rewards in ANT |
| `apy` | `number` | No | Current APY percentage |
| `totalStaked` | `number` | No | Total tokens staked in the protocol |
| `isLoading` | `boolean` | No | Loading state |
| `error` | `string \| null` | No | Error message to display |

## Staking Tiers

1. **Explorer**
   - 5% APY
   - Min Stake: 1,000 ANT
   - Basic staking rewards

2. **Pioneer**
   - 15% APY
   - Min Stake: 10,000 ANT
   - Enhanced rewards & auto-compounding

3. **Visionary**
   - 25% APY
   - Min Stake: 50,000 ANT
   - Maximum rewards & exclusive features

## Lock Periods

- **Flexible**: 0 days (+0% APY)
- **Short**: 30 days (+20% APY)
- **Medium**: 90 days (+50% APY)
- **Long**: 180 days (+80% APY)
- **Maximum**: 365 days (+150% APY)

## Customization

You can customize the staking tiers and lock periods by modifying the `STAKING_TIERS` and `LOCK_PERIODS` constants in the `types.ts` file.

## License

MIT
