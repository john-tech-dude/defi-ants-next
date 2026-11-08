'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { createTransition, easings } from '@/lib/animations';
import Link from 'next/link';
import {
  Twitter,
  MessageCircle,
  Github,
  Youtube,
  ArrowUpRight,
  ChevronUp
} from 'lucide-react';

type FooterLinkItem = {
  name: string;
  href: string;
  external?: boolean;
};

type FooterCategory = {
  title: string;
  links: FooterLinkItem[];
};

type SocialLink = {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  color?: string;
};

export default function Footer(): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const logoVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      setIsVisible(false);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Footer links configuration
  const footerLinks: FooterCategory[] = [
    {
      title: 'Product',
      links: [
        { name: 'Token', href: '#tokenomics' },
        { name: 'NFTs', href: '#nft' },
        { name: 'Roadmap', href: '#roadmap' },
        { name: 'Whitepaper', href: '#', external: true },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#', external: true },
        { name: 'Blog', href: '#', external: true },
        { name: 'FAQ', href: '#faq' },
        { name: 'Audit Reports', href: '#', external: true },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Discord', href: 'https://discord.gg/defiant', external: true },
        { name: 'Twitter', href: 'https://twitter.com/defiant_token', external: true },
        { name: 'Telegram', href: 'https://t.me/defiant_token', external: true },
        { name: 'GitHub', href: 'https://github.com/defiant-token', external: true },
      ],
    },
  ];

  // Social media links configuration
  const socialLinks = [
    {
      icon: Twitter,
      href: 'https://twitter.com/defiant_token',
      label: 'Twitter',
      color: 'hover:text-[#1DA1F2]'
    },
    {
      icon: MessageCircle,
      href: 'https://discord.gg/defiant',
      label: 'Discord',
      color: 'hover:text-[#5865F2]'
    },
    {
      icon: MessageCircle,
      href: 'https://t.me/defiant_token',
      label: 'Telegram',
      color: 'hover:text-[#0088cc]'
    },
    {
      icon: Github,
      href: 'https://github.com/defiant-token',
      label: 'GitHub',
      color: 'hover:text-[#6e5494]'
    },
    {
      icon: Youtube,
      href: 'https://youtube.com/defiant_token',
      label: 'YouTube',
      color: 'hover:text-[#FF0000]'
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.footer
            className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 border-t border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(99, 102, 241, 0.3), transparent 50%)',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
            />

            <div className="container-custom py-12 md:py-16 px-4 sm:px-6 relative z-10">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-100px' }}
              >
                {/* Brand Column */}
                <motion.div
                  className="space-y-6"
                  variants={itemVariants}
                >
                  <Link href="/" className="inline-block group">
                    <motion.div
                      className="flex items-center"
                      whileHover={{ scale: 1.02 }}
                      variants={logoVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <span className="text-2xl font-display tracking-wide">
                        <span className="gradient-text">
                          DeFi
                        </span>
                        <span className="text-foreground">
                          {' '}ANT!
                        </span>
                      </span>
                    </motion.div>
                  </Link>

                  <motion.p
                    className="text-muted-foreground/90 leading-relaxed text-sm"
                    variants={itemVariants}
                  >
                    Premium meme coin energy with colony discipline. Tokenomics, NFTs, and a swarm that actually shows up.
                  </motion.p>

                  {/* Social Media */}
                  <motion.div
                    className="flex gap-4"
                    variants={itemVariants}
                  >
                    {socialLinks.map((social: SocialLink, index: number) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center h-10 w-10 rounded-lg bg-muted/50 hover:bg-primary-500/10 transition-colors group relative overflow-hidden text-muted-foreground ${social.color || 'hover:text-primary-500'}`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        variants={itemVariants}
                        aria-label={social.label}
                      >
                        <span className="relative z-10 transition-colors">
                          <social.icon className="h-5 w-5" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-primary-500/5 transition-all duration-300" />
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Navigation Links - 3 columns */}
                {footerLinks.map((category: FooterCategory, index: number) => (
                  <motion.div
                    key={index}
                    className="space-y-4"
                    variants={itemVariants}
                  >
                    <h3 className="text-base font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <ul className="space-y-3">
                      {category.links.map((link: FooterLinkItem, linkIndex: number) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors group flex items-center gap-1"
                          >
                            {link.name}
                            {link.external && (
                              <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom Bar */}
              <motion.div
                className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 }
                }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <div className="text-sm text-muted-foreground">
                  &copy; 2026 <span className="font-medium"><span className="gradient-text">DeFi</span>ANT!</span> All rights reserved.
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                className="mt-8 pt-8 border-t border-border/20"
                initial={{ opacity: 0 }}
                whileInView={{
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.3 }
                }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <p className="text-xs text-center text-muted-foreground/60 leading-relaxed">
                  <span className="font-medium text-foreground/80">Disclaimer:</span> Cryptocurrency investments are subject to high market risk.
                  <span className="gradient-text">DeFi</span>ANT! is not a financial advisor. Please make your investments cautiously.
                  Never invest money you cannot afford to lose.
                </p>
              </motion.div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-colors"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
