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
import Roadmap from '@/components/Roadmap';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Container } from '@/components/ui/container';
import BuyPanelWrapper from '@/components/features/swap/BuyPanelWrapper';

// Import client components directly
import ClientPageContent from './ClientPageContent';

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
      <main className="overflow-hidden">
        <section id="hero" className="py-16 md:py-20 lg:py-24">
          <Hero />
        </section>

        <section id="about" className="py-16 md:py-20 lg:py-24">
          <About />
        </section>

        <section
          id="tokenomics"
          className="py-16 md:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/50"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-400/5 via-transparent to-transparent opacity-30" />
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)]" />
          </div>
          <Container>
            <ClientPageContent />
          </Container>
        </section>

        <section
          id="nft"
          className="py-16 md:py-20 lg:py-24 relative overflow-hidden"
        >
          <NFTGallery />
        </section>

        <section
          id="roadmap"
          className="py-16 md:py-20 lg:py-24 relative overflow-hidden"
        >
          <Roadmap />
        </section>

        <section id="community" className="py-16 md:py-20 lg:py-24">
          <ErrorBoundary fallback={<div className="text-center">Error loading Community section</div>}>
            <Container>
              <Community />
            </Container>
          </ErrorBoundary>
        </section>

        <section id="faq" className="py-16 md:py-20 lg:py-24 bg-muted/50">
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
