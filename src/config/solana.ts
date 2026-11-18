import { PublicKey } from '@solana/web3.js';

/**
 * Addresses every Solana tutorial uses.
 * Wrapped SOL is the mint Jupiter treats as SOL. It is the same key on every cluster.
 * USDC is the output mint in Jupiter's own swap examples, so a quote can actually route.
 * The stake program is the native program web3.js uses to delegate SOL.
 */
export const WSOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const STAKE_PROGRAM_ID = 'Stake11111111111111111111111111111111111111';
export const MAINNET_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export function isPublicKey(value: string | undefined | null): value is string {
  if (!value) return false;
  try {
    // Reject placeholders such as YOUR_TOKEN_MINT_ADDRESS.
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return false;
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

/** Swap output. A valid NEXT_PUBLIC_TOKEN_MINT overrides the USDC default. */
export function swapOutputMint(): string {
  const fromEnv = process.env.NEXT_PUBLIC_TOKEN_MINT;
  return isPublicKey(fromEnv) ? fromEnv : USDC_MINT;
}
