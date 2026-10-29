'use client';

import dynamic from 'next/dynamic';

// Static imports
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import About from '@/components/features/about/About';
import Community from '@/components/features/community/Community';
import FAQ from '@/components/features/faq/FAQ';
import NFTGallery from '@/components/features/nft/NFTGallery';
import FooterComponent from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Container } from '@/components/ui/container';
import BuyPanelWrapper from '@/components/features/swap/BuyPanelWrapper';

// Loading component
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

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <BuyPanelWrapper />
      <main className="space-y-8 md:space-y-12 lg:space-y-16 overflow-hidden">
        <section id="hero" className="py-8 md:py-12 lg:py-16">
          <Hero />
        </section>
        
        <section id="about" className="py-8 md:py-12 lg:py-16">
          <About />
        </section>

        <section
          id="nft"
          className="py-8 md:py-12 lg:py-16 relative overflow-hidden"
        >
          <NFTGallery />
        </section>
        
        <section id="community" className="py-8 md:py-12 lg:py-16">
          <ErrorBoundary fallback={<div className="text-center">Error loading Community section</div>}>
            <Container>
              <Community />
            </Container>
          </ErrorBoundary>
        </section>
        
        <section id="faq" className="py-8 md:py-12 lg:py-16 bg-muted/50">
          <ErrorBoundary fallback={<div className="text-center">Error loading FAQ section</div>}>
            <Container>
              <FAQ />
            </Container>
          </ErrorBoundary>
        </section>
      </main>
      <FooterComponent />
    </div>
  );
}
