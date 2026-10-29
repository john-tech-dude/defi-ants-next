'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { createTransition, createProgressVariants } from '@/lib/animations'
import { useInView } from 'react-intersection-observer'
import { Wallet, ArrowRight, RefreshCw, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useClientContext } from '@/contexts/ClientContext'

// Import Swiper React components
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';

// Steps data
const steps = [
  {
    title: 'Connect Your Wallet',
    description: 'Connect your Solana wallet to get started with buying ANT tokens.',
    icon: <Wallet className="w-6 h-6 text-primary-500" />,
    cta: 'Connect Wallet',
    link: '#connect-wallet'
  },
  {
    title: 'Swap SOL for ANT',
    description: 'Use our built-in swap feature to exchange SOL for ANT tokens instantly.',
    icon: <RefreshCw className="w-6 h-6 text-primary-500" />,
    cta: 'Swap Now',
    link: '#swap'
  },
  {
    title: 'Buy on Jupiter',
    description: 'Alternatively, buy ANT tokens directly on Jupiter Exchange for the best rates.',
    icon: <ArrowRight className="w-6 h-6 text-primary-500" />,
    cta: 'Go to Jupiter',
    link: 'https://jup.ag/swap/SOL-ANT'
  },
  {
    title: 'Stake Your ANT',
    description: 'Stake your ANT tokens to earn rewards and participate in governance.',
    icon: <CheckCircle className="w-6 h-6 text-primary-500" />,
    cta: 'Stake ANT',
    link: '#stake'
  }
];

export default function HowToBuy() {
  const { setIsBuyPanelOpen } = useClientContext();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Handle step actions
  const handleStepAction = (link: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    try {
      switch(link) {
        case '#connect-wallet':
        case '#swap':
          setIsBuyPanelOpen(true);
          break;
        case '#stake':
          // Scroll to staking section if it exists
          const stakingSection = document.getElementById('staking');
          if (stakingSection) {
            stakingSection.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        default:
          if (link.startsWith('http')) {
            window.open(link, '_blank', 'noopener,noreferrer');
          }
          break;
      }
    } catch (error) {
      console.error('Error handling step action:', error);
      // Optionally show error toast to user
    }
  };

  // State for mobile carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      // No need to update state here as we're using responsive classes
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle slide change and update navigation state
  const updateNavigationState = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Animation variants
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
      y: 30,
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
  
  const stepCardVariants: Variants = {
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
  };

  // Animation variants for the step content
  const stepContentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  return (
    <section id="how-to-buy" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/10" ref={ref}>
      <div className="container mx-auto px-4">
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
                💰
              </motion.span>
              Easy Purchase
              <motion.span
                animate={{ rotate: [0, -10, 5, -10, 0] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: 'reverse',
                  delay: 0.5
                }}
              >
                🚀
              </motion.span>
            </motion.span>
          </motion.div>
          
          <motion.div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              variants={titleVariants}
              className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300"
            >
              How to <span className="gradient-text">Buy ANT</span>
            </motion.h2>
          </motion.div>
          
          <motion.div className="inline-block overflow-hidden">
            <motion.p 
              variants={titleVariants}
              className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              Follow these simple steps to get your hands on ANT tokens and join the colony
            </motion.p>
          </motion.div>
          
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary-500/10 blur-3xl -z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0, 0.3, 0],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={`desktop-${index}`}
              custom={index}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              variants={stepCardVariants}
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
              onClick={(e) => handleStepAction(step.link, e)}
            >
              {/* Animated background effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              {/* Animated border effect */}
              <motion.div 
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-500/30"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mb-5 mx-auto relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {step.icon}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.2, opacity: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.div 
                    className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-500/30"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-5 text-center text-sm leading-relaxed">
                  {step.description}
                </p>
                
                <motion.div className="relative z-10 mt-4 w-full">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.button
                    onClick={(e) => handleStepAction(step.link, e)}
                    aria-label={`${step.cta} - ${step.title}`}
                    className="block relative z-10 w-full text-center px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <motion.span 
                      className="relative z-10 flex items-center justify-center gap-2"
                      whileHover={{ x: 2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {step.cta}
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    </motion.span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel - Visible only on mobile */}
        <motion.div 
          className="md:hidden relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            loop={true}
            ref={swiperRef}
            className="w-full py-4 px-2"
            initialSlide={activeIndex}
            onSlideChange={updateNavigationState}
            onSwiper={(swiper) => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;
              }
              swiper.navigation.init();
              swiper.navigation.update();
              updateNavigationState(swiper);
            }}
            breakpoints={{
              320: {
                slidesPerView: 1.1,
                spaceBetween: 16,
              },
              375: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              425: {
                slidesPerView: 1.3,
                spaceBetween: 24,
              },
            }}
          >
            {steps.map((step, index) => (
              <SwiperSlide key={`mobile-${index}`} className="!h-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col"
                  onClick={(e) => {
                    if (step.link.startsWith('http')) {
                      handleStepAction(step.link, e);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleStepAction(step.link, e as any);
                    }
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mb-5 mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-5 text-center text-sm flex-grow">
                    {step.description}
                  </p>
                  <motion.button
                    onClick={(e) => handleStepAction(step.link, e)}
                    aria-label={`${step.cta} - ${step.title}`}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {step.cta}
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <motion.button
            ref={navigationPrevRef}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
            aria-label="Previous step"
            whileHover={!isBeginning ? { scale: 1.1, x: -2 } : {}}
            whileTap={!isBeginning ? { scale: 0.95 } : {}}
            disabled={isBeginning}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            ref={navigationNextRef}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 ${isEnd ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
            aria-label="Next step"
            whileHover={!isEnd ? { scale: 1.1, x: 2 } : {}}
            whileTap={!isEnd ? { scale: 0.95 } : {}}
            disabled={isEnd}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
          
          {/* Progress dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex % steps.length ? 'w-6 bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gray-600/50'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
