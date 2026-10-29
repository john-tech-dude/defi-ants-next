'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useClientContext } from '@/contexts/ClientContext';

// Dynamic imports for client components
const BuyPanel = dynamic(
  () => import('@/components/features/swap/BuyPanel'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
);

const ClientComponents = () => {
  const { isBuyPanelOpen, setIsBuyPanelOpen } = useClientContext();
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true on client-side mount
  useEffect(() => {
    setIsMounted(true);
    
    // Debug log to see if context is working
    console.log('ClientComponents mounted, isBuyPanelOpen:', isBuyPanelOpen);
    
    // Ensure we're on the client side
    if (typeof window !== 'undefined') {
      // Listen for a custom event to manually trigger the buy panel
      const openBuyPanel = () => setIsBuyPanelOpen(true);
      window.addEventListener('openBuyPanel', openBuyPanel);
      return () => window.removeEventListener('openBuyPanel', openBuyPanel);
    }
  }, []);

  // Handle body overflow when buy panel is open
  useEffect(() => {
    console.log('BuyPanel state changed:', isBuyPanelOpen);
    if (isBuyPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBuyPanelOpen]);

  // Don't render anything on the server
  if (!isMounted) {
    return null;
  }


  return (
    <>
      <ThemeToggle />
      <div className="relative z-[100]">
        <AnimatePresence>
          {isBuyPanelOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <BuyPanel onClose={() => setIsBuyPanelOpen(false)} />
            </div>
          )}
        </AnimatePresence>
      </div>
      {/* Debug button - remove in production */}
      {process.env.NODE_ENV !== 'production' && (
        <button 
          onClick={() => setIsBuyPanelOpen(true)}
          className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded shadow z-50 text-sm"
        >
          Debug: Open Buy Panel
        </button>
      )}
    </>
  );
};

export default ClientComponents;
