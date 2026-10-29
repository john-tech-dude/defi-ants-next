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
  ChevronRight, 
  Mail, 
  Globe,
  ChevronUp,
  Menu,
  X,
  Send,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import FallbackImage from '../common/FallbackImage';

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
  icon: React.ReactNode;
  href: string;
  label: string;
  color?: string;
};

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear()
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<number | null>(null);

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
    },
    hover: {
      scale: 1.03,
      transition: createTransition(0.2, easings.easeInOut)
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
  
  const [isVisible, setIsVisible] = useState(false);
  
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setIsSubscribed(true);
      setEmailInput('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '' },
    { code: 'zh', name: '' },
  ];

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
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#', external: true },
        { name: 'Terms of Service', href: '#', external: true },
        { name: 'Disclaimer', href: '#', external: true },
        { name: 'Cookie Policy', href: '#', external: true },
      ],
    },
  ];

  // Social media links configuration
  const socialLinks: SocialLink[] = [
    { 
      icon: <Twitter className="h-5 w-5" />, 
      href: 'https://twitter.com/defiant_token', 
      label: 'Twitter',
      color: 'hover:text-[#1DA1F2]'
    },
    { 
      icon: <MessageCircle className="h-5 w-5" />, 
      href: 'https://discord.gg/defiant', 
      label: 'Discord',
      color: 'hover:text-[#5865F2]'
    },
    { 
      icon: <MessageCircle className="h-5 w-5" />, 
      href: 'https://t.me/defiant_token', 
      label: 'Telegram',
      color: 'hover:text-[#0088cc]'
    },
    { 
      icon: <Github className="h-5 w-5" />, 
      href: 'https://github.com/defiant-token', 
      label: 'GitHub',
      color: 'hover:text-[#6e5494]'
    },
    { 
      icon: <Youtube className="h-5 w-5" />, 
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
            
            <div className="container-custom py-8 md:py-12 lg:py-16 px-4 sm:px-6 relative z-10">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-100px' }}
              >
                {/* Logo and Description */}
                <motion.div 
                  className="lg:col-span-2 space-y-6" 
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
                      <span className="text-2xl font-bold font-display">
                        <span className="text-blue-500 dark:text-blue-400">
                          DeFi 
                        </span>
                        <span className="text-white dark:text-gray-100">
                          ANT!
                        </span>
                      </span>
                    </motion.div>
                  </Link>
                  
                  <motion.p 
                    className="text-muted-foreground/90 leading-relaxed max-w-md text-sm sm:text-base"
                    variants={itemVariants}
                  >
                    A community-driven cryptocurrency with innovative tokenomics, NFT integration, and a mission to build a sustainable DeFi ecosystem.
                  </motion.p>
                  
                  {/* Newsletter Signup */}
                  <motion.div 
                    className="space-y-3"
                    variants={itemVariants}
                  >
                    <h4 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Stay Updated
                    </h4>
                    <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 px-4 py-2 text-sm bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-muted-foreground/50"
                        aria-label="Email address for newsletter"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        aria-label="Subscribe to newsletter"
                      >
                        <Send className="h-4 w-4" />
                        <span className="hidden sm:inline">Subscribe</span>
                      </motion.button>
                    </form>
                    {isSubscribed && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-green-500 dark:text-green-400 flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Successfully subscribed!
                      </motion.p>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-wrap gap-4 sm:gap-6 mb-4 sm:mb-0 justify-center sm:justify-start"
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
                          {social.icon}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:to-primary-500/5 transition-all duration-300" />
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Navigation Links */}
                {footerLinks.map((category: FooterCategory, index: number) => (
                  <motion.div 
                    key={index} 
                    className="space-y-4 sm:space-y-5" 
                    variants={itemVariants}
                  >
                    <motion.button
                      onClick={() => setMobileMenuOpen(mobileMenuOpen === index ? null : index)}
                      className="flex items-center justify-between w-full text-base sm:text-lg font-semibold text-foreground/90 sm:cursor-default"
                      variants={itemVariants}
                    >
                      {category.title}
                      <motion.div className="sm:hidden">
                        {mobileMenuOpen === index ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Menu className="h-4 w-4" />
                        )}
                      </motion.div>
                    </motion.button>
                    <motion.ul 
                      className={`space-y-2 sm:space-y-3 ${mobileMenuOpen === index ? 'block' : 'hidden sm:block'}`}
                      variants={containerVariants}
                    >
                      {category.links.map((link: FooterLinkItem, linkIndex: number) => (
                        <motion.li 
                          key={linkIndex} 
                          variants={itemVariants}
                          whileHover="hover"
                        >
                          <Link 
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group text-sm font-medium"
                          >
                            <span className="relative group-hover:text-primary-500 transition-colors">
                              {link.name}
                            </span>
                            {link.external && (
                              <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary-500" />
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                ))}
              </motion.div>

              {/* Divider */}
              <motion.div 
                className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-12"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ 
                  opacity: 1, 
                  scaleX: 1,
                  transition: { duration: 0.6, ease: 'easeOut' }
                }}
                viewport={{ once: true, margin: '-100px' }}
              />

              {/* Bottom Bar */}
              <motion.div 
                className="flex flex-col lg:flex-row justify-between items-center gap-4 border-t border-border/30 pt-6 sm:pt-8 mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground/70"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 }
                }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                  <p className="text-sm text-muted-foreground">
                    &copy; {currentYear} <span className="font-medium text-foreground">DeFi ANT!</span> All rights reserved.
                  </p>
                  <span className="hidden sm:inline text-muted-foreground/50">•</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                    Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by the community
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                  {/* Language Selector */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline">English</span>
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible">
                      <div className="bg-background border border-border/50 rounded-lg shadow-lg p-2 min-w-[150px]">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setSelectedLanguage(lang.code)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              selectedLanguage === lang.code
                                ? 'bg-primary-500/10 text-primary-500'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            }`}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-1 decoration-muted-foreground/30 hover:decoration-foreground/50"
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-1 decoration-muted-foreground/30 hover:decoration-foreground/50"
                  >
                    Terms of Service
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-1 decoration-muted-foreground/30 hover:decoration-foreground/50"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* Disclaimer */}
            <motion.div 
              className="bg-gradient-to-r from-background/50 via-background/80 to-background/50 border-t border-border/30 py-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: 0.3 }
              }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <div className="container-custom">
                <p className="text-xs text-center text-muted-foreground/80 leading-relaxed max-w-4xl mx-auto flex items-center justify-center gap-2">
                  <Shield className="h-3 w-3 text-foreground/60" />
                  <span className="font-medium text-foreground/80">Disclaimer:</span> Cryptocurrency investments are subject to high market risk. 
                  DeFi ANT! is not a financial advisor. Please make your investments cautiously. 
                  Never invest money you cannot afford to lose.
                </p>
              </div>
            </motion.div>
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
