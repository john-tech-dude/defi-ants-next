'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { useGlowEffect } from '@/hooks/useGlowEffect';
import { useClientContext } from '@/contexts/ClientContext';
import { 
  // Navigation
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  
  // UI Elements
  X,
  Menu,
  Check,
  
  // Icons
  BarChart3,
  Wallet,
  Zap,
  Shield,
  Sparkles,
  Rocket,
  TrendingUp,
  ShieldCheck,
  MessageCircle,
  Send,
  Twitter,
  Users,
  
  // Media Controls
  Play,
  Pause,
  
  // Arrow Icons
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types
interface HeroProps {
  className?: string;
}

interface VideoComponentProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  handleVideoLoaded: () => void;
  handleVideoError: () => void;
  togglePlayPause: () => void;
  handleVideoEnd: () => void;
  isMobile: boolean;
  hasError: boolean;
  isPlaying: boolean;
}

interface MetricItem {
  value: string | number;
  label: string;
  change?: number;
  icon: React.ReactNode;
}

// Import asset paths
const getImagePath = (filename: string): string => `/images/${filename}`;
// Video sources with fallbacks
const VIDEO_SOURCES = [
  // Primary video source (use absolute path to prevent 404s)
  '/videos/hero-video.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
];

// Get absolute URLs for video sources
const getAbsoluteVideoPath = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${typeof window !== 'undefined' ? window.location.origin : ''}${path}`;
};

// Mock data - replace with real API calls
const MOCK_DATA = {
  price: 0.00042,
  priceChange24h: 12.5,
  holders: 12543,
  marketCap: 5240000,
  isAudited: true,
  isKYC: true,
  trendingOn: ['Raydium', 'Jupiter'],
  featuredIn: ['CoinTelegraph', 'Decrypt']
};

// Premium Glassmorphic Styles with hover effects
const STYLES = {
  // Subtle glass effect that becomes more prominent on hover
  GLASS_CARD: 'backdrop-filter backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/20 dark:hover:bg-white/5 hover:border-white/20 dark:hover:border-white/10 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300',
  
  // Premium glow effect for metrics cards
  GLASS_METRIC: 'backdrop-filter backdrop-blur-lg bg-white/5 dark:bg-white/2 border border-white/10 dark:border-white/5 rounded-xl shadow-sm shadow-black/5 hover:bg-white/10 dark:hover:bg-white/5 hover:border-white/20 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-primary-500/5 transition-all duration-300',
  
  // Badges with premium glass effect
  GLASS_BADGE: [
    'backdrop-filter backdrop-blur-sm',
    'bg-white/5 dark:bg-white/2',
    'border border-white/10 dark:border-white/5',
    'rounded-full',
    'shadow-sm shadow-black/5',
    'transition-all duration-300',
    'hover:backdrop-blur-md',
    'hover:bg-white/20 dark:hover:bg-white/10',
    'hover:border-white/20 dark:hover:border-white/10',
    'hover:shadow-md hover:shadow-black/10',
    'group relative overflow-hidden'
  ].join(' '),
  
  // Buttons with premium glass effect
  GLASS_BUTTON: [
    'backdrop-filter backdrop-blur-sm',
    'bg-white/5 dark:bg-white/2',
    'border border-white/10 dark:border-white/5',
    'shadow-sm shadow-black/5',
    'transition-all duration-300',
    'hover:backdrop-blur-md',
    'hover:bg-white/20 dark:hover:bg-white/10',
    'hover:border-white/20 dark:hover:border-white/10',
    'hover:shadow-lg hover:shadow-black/10',
    'group relative overflow-hidden',
    'before:absolute before:inset-0',
    'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
    'before:opacity-0 hover:before:opacity-100',
    'before:transition-opacity before:duration-500',
    'before:-translate-x-full hover:before:translate-x-full'
  ].join(' '),
  
  // Overlay with subtle gradient
  GLASS_OVERLAY: [
    'backdrop-filter backdrop-blur-sm',
    'bg-gradient-to-br',
    'from-white/10 to-white/0',
    'dark:from-white/5 dark:to-white/0',
    'transition-all duration-500'
  ].join(' '),
  
  // Featured items with premium glass effect
  GLASS_FEATURED: [
    'backdrop-filter backdrop-blur-sm',
    'bg-white/5 dark:bg-white/2',
    'border border-white/10 dark:border-white/5',
    'rounded-xl',
    'shadow-sm shadow-black/5',
    'transition-all duration-300',
    'hover:backdrop-blur-md',
    'hover:bg-white/20 dark:hover:bg-white/10',
    'hover:border-white/20 dark:hover:border-white/10',
    'hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-primary-500/5',
    'group relative overflow-hidden',
    'before:absolute before:inset-0',
    'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
    'before:opacity-0 group-hover:before:opacity-100',
    'before:transition-all before:duration-500',
    'before:-translate-x-full group-hover:before:translate-x-full'
  ].join(' ')
};

const Hero = ({ className }: HeroProps) => {
  const { setIsBuyPanelOpen } = useClientContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Video handlers
  const handleVideoLoaded = useCallback(() => {
    console.log('Video loaded successfully');
    setHasError(false);
  }, []);

  const handleVideoError = useCallback(() => {
    console.error('Error loading video');
    setHasError(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(handleVideoError);
      } else {
        videoRef.current.pause();
      }
    }
  }, [handleVideoError]);

  const handleVideoEnd = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(handleVideoError);
    }
  }, [handleVideoError]);

  // Effect for mobile detection and scroll
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    // Set playback rate when video loads
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.8;
      video.muted = true; // Required for autoplay in most browsers
      video.playsInline = true; // For iOS
      
      // Add event listeners
      video.addEventListener('play', () => setIsPlaying(true));
      video.addEventListener('pause', () => setIsPlaying(false));
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('error', handleVideoError);
      video.addEventListener('loadeddata', handleVideoLoaded);
      
      // Try to autoplay
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay prevented:', error);
          // Show play button if autoplay fails
          setIsPlaying(false);
        });
      }
    }

    // Scroll event listener for header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('scroll', handleScroll);
      
      if (video) {
        video.removeEventListener('play', () => setIsPlaying(true));
        video.removeEventListener('pause', () => setIsPlaying(false));
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('loadeddata', handleVideoLoaded);
      }
    };
  }, [handleVideoEnd, handleVideoError, handleVideoLoaded]);

  const renderParticles = () => {
    if (typeof window === 'undefined') return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse' as const,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn('relative min-h-screen flex items-start pt-12 lg:pt-16 justify-center overflow-hidden group', className)}>
      {renderParticles()}
      {/* Aurora Background with Animation */}
      <motion.div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-transparent"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 lg:py-12">
        {/* Floating glass orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary-500/10 to-transparent blur-3xl opacity-30 -z-10" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl opacity-30 -z-10" />
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start relative">
          {/* Left Column - Text Content */}
          <motion.div 
            className="flex flex-col justify-start z-20 text-center lg:text-left -mt-6 lg:-mt-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
          >
            <motion.div 
              className="space-y-3 md:space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.1, duration: 0.6 }
              }}
            >
              <div className="text-center">
                <motion.h1 
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-7xl font-bold tracking-tight inline-block"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
                >
                  <motion.span 
                    className="inline-block text-blue-500 dark:text-blue-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    DeFi
                  </motion.span>
                  <motion.span 
                    className="text-white dark:text-gray-100 relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    ANT!
                  </motion.span>
                </motion.h1>
                <motion.h2 
                  className="text-2xl md:text-3xl lg:text-4xl font-light text-muted-foreground leading-tight mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: 0.6, 
                      duration: 0.7, 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 20 
                    } 
                  }}
                >
                  Join the Revolution!
                </motion.h2>
                {/* Compact badge centered under heading */}
                <div className="flex justify-center w-full">
                  <motion.div 
                    className={`${STYLES.GLASS_BADGE} px-3 py-1 mt-3 max-w-[180px] w-full text-center`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="relative z-10 text-primary-500/90 dark:text-primary-300/90 text-xs font-medium flex items-center justify-center">
                      <Rocket className="w-2.5 h-2.5 mr-1.5 flex-shrink-0" />
                      <span>Solana DeFi</span>
                    </span>
                  </motion.div>
                </div>
              </div>
              <motion.h2 
                className="text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
              >
                {/* Tagline - No badges here anymore */}
              </motion.h2>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="text-base md:text-lg text-foreground/90 dark:text-muted-foreground mt-6 mb-8 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.7, duration: 0.7, type: "spring", stiffness: 100, damping: 20 }
              }}
            >
              Join the revolution that's redefining DeFi on Solana with{' '}
              <span className="font-medium text-foreground">institutional-grade security</span>,{' '}
              <span className="font-medium text-foreground">premium user experience</span>, and{' '}
              <span className="font-medium text-foreground">sustainable tokenomics</span>.
            </motion.p>
            
            {/* CTA Buttons */}
            <div className="space-y-6">
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.8, duration: 0.7, type: "spring", stiffness: 100, damping: 20 }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Button 
                    size="lg" 
                    onClick={() => setIsBuyPanelOpen(true)}
                    className={`group px-6 py-5 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 rounded-xl w-full sm:w-auto relative overflow-hidden border border-blue-500/20`}
                  >
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                      initial={{ x: '-100%', opacity: 0.5 }}
                      whileHover={{ x: '100%', opacity: 1 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                    <span className="relative z-10 flex items-center">
                      Buy Now
                      <motion.span 
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: 'loop'
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Button 
                    variant="outline" 
                    size="lg"
                    className={`px-6 py-5 text-base font-medium bg-white/80 hover:bg-white/90 text-gray-900 hover:text-gray-900 border-gray-300 hover:border-gray-400 shadow-sm transition-all duration-300 rounded-xl w-full sm:w-auto relative overflow-hidden group`}
                  >
                    <span className="relative z-10 flex items-center">
                      Learn More
                      <motion.span
                        className="ml-2"
                        animate={{ y: [0, 2, 0] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        <ChevronDown className="h-4 w-4 text-gray-700" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Token Metrics */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Live Metrics</h3>
                <button 
                  onClick={() => setShowMetrics(!showMetrics)}
                  className="text-xs text-primary-500 hover:text-primary-400 transition-colors flex items-center"
                >
                  {showMetrics ? 'Show Less' : 'Show More'}
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showMetrics ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 overflow-hidden relative"
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transition: { duration: 0.6, type: "spring", stiffness: 70, damping: 20 }
                }}
              >
                <div className="relative group cursor-pointer">
                  {/* Glow layer */}
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/30 dark:from-primary-400/40 dark:to-primary-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-95 group-hover:scale-100 z-0"
                    style={{
                      filter: 'blur(20px)',
                      transform: 'translateZ(0)',
                      willChange: 'transform, opacity',
                      transitionProperty: 'opacity, transform',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDuration: '500ms',
                    }}
                  />
                  {/* Card content */}
                  <motion.div 
                    className={`p-3 sm:p-4 rounded-xl ${STYLES.GLASS_METRIC} text-center min-w-0 relative z-10 h-full`}
                    whileHover={{ 
                      y: -4,
                      transition: { 
                        type: 'spring',
                        stiffness: 400,
                        damping: 15
                      }
                    }}
                    style={{
                      transform: 'translateZ(0)',
                      willChange: 'transform',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="flex flex-col items-center">
                        <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-300 whitespace-nowrap transition-colors group-hover:text-primary-500 dark:group-hover:text-primary-200">
                          ${MOCK_DATA.price.toFixed(6)}
                        </div>
                        <div className={`text-xs font-medium flex items-center ${MOCK_DATA.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {MOCK_DATA.priceChange24h >= 0 ? (
                            <ArrowUp className="w-3 h-3 mr-0.5" />
                          ) : (
                            <ArrowDown className="w-3 h-3 mr-0.5" />
                          )}
                          {Math.abs(MOCK_DATA.priceChange24h).toFixed(2)}% (24h)
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Price
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
                
                <div className="relative group cursor-pointer">
                  {/* Glow layer */}
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/30 dark:from-primary-400/40 dark:to-primary-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-95 group-hover:scale-100 z-0"
                    style={{
                      filter: 'blur(20px)',
                      transform: 'translateZ(0)',
                      willChange: 'transform, opacity',
                      transitionProperty: 'opacity, transform',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDuration: '500ms',
                    }}
                  />
                  {/* Card content */}
                  <motion.div 
                    className={`p-4 rounded-xl ${STYLES.GLASS_METRIC} text-center relative z-10 h-full`}
                    whileHover={{ 
                      y: -4,
                      transition: { 
                        type: 'spring',
                        stiffness: 400,
                        damping: 15
                      }
                    }}
                    style={{
                      transform: 'translateZ(0)',
                      willChange: 'transform',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-500 flex items-center justify-center group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                        <Users className="w-4 h-4 mr-1.5 text-primary-500 group-hover:scale-110 transition-transform" />
                        {MOCK_DATA.holders.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Holders
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
                
                <div className="relative group cursor-pointer">
                  {/* Glow layer */}
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/30 dark:from-primary-400/40 dark:to-primary-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-95 group-hover:scale-100 z-0"
                    style={{
                      filter: 'blur(20px)',
                      transform: 'translateZ(0)',
                      willChange: 'transform, opacity',
                      transitionProperty: 'opacity, transform',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDuration: '500ms',
                    }}
                  />
                  {/* Card content */}
                  <motion.div 
                    className={`p-4 rounded-xl ${STYLES.GLASS_METRIC} text-center relative z-10 h-full`}
                    whileHover={{ 
                      y: -4,
                      transition: { 
                        type: 'spring',
                        stiffness: 400,
                        damping: 15
                      }
                    }}
                    style={{
                      transform: 'translateZ(0)',
                      willChange: 'transform',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                        ${(MOCK_DATA.marketCap / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Market Cap
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
                
                <div className="relative group cursor-pointer">
                  {/* Glow layer */}
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/30 dark:from-primary-400/40 dark:to-primary-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-95 group-hover:scale-100 z-0"
                    style={{
                      filter: 'blur(20px)',
                      transform: 'translateZ(0)',
                      willChange: 'transform, opacity',
                      transitionProperty: 'opacity, transform',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDuration: '500ms',
                    }}
                  />
                  {/* Card content */}
                  <motion.div 
                    className={`p-4 rounded-xl ${STYLES.GLASS_METRIC} text-center relative z-10 h-full`}
                    whileHover={{ 
                      y: -4,
                      transition: { 
                        type: 'spring',
                        stiffness: 400,
                        damping: 15
                      }
                    }}
                    style={{
                      transform: 'translateZ(0)',
                      willChange: 'transform',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="relative z-10">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                        1M+
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total Supply
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
              </motion.div>
              
              <AnimatePresence>
                {showMetrics && (
                  <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto',
                      marginTop: '0.75rem',
                      transition: { duration: 0.4 }
                    }}
                    exit={{ 
                      opacity: 0, 
                      height: 0, 
                      marginTop: 0,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className={`p-3 rounded-xl ${STYLES.GLASS_METRIC} text-center`}>
                      <div className="text-lg font-bold text-foreground">0.1%</div>
                      <div className="text-xs text-muted-foreground">Tax</div>
                    </div>
                    <div className={`p-3 rounded-xl ${STYLES.GLASS_METRIC} text-center`}>
                      <div className="text-lg font-bold text-foreground">50%</div>
                      <div className="text-xs text-muted-foreground">Staking APY</div>
                    </div>
                    <div className={`p-3 rounded-xl ${STYLES.GLASS_METRIC} text-center`}>
                      <div className="text-lg font-bold text-foreground">10%</div>
                      <div className="text-xs text-muted-foreground">Reflections</div>
                    </div>
                    <div className={`p-3 rounded-xl ${STYLES.GLASS_METRIC} text-center`}>
                      <div className="text-lg font-bold text-foreground">90%</div>
                      <div className="text-xs text-muted-foreground">Liquidity Locked</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Trust & Community Badges */}
              <div className="mt-4 flex flex-col gap-2">
                {/* Trust Badges - Moved under Live Metrics */}
                <div className="flex flex-wrap gap-2">
                  {MOCK_DATA.isAudited && (
                    <motion.div 
                      className={`${STYLES.GLASS_FEATURED} px-3 py-1.5 text-xs font-medium group/audit`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.3, delay: 0.2 }
                      }}
                      whileHover={{ scale: 1.03, y: -1 }}
                      title="Smart Contract Audited"
                    >
                      <ShieldCheck className="w-3 h-3 inline-block mr-1 text-green-500" />
                      <span className="text-foreground/90 dark:text-green-200/90 group-hover/audit:text-green-400 dark:group-hover/audit:text-green-200 transition-colors">
                        Audited
                      </span>
                    </motion.div>
                  )}
                  {MOCK_DATA.isKYC && (
                    <motion.div 
                      className={`${STYLES.GLASS_FEATURED} px-3 py-1.5 text-xs font-medium group/kyc`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.3, delay: 0.3 }
                      }}
                      whileHover={{ scale: 1.03, y: -1 }}
                      title="KYC Verified"
                    >
                      <Check className="w-3 h-3 inline-block mr-1 text-blue-500" />
                      <span className="text-foreground/90 dark:text-blue-200/90 group-hover/kyc:text-blue-400 dark:group-hover/kyc:text-blue-200 transition-colors">
                        KYC Verified
                      </span>
                    </motion.div>
                  )}
                </div>
                
                {/* Trending & Featured Badges */}
                <div className="flex flex-wrap gap-2">
                  {MOCK_DATA.trendingOn.map((platform: string, i: number) => (
                    <motion.div 
                      key={platform}
                      className={`${STYLES.GLASS_FEATURED} px-3 py-1.5 text-xs font-medium group/trending`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: 0.4 + (i * 0.1),
                          type: 'spring',
                          stiffness: 300,
                          damping: 12
                        }
                      }}
                      whileHover={{ 
                        scale: 1.03,
                        y: -1,
                        boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <span className="text-yellow-500/90 dark:text-yellow-300/90 group-hover/trending:text-yellow-400 transition-colors">
                        <span className="inline-block group-hover/trending:animate-pulse">🔥</span>
                      </span>
                      <span className="text-foreground/80 dark:text-yellow-100/80 ml-1 group-hover/trending:text-yellow-400 dark:group-hover/trending:text-yellow-200 transition-colors">
                        {platform}
                      </span>
                    </motion.div>
                  ))}
                  {MOCK_DATA.featuredIn.map((outlet, i) => (
                    <motion.div 
                      key={outlet}
                      className={`${STYLES.GLASS_FEATURED} px-3 py-1.5 text-xs font-medium group/featured`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: 0.5 + (i * 0.1),
                          type: 'spring',
                          stiffness: 300,
                          damping: 12
                        }
                      }}
                      whileHover={{ 
                        scale: 1.03,
                        y: -1,
                        boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <span className="text-purple-500/90 dark:text-purple-300/90 group-hover/featured:text-purple-400 transition-colors">
                        <span className="inline-block group-hover/featured:animate-pulse">✨</span>
                      </span>
                      <span className="text-foreground/80 dark:text-purple-100/80 ml-1 group-hover/featured:text-purple-400 dark:group-hover/featured:text-purple-200 transition-colors">
                        {outlet}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Join our Community - Social Media Icons */}
              <div className="mt-8 mb-4">
                <motion.h3 
                  className="text-center text-sm font-medium text-muted-foreground mb-3"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.3, delay: 0.5 }
                  }}
                >
                  Join our Community
                </motion.h3>
                <motion.div 
                  className="flex justify-center gap-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.6, duration: 0.5 }
                  }}
                >
                  <motion.a 
                    href="https://t.me/yourtelegram" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300 p-2 rounded-full hover:bg-amber-500/10 dark:hover:bg-amber-500/20"
                    whileHover={{ y: -3, scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    title="Telegram"
                  >
                    <Send className="w-5 h-5" />
                  </motion.a>
                  <motion.a 
                    href="https://twitter.com/yourtwitter" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 p-2 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
                    whileHover={{ y: -3, scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </motion.a>
                  <motion.a 
                    href="https://discord.gg/yourdiscord" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300 p-2 rounded-full hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20"
                    whileHover={{ y: -3, scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    title="Discord"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.a>
                </motion.div>
              </div>
            </div>
            </div>
          </motion.div>

          {/* Video Content - Hidden on mobile, shown on lg screens */}
          <motion.div
            className="relative w-full h-full flex-col items-center justify-center -mt-8 lg:-mt-4 hidden lg:flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <VideoComponent
                videoRef={videoRef}
                handleVideoLoaded={handleVideoLoaded}
                handleVideoError={handleVideoError}
                togglePlayPause={togglePlayPause}
                handleVideoEnd={handleVideoEnd}
                isMobile={false} // Desktop version
                hasError={hasError}
                isPlaying={isPlaying}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Video - Only shown on mobile */}
      <div className="lg:hidden w-full container mx-auto px-4 -mt-2">
        <div className="w-full flex justify-center">
          <VideoComponent
            videoRef={videoRef}
            handleVideoLoaded={handleVideoLoaded}
            handleVideoError={handleVideoError}
            togglePlayPause={togglePlayPause}
            handleVideoEnd={handleVideoEnd}
            isMobile={isMobile}
            hasError={hasError}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
};

const VideoComponent: React.FC<VideoComponentProps> = ({
  videoRef,
  handleVideoLoaded,
  handleVideoError,
  togglePlayPause,
  handleVideoEnd,
  isMobile,
  hasError,
  isPlaying,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [videoRef]);

  const handleVideoEnded = useCallback(() => {
    setHasEnded(true);
    if (handleVideoEnd) handleVideoEnd();
  }, [handleVideoEnd]);

  const handleReplay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
      setHasEnded(false);
    }
  }, [videoRef]);

  const handleRetry = useCallback(() => {
    if (videoRef.current) {
      const currentSrc = videoRef.current.currentSrc;
      const currentIndex = VIDEO_SOURCES.findIndex(src => currentSrc.includes(src));
      if (currentIndex < VIDEO_SOURCES.length - 1) {
        const nextIndex = currentIndex + 1;
        console.log(`Trying fallback video ${nextIndex}`);
        videoRef.current.src = getAbsoluteVideoPath(VIDEO_SOURCES[nextIndex]);
        videoRef.current.load();
        videoRef.current.play().catch(handleVideoError);
        setHasEnded(false);
      } else {
        handleVideoError();
      }
    }
  }, [videoRef, handleVideoError]);

  // Don't render video on server-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div 
        className="relative w-full max-w-full mx-auto aspect-[9/16] rounded-2xl overflow-hidden border shadow-2xl bg-gray-100 dark:bg-gray-800"
        style={{
          maxWidth: isMobile ? '280px' : '360px',
        }}
      />
    );
  }

  return (
    <motion.div
      className="relative w-full max-w-full mx-auto aspect-[9/16] rounded-2xl overflow-hidden border shadow-2xl group"
      style={{
        maxWidth: isMobile ? '280px' : '360px',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="relative w-full h-full">
        {isClient && (
          <video
            ref={videoRef}
            key={currentVideoIndex}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            loop
            onError={handleRetry}
            onLoadedData={handleVideoLoaded}
            src={getAbsoluteVideoPath(VIDEO_SOURCES[currentVideoIndex])}
          />
        )}
        
        {/* Bottom right controls */}
        <div 
          className={cn(
            "absolute bottom-4 right-4 transition-opacity duration-300",
            hasEnded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <button 
            onClick={hasEnded ? handleReplay : togglePlayPause} 
            className={cn(
              "p-3 rounded-full backdrop-blur-sm focus:outline-none transition-all duration-200 shadow-lg",
              "bg-black/50 hover:bg-black/60 active:scale-95 border border-white/20",
              hasEnded ? 'scale-110' : 'scale-100'
            )}
            aria-label={hasEnded ? 'Replay video' : isPlaying ? 'Pause' : 'Play'}
          >
            {hasEnded ? (
              <motion.div 
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2 text-white"
              >
                <Play className="w-5 h-5" />
              </motion.div>
            ) : isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        {/* Semi-transparent overlay when video has ended */}
        {hasEnded && (
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-300" />
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
            <p className="mb-4">Error loading video.</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Hero;
