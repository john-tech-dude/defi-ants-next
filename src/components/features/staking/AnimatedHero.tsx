'use client';

import { motion, Variants } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles, BarChart3, Users, TrendingUp, Shield } from 'lucide-react';
import Button from '@/components/ui/button';

interface StatCardProps {
  value: string;
  label: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard = ({ value, label, change, isPositive, icon: Icon }: StatCardProps) => (
  <motion.div
    className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-primary-500/10">
          <Icon className="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <span className="text-2xl font-bold text-white">
            {value}
          </span>
          {change && (
            <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const AnimatedGradientText = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500"
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    }}
    style={{
      backgroundSize: '200% 200%',
    }}
  >
    {children}
  </motion.span>
);

const FloatingParticles = ({ count = 20 }: { count?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 20 + 5;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              opacity: 0.6,
            }}
            initial={{ y: 0, x: 0 }}
            animate={{
              y: [0, -100, -200, -300],
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0.6, 0.8, 0.4, 0],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.3, 0.7, 1],
            }}
          />
        );
      })}
    </div>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const AnimatedCoin = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg"
    style={{
      width: 120,
      height: 120,
    }}
    initial={{ y: 0, rotate: 0, scale: 0 }}
    animate={{
      y: [0, -20, 0],
      rotate: 360,
      scale: 1,
    }}
    transition={{
      y: {
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: delay,
      },
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
        delay: delay,
      },
      scale: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    }}
  />
);

export default function AnimatedHero() {
  const containerRef = useRef(null);
  
  // Stats data
  const stats = [
    { 
      value: '$0.000420', 
      label: 'Price', 
      change: '+12.50% (24h)',
      isPositive: true,
      icon: TrendingUp 
    },
    { 
      value: '12,543', 
      label: 'Holders',
      icon: Users 
    },
    { 
      value: '$5.2M', 
      label: 'Market Cap',
      icon: BarChart3 
    },
    { 
      value: '1M+', 
      label: 'Total Supply',
      icon: Shield 
    },
  ];

  // Exchange badges
  const exchangeBadges = [
    { name: 'Raydium', icon: '🔥' },
    { name: 'Jupiter', icon: '🔥' },
    { name: 'CoinTelegraph', icon: '✨' },
    { name: 'Decrypt', icon: '✨' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background elements */}
      <FloatingParticles count={30} />
      
      {/* Animated coins */}
      <AnimatedCoin />
      <AnimatedCoin delay={0.5} />
      <AnimatedCoin delay={1} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          ref={containerRef}
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Next Generation Staking Platform</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            <span className="block">Stake Smarter,</span>
            <AnimatedGradientText>Earn More</AnimatedGradientText>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Maximize your crypto returns with our secure staking platform. 
            Earn up to <span className="font-semibold text-white">20% APY</span> on your favorite assets.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white"
            >
              <span className="relative z-10 flex items-center">
                Start Staking Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/5 hover:bg-white/10 border-white/10 text-white"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={containerVariants}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Live Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  variants={itemVariants}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>
            
            {/* Verification Badges */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span className="text-sm font-medium text-green-400 flex items-center">
                  <Shield className="w-4 h-4 mr-1" /> Audited
                </span>
                <span className="text-sm font-medium text-blue-400 flex items-center">
                  <Shield className="w-4 h-4 mr-1" /> KYC Verified
                </span>
                
                {exchangeBadges.map((badge) => (
                  <span key={badge.name} className="text-sm font-medium text-amber-300 flex items-center">
                    {badge.icon} {badge.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-32 bg-gradient-to-r from-primary-500/10 to-blue-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to start staking?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of users growing their crypto portfolio with our secure and reliable staking platform.
              </p>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 flex items-center group"
                >
                  Connect Wallet
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
