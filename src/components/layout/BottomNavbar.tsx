'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, BarChart2, ShoppingCart, Users, HelpCircle, X, ChevronUp, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { 
    name: 'Home', 
    href: '#', 
    icon: Home,
    iconColor: 'text-amber-400 dark:text-amber-500',
    activeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    textColor: 'text-foreground/90 dark:text-amber-50',
    hoverText: 'hover:text-amber-500 dark:hover:text-amber-400'
  },
  { 
    name: 'Metrics', 
    href: '#metrics', 
    icon: BarChart2,
    iconColor: 'text-primary-400 dark:text-primary-500',
    activeBg: 'bg-primary-500/10 dark:bg-primary-500/20',
    textColor: 'text-foreground/90 dark:text-primary-50',
    hoverText: 'hover:text-primary-500 dark:hover:text-primary-400'
  },
  { 
    name: 'Buy', 
    href: '#buy', 
    icon: ShoppingCart,
    iconColor: 'text-emerald-400 dark:text-emerald-500',
    activeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    textColor: 'text-foreground/90 dark:text-emerald-50',
    hoverText: 'hover:text-emerald-500 dark:hover:text-emerald-400'
  },
  { 
    name: 'Community', 
    href: '#community', 
    icon: Users,
    iconColor: 'text-secondary-400 dark:text-secondary-500',
    activeBg: 'bg-secondary-500/10 dark:bg-secondary-500/20',
    textColor: 'text-foreground/90 dark:text-secondary-50',
    hoverText: 'hover:text-secondary-500 dark:hover:text-secondary-400'
  },
  { 
    name: 'FAQ', 
    href: '#faq', 
    icon: HelpCircle,
    iconColor: 'text-rose-400 dark:text-rose-500',
    activeBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    textColor: 'text-foreground/90 dark:text-rose-50',
    hoverText: 'hover:text-rose-500 dark:hover:text-rose-400'
  },
];

const springConfig = { stiffness: 300, damping: 30 };

export function BottomNavbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);
  
  // Track mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth the mouse position values
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Calculate background gradient position based on mouse
  const backgroundX = useTransform(smoothX, [0, window?.innerWidth || 1920], [-10, 10]);
  const backgroundY = useTransform(smoothY, [0, window?.innerHeight || 1080], [-10, 10]);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Auto-hide on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only trigger on mobile or when not hovered
      if (isMobile || !isHovered) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered, isMobile]);

  // Toggle visibility
  const toggleVisibility = () => {
    if (isMobile) {
      setIsHovered(!isHovered);
    }
  };

  // Handle item click
  const handleItemClick = (name: string) => {
    setActiveItem(name);
    if (isMobile) {
      setIsHovered(false);
    }
  };

  // Toggle metrics visibility
  const toggleMetrics = () => {
    setShowMetrics(!showMetrics);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{
        y: isVisible ? 0 : '100%',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      {/* Main Navigation */}
      <AnimatePresence>
        <motion.div 
          className={`relative overflow-hidden transition-all duration-300 ease-out ${isHovered ? 'h-auto py-4' : 'h-0'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
            height: isHovered ? 'auto' : 0,
            padding: isHovered ? '1rem 0' : '0'
          }}
          exit={{ opacity: 0, y: 20, height: 0, padding: '0' }}
          transition={{ 
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            height: { duration: 0.3 },
            padding: { duration: 0.3 }
          }}
        >
          {/* Glassmorphic container */}
          <motion.div 
            className="relative bg-gradient-to-b from-background/80 to-background/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20 rounded-2xl mx-4 overflow-hidden"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20
            }}
            transition={{
              delay: 0.1,
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Animated background gradient */}
            <motion.div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                background: 'radial-gradient(800px at 50% 50%, var(--gradient-color) 0%, rgba(0, 0, 0, 0) 70%)',
                x: backgroundX,
                y: backgroundY,
              }}
            />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex-1 flex justify-between max-w-4xl mx-auto">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.name;
                    
                    return (
                      <motion.div
                        key={item.name}
                        className="relative group"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: isHovered ? 0 : 20,
                          opacity: isHovered ? 1 : 0
                        }}
                        transition={{
                          delay: 0.05 * index + 0.1,
                          type: 'spring',
                          stiffness: 400,
                          damping: 20,
                          duration: 0.3
                        }}
                        whileHover={{ 
                          y: -6,
                          transition: { 
                            type: 'spring',
                            stiffness: 400,
                            damping: 10
                          }
                        }}
                      >
                        <Link 
                          href={item.href}
                          className={`flex flex-col items-center px-5 py-3 rounded-xl transition-all duration-300 transform ${
                            isActive 
                              ? `${item.activeBg} ${item.textColor} shadow-lg scale-105` 
                              : `text-foreground/70 hover:bg-foreground/5 ${item.hoverText} hover:scale-105`
                          } group-hover:scale-105 group-hover:shadow-md group-hover:bg-foreground/5`}
                          onClick={() => handleItemClick(item.name)}
                        >
                          <div 
                            className={`relative p-2 rounded-full transition-all duration-300 ${
                              isActive 
                                ? item.activeBg + ' shadow-md shadow-amber-500/10 dark:shadow-amber-500/5'
                                : 'group-hover:bg-amber-500/5 dark:group-hover:bg-white/5'
                            }`}>
                            <div className={`p-2 rounded-full mb-1 transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-br from-white/10 to-white/20 shadow-inner' 
                                : 'group-hover:bg-white/5'
                            }`}>
                              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
                            </div>
                            <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
                              isActive ? 'font-semibold' : 'font-medium'
                            }`}>
                              {item.name}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      {/* Main Navigation Bar */}
      <motion.div 
        className="flex justify-center cursor-pointer select-none"
        onClick={toggleVisibility}
        initial={false}
        animate={{
          backgroundColor: isHovered ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.7)',
          borderTopLeftRadius: isHovered ? 0 : 12,
          borderTopRightRadius: isHovered ? 0 : 12,
          backdropFilter: isHovered ? 'blur(16px)' : 'blur(8px)',
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
      >
        <motion.div 
          className="px-6 py-2.5 flex items-center justify-center gap-2"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="w-16 h-1.5 rounded-full bg-gradient-to-r from-amber-500/70 to-amber-400/70 relative overflow-hidden"
            animate={{
              opacity: isHovered ? 0 : 1,
            }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
              initial={{ x: '-100%' }}
              animate={{
                x: isHovered ? '100%' : '100%',
                transition: {
                  repeat: isHovered ? 0 : Infinity,
                  duration: 2,
                  ease: 'linear',
                }
              }}
            />
          </motion.div>
          
          <motion.div
            className="flex items-center justify-center text-amber-400/80"
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{
              duration: 0.2,
              delay: isHovered ? 0.1 : 0
            }}
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Hide</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
