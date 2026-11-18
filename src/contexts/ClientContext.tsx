'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// Define the shape of the context data
type BuyPanelTab = 'stripe' | 'swap' | 'stake' | 'farm';

interface ClientContextType {
  isBuyPanelOpen: boolean;
  setIsBuyPanelOpen: (isOpen: boolean, defaultTab?: BuyPanelTab) => void;
  activeBuyPanelTab: BuyPanelTab;
  setActiveBuyPanelTab: (tab: BuyPanelTab) => void;
}

// Create the context with a default value
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Create a provider component
export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [isBuyPanelOpen, setIsBuyPanelOpen] = useState(false);
  const [activeBuyPanelTab, setActiveBuyPanelTab] = useState<BuyPanelTab>('stripe');

  // Handle opening with optional default tab
  const handleSetIsBuyPanelOpen = (isOpen: boolean, defaultTab?: BuyPanelTab) => {
    setIsBuyPanelOpen(isOpen);
    if (isOpen && defaultTab) {
      setActiveBuyPanelTab(defaultTab);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isBuyPanelOpen,
    setIsBuyPanelOpen: handleSetIsBuyPanelOpen,
    activeBuyPanelTab,
    setActiveBuyPanelTab,
  }), [isBuyPanelOpen, activeBuyPanelTab]);

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

// Create a custom hook to use the client context
export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};
