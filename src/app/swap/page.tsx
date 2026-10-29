'use client';

import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';

// Dynamically import the JupiterSwap component with SSR disabled
const JupiterSwap = dynamic(
  () => import('@/components/features/swap/JupiterSwap').then((mod) => mod.JupiterSwap),
  { ssr: false, loading: () => (
    <div className="w-full max-w-xl mx-auto min-h-[500px] flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-64 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      </div>
    </div>
  )}
);

export default function SwapPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border">
          <h1 className="text-2xl font-bold text-center mb-6">Swap Tokens</h1>
          <Suspense fallback={
            <div className="w-full max-w-xl mx-auto min-h-[500px] flex items-center justify-center">
              <div className="animate-pulse">
                <div className="w-64 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          }>
            <JupiterSwap />
          </Suspense>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
