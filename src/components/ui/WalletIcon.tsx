type WalletType = 'phantom' | 'solflare' | 'metamask' | 'ledger' | 'backpack' | 'brave' | 'coinbase' | 'glow' | 'torus' | 'trust' | 'math' | 'sollet';

interface WalletIconProps {
  wallet: WalletType;
  size?: number;
  className?: string;
  showName?: boolean;
}

const WALLET_ICONS: Record<WalletType, string> = {
  phantom: '/wallets/phantom.svg',
  solflare: '/wallets/solflare.svg',
  metamask: '/wallets/metamask.svg',
  ledger: '/wallets/ledger.svg',
  backpack: '/wallets/backpack.png',
  brave: '/wallets/brave.svg',
  coinbase: '/wallets/coinbase.svg',
  glow: '/wallets/glow.png',
  torus: '/wallets/torus.svg',
  trust: '/wallets/trust.svg',
  math: '/wallets/math.svg',
  sollet: '/wallets/sollet.svg',
};

const WALLET_NAMES: Record<WalletType, string> = {
  phantom: 'Phantom',
  solflare: 'Solflare',
  metamask: 'MetaMask',
  ledger: 'Ledger',
  backpack: 'Backpack',
  brave: 'Brave',
  coinbase: 'Coinbase',
  glow: 'Glow',
  torus: 'Torus',
  trust: 'Trust',
  math: 'Math Wallet',
  sollet: 'Sollet',
};

export function WalletIcon({ wallet, size = 24, className = '', showName = false }: WalletIconProps & { showName?: boolean }) {
  const iconSrc = WALLET_ICONS[wallet] || '/wallets/wallet.svg';

  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={iconSrc}
        alt={`${WALLET_NAMES[wallet]} logo`}
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
        onError={(event) => {
          const img = event.currentTarget;
          if (!img.src.endsWith('/wallets/wallet.svg')) {
            img.src = '/wallets/wallet.svg';
          }
        }}
      />
      {showName && <span className="ml-2 font-medium">{WALLET_NAMES[wallet]}</span>}
    </span>
  );
}

export function WalletIconList({
  wallets,
  onWalletSelect,
  className = '',
}: {
  wallets: WalletType[];
  onWalletSelect?: (wallet: WalletType) => void;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {wallets.map((wallet) => (
        <button
          key={wallet}
          type="button"
          onClick={() => onWalletSelect?.(wallet)}
          className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <WalletIcon wallet={wallet} size={32} showName={true} />
        </button>
      ))}
    </div>
  );
}
