'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClientContext } from '@/contexts/ClientContext';
import BuyPanel from './BuyPanel';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function BuyPanelWrapper() {
  const { isBuyPanelOpen, setIsBuyPanelOpen } = useClientContext();

  const handleClose = () => {
    setIsBuyPanelOpen(false);
  };

  return (
    <AnimatePresence>
      {isBuyPanelOpen && (
        <ErrorBoundary fallback={<div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">Error loading buy panel</div>}>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] overflow-auto m-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <BuyPanel onClose={handleClose} />
            </motion.div>
          </motion.div>
        </ErrorBoundary>
      )}
    </AnimatePresence>
  );
}
