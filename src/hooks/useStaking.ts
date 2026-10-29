import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import idl from '../config/staking.json';

export interface StakingData {
  stakedAmount: number;
  antBalance: number;
  stantBalance: number;
  pendingRewards: {
    sol: number;
    ant: number;
    usdc: number;
  };
  lifetimeRewards: {
    sol: number;
    ant: number;
    usdc: number;
  };
  portfolioValue: number;
  dayChange: number;
  tierLevel: string;
  lockEndsAt: number | null;
}

const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID || '');
const TOKEN_MINT = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT || '');

export const useStaking = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stakingData, setStakingData] = useState<StakingData>({
    stakedAmount: 0,
    antBalance: 0,
    stantBalance: 0,
    pendingRewards: { sol: 0, ant: 0, usdc: 0 },
    lifetimeRewards: { sol: 0, ant: 0, usdc: 0 },
    portfolioValue: 0,
    dayChange: 0,
    tierLevel: 'Explorer',
    lockEndsAt: null,
  });

  // Get provider
  const getProvider = useCallback(() => {
    if (!publicKey) throw new WalletNotConnectedError();
    
    const provider = new AnchorProvider(
      connection,
      { publicKey } as any,
      { commitment: 'confirmed' }
    );
    
    return new Program(idl as any, PROGRAM_ID, provider);
  }, [connection, publicKey]);

  // Fetch staking data
  const fetchStakingData = useCallback(async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const program = getProvider();
      // Fetch user's staking account
      const [userStakeAccount] = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), TOKEN_MINT.toBuffer()],
        PROGRAM_ID
      );
      
      // Fetch token accounts and calculate balances
      const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
        mint: TOKEN_MINT
      });
      
      // Get token info to handle decimals
      const token = new Token(
        connection,
        TOKEN_MINT,
        TOKEN_PROGRAM_ID,
        publicKey
      );
      
      let antBalance = 0;
      for (const account of tokenAccounts.value) {
        try {
          const accountInfo = await connection.getParsedAccountInfo(account.pubkey);
          if (accountInfo.value?.data && 'parsed' in accountInfo.value.data) {
            const parsedInfo = accountInfo.value.data.parsed.info;
            if (parsedInfo.mint === TOKEN_MINT.toString()) {
              const decimals = parsedInfo.tokenAmount.decimals;
              const amount = parsedInfo.tokenAmount.uiAmount;
              antBalance += amount;
            }
          }
        } catch (err) {
          console.error('Error fetching token account info:', err);
        }
      }
      
      // Fetch staking account data
      let stakedAmount = 0;
      let stantBalance = 0;
      let pendingRewards = { sol: 0, ant: 0, usdc: 0 };
      
      try {
        const stakeAccount = await program.account.stakeAccount.fetch(userStakeAccount);
        stakedAmount = stakeAccount.amount.toNumber() / LAMPORTS_PER_SOL;
        // Calculate rewards based on staking duration and tier
        // This is a simplified example
        pendingRewards = {
          sol: stakedAmount * 0.001, // Example APR calculation
          ant: stakedAmount * 0.05,
          usdc: stakedAmount * 0.12,
        };
      } catch (err) {
        console.log('No staking account found');
      }
      
      setStakingData(prev => ({
        ...prev,
        stakedAmount,
        antBalance,
        stantBalance,
        pendingRewards,
      }));
      
    } catch (err) {
      console.error('Failed to fetch staking data:', err);
      setError('Failed to load staking data');
    } finally {
      setLoading(false);
    }
  }, [connection, getProvider, publicKey]);

  // Stake tokens
  const stake = useCallback(async (amount: number, lockPeriod: number) => {
    if (!publicKey) throw new WalletNotConnectedError();
    
    setLoading(true);
    setError(null);
    
    try {
      const program = getProvider();
      const [userStakeAccount, userStakeAccountBump] = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), TOKEN_MINT.toBuffer()],
        PROGRAM_ID
      );
      
      // Create stake account if it doesn't exist
      const tx = await program.rpc.stake(
        new BN(amount * LAMPORTS_PER_SOL),
        new BN(lockPeriod),
        userStakeAccountBump,
        {
          accounts: {
            user: publicKey,
            userStakeAccount,
            tokenMint: TOKEN_MINT,
            systemProgram: SystemProgram.programId,
          },
        }
      );
      
      // Refresh data
      await fetchStakingData();
      return tx;
      
    } catch (err) {
      console.error('Staking failed:', err);
      setError('Staking transaction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStakingData, getProvider, publicKey]);

  // Unstake tokens
  const unstake = useCallback(async (amount: number) => {
    if (!publicKey) throw new WalletNotConnectedError();
    
    setLoading(true);
    setError(null);
    
    try {
      const program = getProvider();
      const [userStakeAccount] = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), TOKEN_MINT.toBuffer()],
        PROGRAM_ID
      );
      
      const tx = await program.rpc.unstake(
        new BN(amount * LAMPORTS_PER_SOL),
        {
          accounts: {
            user: publicKey,
            userStakeAccount,
            tokenMint: TOKEN_MINT,
          },
        }
      );
      
      await fetchStakingData();
      return tx;
      
    } catch (err) {
      console.error('Unstaking failed:', err);
      setError('Unstaking transaction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStakingData, getProvider, publicKey]);

  // Claim rewards
  const claimRewards = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    
    setLoading(true);
    setError(null);
    
    try {
      const program = getProvider();
      const [userStakeAccount] = await PublicKey.findProgramAddress(
        [publicKey.toBuffer(), TOKEN_MINT.toBuffer()],
        PROGRAM_ID
      );
      
      const tx = await program.rpc.claimRewards({
        accounts: {
          user: publicKey,
          userStakeAccount,
          tokenMint: TOKEN_MINT,
        },
      });
      
      await fetchStakingData();
      return tx;
      
    } catch (err) {
      console.error('Claim rewards failed:', err);
      setError('Failed to claim rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStakingData, getProvider, publicKey]);

  // Update data periodically
  useEffect(() => {
    if (!publicKey) return;
    
    fetchStakingData();
    const interval = setInterval(fetchStakingData, 30000); // Refresh every 30s
    
    return () => clearInterval(interval);
  }, [fetchStakingData, publicKey]);

  return {
    stakingData,
    loading,
    error,
    stake,
    unstake,
    claimRewards,
    refresh: fetchStakingData,
  };
};
