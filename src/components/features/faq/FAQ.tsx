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
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <span className="font-medium text-foreground">Connect a Solana wallet.</span>
            <WalletRow wallets={STAKING_WALLETS} />
          </li>
          <li>Open the Staking section.</li>
          <li>Enter the amount of ANT you want to stake.</li>
          <li>Review the terms and the current rate before you sign.</li>
          <li>Confirm the transaction in your wallet.</li>
        </ol>
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm">
            <span className="font-medium text-foreground">Current staking APY: 12.5%.</span>{' '}
            The rate moves with network conditions.
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
        <p>
          Staking can lose value. Smart-contract bugs, slashing, and market moves are all possible.
          Stake only what you can afford to lock up.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
              Smart contract risk
            </div>
            <p className="text-sm">Contracts are audited. An audit does not remove every bug.</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              7-day unbonding
            </div>
            <p className="text-sm">Unstaking requests wait seven days before tokens unlock.</p>
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
        <p>Rewards follow three inputs:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Amount staked.</span> A larger position earns more.
          </li>
          <li>
            <span className="font-medium text-foreground">Time staked.</span> Longer positions can qualify for a bonus.
          </li>
          <li>
            <span className="font-medium text-foreground">Network fees.</span> A share of fees is paid to stakers.
          </li>
        </ul>
        <dl className="grid gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Daily</dt>
            <dd className="font-medium text-foreground">0.034%</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Weekly bonus</dt>
            <dd className="font-medium text-foreground">+5%</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Monthly bonus</dt>
            <dd className="font-medium text-foreground">+15%</dd>
          </div>
        </dl>
        <p className="text-sm">
          Example at 12.5% APY: 10,000 ANT staked returns about 1,250 ANT a year, or about 3.42 ANT a day.
          The live rate can differ.
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
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          FAQ
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
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
        <h3 className="text-xl font-semibold text-foreground">Still have a question?</h3>
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
