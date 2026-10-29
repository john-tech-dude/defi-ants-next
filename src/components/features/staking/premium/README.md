# Premium Staking Panel

A feature-rich staking interface for the DeFiANT platform, providing users with a comprehensive staking experience including tiered rewards, lock periods, and real-time analytics.

## Features

- **Multi-Tab Interface**: Easy navigation between staking, rewards, and portfolio management
- **Tiered Staking**: Multiple staking tiers with increasing benefits (Explorer, Pioneer, Visionary)
- **Flexible Lock Periods**: Choose from flexible to long-term lock periods with increasing APY
- **Real-Time Updates**: Live updates for rewards, portfolio value, and market changes
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Comprehensive Analytics**: Detailed insights into staking performance and rewards
- **Wallet Integration**: Seamless connection with Solana wallet providers

## Installation

```bash
# If using npm
npm install

# If using yarn
yarn install
```

## Usage

```tsx
import { useState } from 'react';
import { PremiumStakingPanel } from './components/staking/PremiumStakingPanel';

function App() {
  const [isStakingPanelOpen, setIsStakingPanelOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsStakingPanelOpen(true)}>
        Open Staking Panel
      </button>
      
      <PremiumStakingPanel 
        isOpen={isStakingPanelOpen}
        onClose={() => setIsStakingPanelOpen(false)}
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls the visibility of the staking panel |
| `onClose` | `() => void` | Yes | Callback when the panel is closed |

## Components

### Tabs

1. **Overview** - Dashboard with portfolio summary and staking stats
2. **Stake** - Interface for staking tokens with lock period selection
3. **DeFi Strategies** - Advanced yield optimization strategies
4. **RWA Farming** - Real World Asset farming opportunities
5. **Tools** - Advanced staking tools and analytics
6. **Rewards** - Track and claim staking rewards
7. **Portfolio** - Detailed portfolio breakdown
8. **Unstake** - Unstake tokens and manage positions

## Styling

The component uses Tailwind CSS for styling. You can customize the appearance by overriding the default styles in your project's CSS file.

## License

MIT
