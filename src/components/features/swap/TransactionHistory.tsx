import { useState, useEffect } from 'react';
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { cn } from '@/lib/utils';

export interface TransactionHistoryProps {
  className?: string;
}

interface Transaction {
  signature: string;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: number;
  inputAmount: string;
  inputSymbol: string;
  outputAmount: string;
  outputSymbol: string;
}

export function TransactionHistory({ className }: TransactionHistoryProps) {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from an API or local storage
        // This is mock data
        setTimeout(() => {
          setTransactions([
            {
              signature: '5xR45ETPVVsYuTTXiZt6EVqQRx6MHyL6HkYHbhLnEidEjxL4ABnUEZhQjrKJkxmJFEfSzuqcCEMFUJ2j4CdUJZ7Z',
              status: 'confirmed',
              timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
              inputAmount: '1.2',
              inputSymbol: 'SOL',
              outputAmount: '120',
              outputSymbol: 'ANT',
            },
            {
              signature: '2xR45ETPVVsYuTTXiZt6EVqQRx6MHyL6HkYHbhLnEidEjxL4ABnUEZhQjrKJkxmJFEfSzuqcCEMFUJ2j4CdUJZ7Z',
              status: 'confirmed',
              timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
              inputAmount: '0.5',
              inputSymbol: 'SOL',
              outputAmount: '50',
              outputSymbol: 'ANT',
            },
            {
              signature: '1xR45ETPVVsYuTTXiZt6EVqQRx6MHyL6HkYHbhLnEidEjxL4ABnUEZhQjrKJkxmJFEfSzuqcCEMFUJ2j4CdUJZ7Z',
              status: 'failed',
              timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
              inputAmount: '2.0',
              inputSymbol: 'SOL',
              outputAmount: '200',
              outputSymbol: 'ANT',
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [publicKey]);

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-medium">Recent Transactions</h3>
      
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-16 bg-muted rounded-lg"></div>
          <div className="h-16 bg-muted rounded-lg"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {transactions.map((tx) => (
            <div
              key={tx.signature}
              className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {tx.status === 'confirmed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : tx.status === 'pending' ? (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">Swap</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-sm mb-1">
                <span>{tx.inputAmount} {tx.inputSymbol}</span>
                <span className="text-muted-foreground mx-1">→</span>
                <span>{tx.outputAmount} {tx.outputSymbol}</span>
              </div>
              
              <div>
                <a
                  href={`https://solscan.io/tx/${tx.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View transaction
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : !publicKey ? (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border/50 rounded-lg">
          Connect your wallet to view transaction history
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border/50 rounded-lg">
          No recent transactions
        </div>
      )}
    </div>
  );
}
