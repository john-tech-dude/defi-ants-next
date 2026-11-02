'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHover,
  springBouncy,
  durations,
  easings,
} from '@/lib/animations';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Shield, Zap, Users, Rocket, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import { Title } from '@/components/ui/Title';

// Define feature type
type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

// Import AnimatedCounter with SSR disabled
const AnimatedCounter = dynamic<{ value: number; suffix: string }>(
  () => import('@/components/ui/AnimatedCounter').then(mod => mod.default),
  {
    ssr: false,
    loading: () => <span>0</span>,
  }
);

export default function About() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [counterRef] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants: Variants = staggerContainer;
  const itemVariants: Variants = staggerItem;

  // Stats for counter animation
  const stats = [
    { value: 25000, label: 'Community Members', suffix: '+' },
    { value: 12, label: 'Months Since Launch', suffix: '' },
    { value: 5000, label: 'NFT Holders', suffix: '+' },
    { value: 99, label: 'Percent Fun', suffix: '%' },
  ];

  // Features array
  const features: Feature[] = [
    {
      icon: <Shield className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'Secure & Transparent',
      description: 'Built on Solana blockchain with smart contracts audited for security and transparency.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'Lightning Fast',
      description: 'Experience near-instant transactions with Solana\'s high-performance blockchain.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'Community Driven',
      description: 'Governed by our community with a focus on decentralization and collective decision making.',
    },
    {
      icon: <Rocket className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'Meme Utility',
      description: 'Staking rewards, NFT integration, and community incentives that give real value to our meme token.',
    },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div
        className="absolute top-40 left-0 w-80 h-80 bg-gradient-to-br from-primary-500/30 to-primary-400/10 rounded-full blur-[100px] -z-10 animate-float will-change-transform opacity-0 md:opacity-100"
      />
      <div
        className="absolute bottom-40 right-0 w-96 h-96 bg-gradient-to-tr from-accent-500/20 to-primary-500/10 rounded-full blur-[120px] -z-10 animate-float will-change-transform opacity-0 md:opacity-100"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-secondary-500/10 via-primary-500/5 to-secondary-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow will-change-transform opacity-0 md:opacity-100"
      />
      
      <div className="container-custom relative">
        {/* Animated background elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 -z-10"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1,
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.2, 0.1],
              transition: {
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
            }}
          />
        ))}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-background/80 shadow-2xl group"
              whileHover={{ 
                y: -5,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: { 
                  y: { type: 'spring', stiffness: 300, damping: 15 },
                  boxShadow: { duration: 0.3 }
                }
              }}
            >
              {/* Main image */}
              <motion.div 
                className="relative w-full h-full overflow-hidden"
                initial={{ scale: 1.05 }}
                animate={{ 
                  scale: [1.05, 1.03, 1.05],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <Image
                  src="/vision/defi-ant-vision.png"
                  alt="DeFi Ants Vision"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="relative h-1/3 w-full">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: [0.8, 0.9, 0.8] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut'
                        }}
                      />
                      <motion.div 
                        className="absolute inset-0 p-8 text-white flex flex-col justify-center"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <motion.h3 
                          className="text-3xl font-bold mb-3"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          Our Vision
                        </motion.h3>
                        <motion.p 
                          className="text-lg opacity-90 leading-relaxed"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                        >
                          Building a decentralized future where everyone can participate in the crypto revolution through simple, secure, and rewarding DeFi solutions.
                        </motion.p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Animated particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/20 z-10"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, Math.random() * 40 - 20],
                    x: [0, Math.random() * 40 - 20],
                    opacity: [0.2, 0.8, 0.2],
                    transition: {
                      duration: 3 + Math.random() * 4,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    },
                  }}
                />
              ))}
              
              {/* Hover glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                whileHover={{ 
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeOut" }
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
              
              {/* Border highlight on hover */}
              <motion.div 
                className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-primary-500/30 transition-colors duration-500 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 1,
                  transition: { duration: 0.3 }
                }}
              />
              
              {/* Subtle floating effect */}
              <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-primary-500/5 blur-xl rounded-full"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                whileInView={{ 
                  opacity: 0.5, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2
                  }
                }}
                viewport={{ once: true, margin: "-50px" }}
              />
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              ref={ref}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={containerVariants}
              className="space-y-6"
            >
              <span className="section-kicker mb-4">The colony</span>
              <Title 
                as="h3" 
                variant="h3"
                gradient="primary"
                className="text-3xl mb-4"
              >
                Why ride with DeFi ANT!?
              </Title>
              
              <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed">
                We are a meme token with utility on Solana! Created by a team of crypto enthusiasts and meme lovers, DeFi ANT! launched in 2023 with a mission to bring fun, community, and actual utility to the meme token space.
              </motion.p>
              
              <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed mb-8">
                Our token combines the viral appeal of meme culture with real DeFi functionality, leveraging Solana's fast and low-cost blockchain to provide staking, NFTs, and community governance to our ANT army.
              </motion.p>
              
              <motion.div 
                className="h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-transparent w-48 mx-auto mb-8 rounded-full relative overflow-hidden"
                variants={itemVariants}
              >
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileInView={{ 
                    x: '100%',
                    transition: { 
                      duration: 2,
                      delay: 1,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'linear'
                    }
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                />
              </motion.div>
              
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-6 sticker-card group"
                  >
                    <div className="relative z-10">
                      <div className="w-12 h-12 flex items-center justify-center bg-primary-500/10 rounded-lg mb-4 group-hover:bg-primary-500/20 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-display tracking-wide mb-3 group-hover:text-primary-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-8">
                <Button href="#tokenomics" className="btn-outline">
                  Explore Tokenomics <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
