import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
import { TransactionStatus, TxStatus } from '../types';

interface StatusConfig {
  icon: React.ReactNode;
  bg: string;
  text: string;
}

interface StatusMessageProps {
  txStatus: TransactionStatus;
  className?: string;
}

const statusConfigs: Record<Exclude<TxStatus, 'idle'>, StatusConfig> = {
  pending: { 
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
    bg: 'bg-yellow-500/10 border border-yellow-500/20',
    text: 'text-yellow-400'
  },
  success: { 
    icon: <CheckCircle className="h-5 w-5" />,
    bg: 'bg-green-500/10 border border-green-500/20',
    text: 'text-green-400'
  },
  error: { 
    icon: <XCircle className="h-5 w-5" />,
    bg: 'bg-red-500/10 border border-red-500/20',
    text: 'text-red-400'
  }
};

export const StatusMessage = ({ txStatus, className }: StatusMessageProps) => {
  if (txStatus.status === 'idle') return null;
  
  const statusConfig = statusConfigs[txStatus.status];
  
  if (!statusConfig) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("p-3 rounded-lg mb-6 flex items-start", statusConfig.bg, className)}
    >
      <span className={cn("mr-2", statusConfig.text)}>
        {statusConfig.icon}
      </span>
      <p className="text-sm">{txStatus.message}</p>
      {txStatus.txHash && (
        <a
          href={`https://explorer.solana.com/tx/${txStatus.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-blue-400 hover:underline flex items-center"
        >
          <span>View</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      )}
    </motion.div>
  );
};
