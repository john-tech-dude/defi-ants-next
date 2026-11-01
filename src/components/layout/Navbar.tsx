'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import FallbackImage from '../common/FallbackImage';
import WalletConnectButton from '@/components/features/wallet/WalletConnectButton';
import { useClientContext } from '@/contexts/ClientContext';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { cn } from '@/lib/utils';
import ThemeToggle from '../common/ThemeToggle';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Tokenomics', href: '#tokenomics' },
  { name: 'Staking', href: '#staking', isBuyButton: true },
  { name: 'NFTs', href: '#nft' },
  { name: 'Roadmap', href: '#roadmap' },
  { name: 'Community', href: '#community' },
  { name: 'FAQ', href: '#faq' },
];

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { connected, publicKey, walletAddress } = useWalletConnection();
  const { setIsBuyPanelOpen } = useClientContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine which section is currently in view
      const sections = navLinks.filter(link => !link.isBuyButton);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.querySelector(section.href);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [connected]); // Close when wallet connects/disconnects

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-primary-500/20 shadow-2xl shadow-primary-500/10'
          : 'bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-custom py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group relative">
          <motion.span className="text-2xl md:text-3xl font-display tracking-wide">
            <motion.span 
              className="gold-foil"
              whileHover={{ scale: 1.05 }}
            >
              DeFi
            </motion.span>
            <motion.span 
              className="text-foreground"
              whileHover={{ scale: 1.05 }}
            >
              {' '}ANT!
            </motion.span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            link.isBuyButton ? (
              <button
                key={link.name}
                onClick={() => setIsBuyPanelOpen(true)}
                className="px-3 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg transition-all duration-300 relative group text-foreground/80 hover:text-primary-400"
              >
                {link.name}
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-300 group-hover:w-4/5 -translate-x-1/2" />
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg transition-all duration-300 relative group text-foreground/80 hover:text-primary-400"
              >
                {link.name}
                <span className={`absolute bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400
                  transition-all duration-300 -translate-x-1/2 ${activeSection === link.name ? 'w-4/5' : 'w-0 group-hover:w-4/5'}`} />
              </Link>
            )
          ))}
        </div>

        {/* Wallet Connect Button - Desktop Only */}
        <div className="hidden md:flex items-center ml-4">
          <WalletConnectButton 
            className={cn(
              '!h-9 !px-4',
              '!bg-primary-400 hover:!bg-primary-300',
              '!text-primary-foreground !font-display !tracking-wide',
              '!rounded-full !border !border-primary-200/40',
              'transition-all duration-200',
              'shadow-sm hover:shadow-md',
              'flex items-center justify-center',
              'text-sm md:text-base',
              connected ? '!px-3' : '!px-4'
            )} 
          />
        </div>

        <div className="flex items-center md:hidden space-x-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-xl py-4 px-4 z-50"
          >
            <div className="flex flex-col space-y-1 py-2">
              {navLinks.map((link) => (
                link.isBuyButton ? (
                  <button
                    key={link.name}
                    onClick={() => {
                      setIsBuyPanelOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg font-medium transition-colors text-foreground/90 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-left"
                  >
                    <div className="flex items-center">
                      {link.name}
                    </div>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeSection === link.name
                        ? 'text-primary-400 bg-gray-100 dark:bg-gray-800/50'
                        : 'text-foreground/90 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      {link.name === 'NFTs' && <Sparkles className="h-4 w-4 mr-2" />}
                      {link.name}
                    </div>
                  </Link>
                )
              ))}
              
              {/* Mobile Wallet Button */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <WalletConnectButton 
                  className={cn(
                    '!h-10 !w-full',
                    '!bg-primary-400 hover:!bg-primary-300',
                    '!text-primary-foreground !font-display !tracking-wide',
                    '!rounded-lg',
                    'transition-all duration-200',
                    'shadow-sm hover:shadow-md',
                    'flex items-center justify-center',
                    'text-base',
                    connected ? '!px-3' : '!px-4'
                  )} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
