import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

declare global {
  interface Window {
    // Phantom Wallet
    solana?: {
      isPhantom?: boolean;
      publicKey?: PublicKey;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      signMessage?: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array }>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
    
    // Solflare Wallet
    solflare?: {
      isSolflare?: boolean;
      publicKey?: PublicKey;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      signMessage?: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array }>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
    };

    // Backpack Wallet
    backpack?: {
      isBackpack?: boolean;
      publicKey?: PublicKey;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      signMessage?: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array }>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
    };

    // Backpack also uses window.xnft
    xnft?: {
      solana?: {
        isBackpack?: boolean;
        publicKey?: PublicKey;
        connect: () => Promise<{ publicKey: PublicKey }>;
        disconnect: () => Promise<void>;
        signTransaction: (transaction: Transaction) => Promise<Transaction>;
        signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
        signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
        on?: (event: string, handler: (...args: any[]) => void) => void;
      };
    };

    // Jupiter Terminal
    Jupiter?: any;

    // Other wallet extensions that might be present
    coinbaseWalletSolana?: {
      isCoinbaseWallet?: boolean;
      publicKey?: PublicKey;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
    };

    // Add index signature to allow any other properties
    [key: string]: any;
  }
}
