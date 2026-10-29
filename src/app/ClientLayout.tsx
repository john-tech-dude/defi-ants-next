'use client';

import * as React from 'react';
import { useClientContext } from '@/contexts/ClientContext';
import BuyPanel from '@/components/features/swap/BuyPanel';
import { AnimatePresence } from 'framer-motion';
import { Inter, Space_Grotesk, Bangers } from 'next/font/google';
import { AnimationProvider } from '@/lib/animations/AnimationContext';
import { Providers } from '@/components/providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { cn } from '@/lib/utils';
import Head from 'next/head';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Load fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Import the wallet modal CSS
import '@solana/wallet-adapter-react-ui/styles.css';



// Simple error fallback component
function ErrorFallback({ error, resetError }: { error: Error | null; resetError: () => void }) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4 bg-background")}>
      <div className={cn("text-center max-w-md")}>
        <h2 className={cn("text-2xl font-bold text-red-500 mb-4")}>
          Something went wrong
        </h2>
        <p className={cn("text-muted-foreground mb-6")}>
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button 
          onClick={resetError}
          className={cn(
            "px-4 py-2 bg-primary text-primary-foreground rounded-md",
            "hover:bg-primary/90 transition-colors"
          )}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Error boundary for the entire app
function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }: { error: Error | null; resetError: () => void }) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
      onError={(error: Error, errorInfo: React.ErrorInfo) => {
        console.error('App Error Boundary caught an error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Simple wrapper to ensure consistent layout structure
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Wrapper component that consumes the context
const BuyPanelWrapper = () => {
  const { isBuyPanelOpen, setIsBuyPanelOpen } = useClientContext();
  
  return (
    <AnimatePresence>
      {isBuyPanelOpen && (
        <BuyPanel onClose={() => setIsBuyPanelOpen(false)} />
      )}
    </AnimatePresence>
  );
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${bangers.variable}`}>
      <Head>
        <title>DeFi Ants</title>
        <meta name="description" content="DeFi Ants - Next Generation DeFi Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Prevent preloading of page.css */}
        <link rel="preload" as="style" href="/_next/static/css/app/page.css" />
        {/* Inline critical CSS */}
        <style jsx global>{`
          html { scroll-behavior: smooth; }
          body { margin: 0; padding: 0; }
          :root {
            --font-sans: ${inter.style.fontFamily};
            --font-body: ${spaceGrotesk.style.fontFamily};
            --font-display: ${bangers.style.fontFamily};
          }
        `}</style>
      </Head>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.variable
      )}>
        <AppErrorBoundary>
          <AnimationProvider>
            <Providers>
              <LayoutWrapper>
                {children}
                <BottomNavbar />
                <BuyPanelWrapper />
                <Analytics />
                <SpeedInsights />
              </LayoutWrapper>
            </Providers>
          </AnimationProvider>
        </AppErrorBoundary>
      </body>
    </html>
  );
}
