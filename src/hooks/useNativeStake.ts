'use client';

import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Authorized,
  LAMPORTS_PER_SOL,
  Lockup,
  PublicKey,
  StakeProgram,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

const FEE_RESERVE_SOL = 0.02;
const ACTIVE_EPOCH = '18446744073709551615';

type StakeRow = {
  pubkey: PublicKey;
  lamports: number;
  delegated: number;
  active: boolean;
};

function toSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

export function useNativeStake() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [solBalance, setSolBalance] = useState(0);
  const [stakedSol, setStakedSol] = useState(0);
  const [withdrawableSol, setWithdrawableSol] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async (): Promise<StakeRow[]> => {
    if (!publicKey) return [];

    const accounts = await connection.getParsedProgramAccounts(StakeProgram.programId, {
      commitment: 'confirmed',
      filters: [
        { dataSize: StakeProgram.space },
        { memcmp: { offset: 12, bytes: publicKey.toBase58() } },
      ],
    });

    return accounts.flatMap((account) => {
      const data = account.account.data;
      if (!('parsed' in data)) return [];
      const info = data.parsed?.info;
      const delegation = info?.stake?.delegation;
      const delegated = Number(delegation?.stake ?? 0);
      const active = delegation?.deactivationEpoch === ACTIVE_EPOCH;
      return [{
        pubkey: account.pubkey,
        lamports: account.account.lamports,
        delegated,
        active,
      }];
    });
  }, [connection, publicKey]);

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setSolBalance(0);
      setStakedSol(0);
      setWithdrawableSol(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const lamports = await connection.getBalance(publicKey, 'confirmed');
      setSolBalance(toSol(lamports));
    } catch (err: any) {
      console.error('Failed to load SOL balance:', err);
      const isRateLimit = err?.message?.includes('403') || err?.code === 403;
      setError(isRateLimit
        ? 'RPC rate limited. Configure a dedicated RPC endpoint in .env.local (e.g., Helius, QuickNode, Alchemy).'
        : 'Could not load the SOL balance from the mainnet RPC.');
      setLoading(false);
      return;
    }

    try {
      const rows = await loadAccounts();
      setStakedSol(toSol(rows.filter((row) => row.active).reduce((sum, row) => sum + row.delegated, 0)));
      setWithdrawableSol(toSol(rows.filter((row) => !row.active).reduce((sum, row) => sum + row.lamports, 0)));
    } catch (err) {
      console.error('Failed to load stake accounts:', err);
      setError('SOL balance loaded. Stake accounts could not be read from this RPC.');
    } finally {
      setLoading(false);
    }
  }, [connection, loadAccounts, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const send = useCallback(async (tx: Transaction) => {
    if (!publicKey) throw new Error('Connect a wallet on Solana mainnet first.');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    tx.feePayer = publicKey;
    tx.recentBlockhash = blockhash;
    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
    return signature;
  }, [connection, publicKey, sendTransaction]);

  const stake = useCallback(async (amount: number) => {
    if (!publicKey) throw new Error('Connect a wallet on Solana mainnet first.');
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a SOL amount to stake.');

    const lamports = Math.round(amount * LAMPORTS_PER_SOL);
    const rent = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);
    if (lamports < rent) {
      throw new Error(`Stake at least ${toSol(rent).toFixed(4)} SOL so the stake account can pay rent.`);
    }

    const balance = await connection.getBalance(publicKey, 'confirmed');
    const reserve = Math.round(FEE_RESERVE_SOL * LAMPORTS_PER_SOL);
    if (lamports + reserve > balance) {
      throw new Error(`Leave ${FEE_RESERVE_SOL} SOL in the wallet for fees. Available to stake: ${toSol(Math.max(0, balance - reserve)).toFixed(4)} SOL.`);
    }

    const votes = await connection.getVoteAccounts('confirmed');
    const validator = votes.current.sort((a, b) => b.activatedStake - a.activatedStake)[0];
    if (!validator) throw new Error('No active validator was returned by the network.');

    const seed = `stake${Date.now()}`.slice(0, 32);
    const stakePubkey = await PublicKey.createWithSeed(publicKey, seed, StakeProgram.programId);
    const tx = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        basePubkey: publicKey,
        seed,
        newAccountPubkey: stakePubkey,
        lamports,
        space: StakeProgram.space,
        programId: StakeProgram.programId,
      }),
      StakeProgram.initialize({
        stakePubkey,
        authorized: new Authorized(publicKey, publicKey),
        lockup: new Lockup(0, 0, publicKey),
      }),
      StakeProgram.delegate({
        stakePubkey,
        authorizedPubkey: publicKey,
        votePubkey: new PublicKey(validator.votePubkey),
      }),
    );

    await send(tx);
    await refresh();
  }, [connection, publicKey, refresh, send]);

  const unstake = useCallback(async (amount: number) => {
    if (!publicKey) throw new Error('Connect a wallet on Solana mainnet first.');
    const rows = (await loadAccounts()).filter((row) => row.active);
    const target = Math.round(amount * LAMPORTS_PER_SOL);
    let remaining = target;
    const tx = new Transaction();

    for (const row of rows.sort((a, b) => b.delegated - a.delegated)) {
      if (remaining <= 0) break;
      tx.add(StakeProgram.deactivate({ stakePubkey: row.pubkey, authorizedPubkey: publicKey }));
      remaining -= row.delegated;
    }

    if (tx.instructions.length === 0) throw new Error('No active stake account to deactivate.');
    await send(tx);
    await refresh();
  }, [loadAccounts, publicKey, refresh, send]);

  const withdraw = useCallback(async () => {
    if (!publicKey) throw new Error('Connect a wallet on Solana mainnet first.');
    const rows = (await loadAccounts()).filter((row) => !row.active && row.lamports > 0);
    if (rows.length === 0) {
      throw new Error('Nothing to withdraw yet. Deactivated stake can be withdrawn after the cooldown epoch.');
    }

    const tx = new Transaction();
    for (const row of rows) {
      tx.add(StakeProgram.withdraw({
        stakePubkey: row.pubkey,
        authorizedPubkey: publicKey,
        toPubkey: publicKey,
        lamports: row.lamports,
      }));
    }

    await send(tx);
    await refresh();
  }, [loadAccounts, publicKey, refresh, send]);

  return {
    solBalance,
    stakedSol,
    withdrawableSol,
    loading,
    error,
    refresh,
    stake,
    unstake,
    withdraw,
  };
}
