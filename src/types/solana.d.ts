import { PublicKey, Transaction } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      publicKey?: PublicKey;
      connect: () => Promise<{ publicKey: PublicKey }>;
      signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
      on: (event: string, handler: (args: any) => void) => void;
      request: (args: any) => Promise<any>;
    };
  }
}

export {}; // This file needs to be a module
