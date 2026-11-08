'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ClientProvider } from '@/contexts/ClientContext';
import { WalletProvider } from './WalletProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root provider component that wraps the application with all necessary providers.
 */
export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  // Only render UI after mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);

    // Suppress known browser extension errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      // Filter out Phantom wallet extension errors and wallet adapter errors
      if (
        message.includes('Unable to set window.solana') ||
        message.includes('ojbcfhjmpigfobfclfflafhblgemeidi') ||
        message.includes('chrome-extension') ||
        message.includes('window.navigator.wallets is not an array')
      ) {
        return; // Suppress these errors
      }
      originalError.apply(console, args);
    };

    return () => {
      setMounted(false);
      console.error = originalError;
    };
  }, []);

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme
      themes={['light', 'dark']}
    >
      <TooltipProvider>
        <ClientProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </ClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
