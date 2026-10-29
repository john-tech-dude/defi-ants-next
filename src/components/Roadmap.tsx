'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { createProgressVariants, createTransition, easings } from '@/lib/animations'
import { useInView } from 'react-intersection-observer'
import { CheckCircle, Clock, Calendar, Target, ChevronRight, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import type { SwiperOptions } from 'swiper/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';

// Configure Swiper to use modules
const swiperConfig: SwiperOptions = {
  modules: [EffectCoverflow, Navigation, Pagination, Autoplay],
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  initialSlide: 0,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 1.5,
    slideShadows: true,
  },
  pagination: {
    clickable: true,
    dynamicBullets: true,
  },
  navigation: true,
  loop: true,
  breakpoints: {
    320: {
      slidesPerView: 1.1,
      spaceBetween: 16,
    },
    480: {
      slidesPerView: 1.2,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 1.3,
      spaceBetween: 24,
    },
  },
};

export default function Roadmap() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const phases = [
    {
      phase: 'Phase 1 - Q2 2025',
      title: 'Meme Launch 🚀',
      status: 'completed',
      statusColor: 'from-green-400 to-green-600',
      icon: CheckCircle,
      tasks: [
        'Token launch on Pump.fun',
        'Meme website and social media launch',
        'Initial liquidity pool creation',
        'Meme contest kickoff'
      ]
    },
    {
      phase: 'Phase 2 - Q3 2025',
      title: 'Community Growth',
      status: 'in-progress',
      statusColor: 'from-yellow-400 to-orange-500',
      icon: Clock,
      tasks: [
        'Raydium and Jupiter listings',
        'Meme partnerships with influencers',
        'Discord and Telegram expansion',
        'Weekly meme competitions with prizes'
      ]
    },
    {
      phase: 'Phase 3 - Q4 2025',
      title: 'Utility Rollout 💰',
      status: 'upcoming',
      statusColor: 'from-blue-400 to-blue-600',
      icon: Calendar,
      tasks: [
        'ANT staking with juicy APY',
        'NFT collection with holder benefits',
        'Community treasury for meme development',
        'ANT merch store launch'
      ]
    },
    {
      phase: 'Phase 4 - Q1 2026',
      title: 'Meme Domination 👑',
      status: 'upcoming',
      statusColor: 'from-purple-400 to-purple-600',
      icon: Target,
      tasks: [
        'Major CEX listings (we are coming for Binance!)',
        'ANT meme token governance',
        'IRL ANT community events',
        'Partnerships with other meme projects'
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: 'bg-green-500 text-white' }
      case 'in-progress':
        return { text: 'In Progress', color: 'bg-yellow-500 text-black' }
      case 'upcoming':
        return { text: 'Upcoming', color: 'bg-blue-500 text-white' }
      default:
        return { text: 'Unknown', color: 'bg-gray-500 text-white' }
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
    hover: {
      y: -5,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 12
      }
    }
  };
  
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: createTransition(0.8, [0.25, 0.1, 0.25, 1] as const)
    }
  };
  
  const phaseCardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    }),
    hover: {
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        y: { 
          type: 'spring', 
          stiffness: 300, 
          damping: 15 
        },
        boxShadow: { 
          duration: 0.3 
        }
      }
    }
  }
  
  // Import the progress bar variants from our animations utility
  const progressBarVariants = createProgressVariants(1.2);

  // State for mobile carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle slide change
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  // Initialize swiper instance
  const handleSwiper = (swiper: SwiperType) => {
    if (swiperRef.current) {
      swiperRef.current.swiper = swiper;
    }
  };

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  return (
    <section id="roadmap" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/10" ref={ref}>
      <div className="container-custom px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-center justify-center mb-12 md:mb-20 relative overflow-hidden text-center"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full mb-6 backdrop-blur-sm"
          >
            <motion.span 
              className="text-primary-500 font-bold flex items-center justify-center gap-2 text-sm md:text-base"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -5, 10, 0] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: 'reverse' 
                }}
              >
                🚀
              </motion.span>
              Project Timeline
              <motion.span
                animate={{ rotate: [0, -10, 5, -10, 0] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: 'reverse',
                  delay: 0.5
                }}
              >
                📈
              </motion.span>
            </motion.span>
          </motion.div>
          
          <motion.div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              variants={titleVariants}
              className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300"
            >
              Meme Domination <span className="gradient-text">Roadmap</span>
            </motion.h2>
          </motion.div>
          
          <motion.div className="inline-block overflow-hidden">
            <motion.p 
              variants={titleVariants}
              className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              Our strategic plan to establish ANT as the premier meme token on Solana
            </motion.p>
          </motion.div>
          
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary-500/10 blur-3xl -z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0, 0.2, 0],
              x: [0, -30, 0],
              y: [0, 40, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>

        {/* Desktop Timeline - Hidden on mobile */}
        <div className="hidden lg:block relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-500/80 via-primary-500/50 to-primary-500/20 rounded-full"></div>
          
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const statusBadge = getStatusBadge(phase.status);
            const isEven = index % 2 === 0;
            
            return (
              <motion.div 
                key={`desktop-${index}`}
                className="relative z-10 mb-16 last:mb-0 group"
                custom={index}
                variants={phaseCardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* Timeline node */}
                <motion.div 
                  className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 border-background flex items-center justify-center z-20 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.div 
                    className={`w-full h-full rounded-full flex items-center justify-center relative overflow-hidden ${
                      phase.status === 'completed' ? 'bg-green-500' : 
                      phase.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-6 h-6 text-white relative z-10" />
                    <motion.div 
                      className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
                    />
                  </motion.div>
                </motion.div>
                
                {/* Content card - alternating left/right */}
                <div className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-center`}>
                  {/* Date/phase marker */}
                  <div className={`w-5/12 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <h4 className="text-lg font-bold text-primary-500">{phase.phase}</h4>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${statusBadge.color}`}>
                      {statusBadge.text}
                    </div>
                  </div>
                  
                  {/* Empty middle space for timeline */}
                  <div className="w-2/12"></div>
                  
                  {/* Content card */}
                  <div className="w-5/12">
                    <motion.div 
                      className="backdrop-blur-sm p-6 rounded-xl relative overflow-hidden border border-border/50 bg-card/50 group-hover:border-primary-500/30 transition-all duration-300"
                      whileHover={{ 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        y: -5
                      }}
                    >
                      {/* Animated gradient border */}
                      <motion.div 
                        className="absolute inset-0 rounded-xl p-[1px]"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 via-secondary-500/30 to-primary-500/30 rounded-xl"></div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {phase.title}
                      </h3>
                      
                      <ul className="space-y-3">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-3 text-sm">
                            <div className="mt-0.5 flex-shrink-0">
                              {phase.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : phase.status === 'in-progress' && taskIndex === 0 ? (
                                <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
                              ) : (
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <span className={phase.status === 'completed' ? 'text-muted-foreground' : ''}>
                              {task}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Carousel - Visible only on mobile */}
        <motion.div 
          className="lg:hidden relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            {...swiperConfig}
            ref={swiperRef}
            className="w-full py-4 px-2"
            initialSlide={activeIndex}
            onSlideChange={handleSlideChange}
            onSwiper={handleSwiper}
          >
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const statusBadge = getStatusBadge(phase.status);
              
              return (
                <SwiperSlide key={`mobile-${index}`} className="!h-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg flex flex-col relative overflow-hidden"
                  >
                    {/* Status badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${statusBadge.color}`}>
                      {statusBadge.text}
                    </div>
                    
                    {/* Phase and title */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-primary-400 mb-1">{phase.phase}</h4>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {phase.title}
                      </h3>
                    </div>
                    
                    {/* Tasks */}
                    <ul className="space-y-3 flex-grow">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-3 text-sm">
                          <div className="mt-0.5 flex-shrink-0">
                            {phase.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : phase.status === 'in-progress' && taskIndex === 0 ? (
                              <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
                            ) : (
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className={phase.status === 'completed' ? 'text-muted-foreground' : ''}>
                            {task}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Progress indicator */}
                    <div className="mt-6 pt-4 border-t border-border/20">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{Math.round(((index + 1) / phases.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full"
                          initial="hidden"
                          animate={inView ? 'visible' : 'hidden'}
                          custom={`${((index + 1) / phases.length) * 100}%`}
                          variants={progressBarVariants}
                        />
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <button
            onClick={() => goToSlide(activeIndex - 1)}
            disabled={activeIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 ${activeIndex === 0 ? 'opacity-50 cursor-default' : 'opacity-100'}`}
            aria-label="Previous phase"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goToSlide(activeIndex + 1)}
            disabled={activeIndex === phases.length - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 ${activeIndex === phases.length - 1 ? 'opacity-50 cursor-default' : 'opacity-100'}`}
            aria-label="Next phase"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          
          {/* Progress dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {phases.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-6 bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gray-600/50'
                }`}
                aria-label={`Go to phase ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
