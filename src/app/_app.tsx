'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { Inter, Space_Grotesk, Bangers } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AnimationProvider } from '@/lib/animations/AnimationContext';

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

export default function App({ Component, pageProps }: { Component: React.ComponentType<any>, pageProps: any }) {
  const pathname = usePathname();

  // Remove any preloaded CSS links
  useEffect(() => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
    preloadLinks.forEach(link => {
      if (link.getAttribute('href')?.includes('page.css')) {
        link.remove();
      }
    });
    
    // Debug theme class
    console.log('HTML classes:', document.documentElement.className);
  }, [pathname]);
  
  // Force dark mode class on initial load to prevent flashing
  useEffect(() => {
    // Add dark class to prevent flash
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Prevent Next.js from adding preload links */}
        <meta name="next-head-count" content="3" />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          spaceGrotesk.variable,
          bangers.variable
        )}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange
          storageKey="defi-ants-theme"
        >
          <AnimationProvider debug={process.env.NODE_ENV === 'development'}>
            <Component {...pageProps} />
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
