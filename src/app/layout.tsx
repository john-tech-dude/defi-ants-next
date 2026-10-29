import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import ThemeToggle from '@/components/common/ThemeToggle';
import Script from 'next/script';
import './globals.css';

// Load font with display swap to prevent layout shift
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'DeFi ANT',
  description: 'The Future of Decentralized Finance',
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
  themeColor: '#ffffff',
};

// This is a server component by default
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          src="https://terminal.jup.ag/main-v4.js" 
          strategy="beforeInteractive" 
          data-preload 
          defer 
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
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
