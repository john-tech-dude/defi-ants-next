'use client';

import { useId, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Clock,
  Coins,
  HelpCircle,
  Lock,
  Shield,
  Wallet,
  Zap,
} from 'lucide-react';
import { WalletIcon } from '@/components/ui/WalletIcon';

type WalletId =
  | 'phantom'
  | 'solflare'
  | 'backpack'
  | 'brave'
  | 'glow'
  | 'sollet'
  | 'coinbase'
  | 'torus'
  | 'trust'
  | 'ledger';

const WALLETS: { id: WalletId; name: string }[] = [
  { id: 'phantom', name: 'Phantom' },
  { id: 'solflare', name: 'Solflare' },
  { id: 'backpack', name: 'Backpack' },
  { id: 'brave', name: 'Brave' },
  { id: 'glow', name: 'Glow' },
  { id: 'ledger', name: 'Ledger' },
  { id: 'coinbase', name: 'Coinbase' },
  { id: 'trust', name: 'Trust' },
  { id: 'torus', name: 'Torus' },
  { id: 'sollet', name: 'Sollet' },
];

const STAKING_WALLETS = WALLETS.filter((wallet) =>
  ['phantom', 'solflare', 'backpack', 'ledger'].includes(wallet.id)
);

function WalletMark({ id, size = 28 }: { id: WalletId; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#0c1222] ring-1 ring-white/10"
      style={{ width: size + 10, height: size + 10 }}
    >
      <WalletIcon wallet={id} size={size} />
    </span>
  );
}

function WalletRow({ wallets }: { wallets: { id: WalletId; name: string }[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {wallets.map((wallet) => (
        <li key={wallet.id}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 text-sm text-foreground">
            <WalletMark id={wallet.id} size={20} />
            {wallet.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

type FaqItem = {
  id: string;
  question: string;
  icon: LucideIcon;
  answer: ReactNode;
};

const FAQS: FaqItem[] = [
  {
    id: 'what-is',
    question: 'What is DeFi ANT?',
    icon: Zap,
    answer: (
      <div className="space-y-4">
        <p>
          DeFi ANT is a Solana platform for staking, yield, and NFTs. The product is built around
          audited contracts, fast settlement, and an interface you can follow without a manual.
        </p>
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Use only the official site and contracts. A lookalike page is the usual way tokens get taken.
        </p>
      </div>
    ),
  },
  {
    id: 'stake',
    question: 'How do I stake ANT?',
    icon: Coins,
    answer: (
      <div className="space-y-4">
        <p>Staking uses a Streamflow pool with a fixed emission schedule. Join the waitlist now; the pool launches approximately 30 days after graduation, once volume is steady.</p>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <span className="font-medium text-foreground">Connect a Solana wallet.</span>
            <WalletRow wallets={STAKING_WALLETS} />
          </li>
          <li>Join the staking waitlist.</li>
          <li>When the pool launches, select your tier (Explorer, Pioneer, or Visionary).</li>
          <li>Enter the amount of ANT you want to stake.</li>
          <li>Review the lock period and confirm the transaction.</li>
        </ol>
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm">
            <span className="font-medium text-foreground">Estimated variable APY.</span>{' '}
            Calculated as (annual emission / total staked). Changes with total staked. No fixed APY is guaranteed.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'risks',
    question: 'What are the risks of staking?',
    icon: Shield,
    answer: (
      <div className="space-y-4">
        <p>Staking carries several risks. Stake only what you can afford to lock up.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
              Smart contract risk
            </div>
            <p className="text-sm">The Streamflow pool is a smart contract. Bugs or exploits could result in loss of staked tokens.</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Lock periods
            </div>
            <p className="text-sm">Tokens are locked for 30, 90, or 180 days depending on your tier. You cannot unstake early.</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
              Possible loss of value
            </div>
            <p className="text-sm">The token price may drop while your tokens are locked. Rewards end when the pool is depleted.</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
              Variable rewards
            </div>
            <p className="text-sm">Rewards are not guaranteed. The estimated APY changes with total staked amount.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'rewards',
    question: 'How are rewards calculated?',
    icon: BarChart3,
    answer: (
      <div className="space-y-4">
        <p>Rewards come from a fixed pool of 50,000,000 $ANTS, released over 24 months. The emission is funded by a locked token reserve plus PumpSwap creator fees.</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Fixed emission schedule.</span> Rewards are released linearly over 24 months, not by a fixed APY.
          </li>
          <li>
            <span className="font-medium text-foreground">Variable estimated APY.</span> Calculated as (annual emission / total staked). As more people stake, the estimated APY decreases.
          </li>
          <li>
            <span className="font-medium text-foreground">Tier multipliers.</span> Explorer (30-day lock, 1.0x), Pioneer (90-day lock, 1.5x), Visionary (180-day lock, 2.5x). Multipliers are subject to final pool configuration.
          </li>
          <li>
            <span className="font-medium text-foreground">Pool depletion.</span> Rewards end when the 50M $ANTS pool is empty, even if the 24-month period has not passed.
          </li>
        </ul>
        <p className="text-sm">
          Example: If 20% of supply (200M ANT) is staked, the estimated variable rate is about 12.5% per year. At 30% staked, it drops to about 8.3%. These are estimates and not guarantees.
        </p>
      </div>
    ),
  },
  {
    id: 'wallets',
    question: 'Which wallets can I connect?',
    icon: Wallet,
    answer: (
      <div className="space-y-4">
        <p>These are the wallets this site loads. Each one connects on Solana.</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {WALLETS.map((wallet) => (
            <li key={wallet.id}>
              <div className="flex h-full items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
                <WalletMark id={wallet.id} size={28} />
                <span className="text-sm font-medium text-foreground">{wallet.name}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          Missing a wallet you use?{' '}
          <a className="font-medium text-primary hover:underline" href="mailto:support@defiant.finance">
            Email support
          </a>{' '}
          and we will look at adding it.
        </p>
      </div>
    ),
  },
];

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const reactId = useId();
  const panelId = `${reactId}-panel`;
  const Icon = item.icon;

  return (
    <div className={`rounded-2xl border bg-background/80 transition-colors ${open ? 'border-primary/40' : 'border-border'}`}>
      <h3>
        <button
          type="button"
          id={`${reactId}-button`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex-1 text-base font-semibold text-foreground sm:text-lg">{item.question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${reactId}-button`}
        hidden={!open}
      >
        <div className="px-4 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pl-[4.25rem]">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 text-center">
        <div className="section-kicker mb-4">
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          FAQ
        </div>
        <h2 className="text-3xl font-display tracking-wide text-foreground sm:text-4xl">
          Frequently asked <span className="gradient-text">questions</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
          Staking, rewards, and the wallets you can connect.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item) => (
          <FaqRow
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
          />
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-background/80 px-6 py-8 text-center">
        <h3 className="text-xl font-semibold text-foreground">Still have a <span className="gradient-text">question?</span></h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The community channel is the fastest place to ask. Support answers email during the week.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://t.me/defiant_token"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Join the community
            <ArrowUpRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="mailto:support@defiant.finance"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
