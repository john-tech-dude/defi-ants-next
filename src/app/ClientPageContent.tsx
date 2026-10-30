'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';

// This is a client component that will be rendered on the client side

// Helper function to handle both default and named exports
const lazyImport = async (importFn: () => Promise<any>, exportName?: string) => {
  try {
    const module = await importFn();
    if (exportName && module[exportName]) {
      return { default: module[exportName] };
    }
    return { default: module.default || module };
  } catch (error) {
    console.error('Error in lazyImport:', error);
    throw error;
  }
};

// Loading component for suspense
const LoadingSkeleton = () => (
  <div className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50">
    <div className="container mx-auto px-4">
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full mx-auto mb-8"></div>
          <div className="flex justify-center">
            <div className="h-64 w-64 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Dynamic imports with Suspense
const Tokenomics = dynamic(
  () => import('@/components/features/tokenomics/AnimatedTokenomics').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton />
  }
);

const Roadmap = dynamic(
  () => import('@/components/Roadmap').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton />
  }
);

export default function ClientPageContent() {
  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        <Tokenomics />
      </Suspense>

      <section id="roadmap" className="py-16 md:py-20 lg:py-24">
        <Suspense fallback={<LoadingSkeleton />}>
          <Roadmap />
        </Suspense>
      </section>
    </>
  );
}
