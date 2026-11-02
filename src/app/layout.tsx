import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, Bangers } from 'next/font/google';
import { Providers } from '@/components/providers';
import ThemeToggle from '@/components/common/ThemeToggle';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'DeFi ANT! | $ANTS',
  description: 'Premium meme coin on Solana. The colony takes over.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
      { rel: 'icon', url: '/favicon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0c0907',
};

// This is a server component by default
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${bangers.variable}`} suppressHydrationWarning>
      <head>
        <Script
          src="https://terminal.jup.ag/main-v4.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <div className="fixed bottom-6 right-6 z-50">
            <ThemeToggle />
          </div>
        </Providers>
      </body>
    </html>
  );
}
