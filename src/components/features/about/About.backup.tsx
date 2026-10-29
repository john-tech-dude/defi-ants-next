'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { fadeInUp, staggerContainer, optimizeAnimation } from '@/lib/animations';
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'Community First',
      description: 'Built by the community, for the community - with regular AMAs, events, and meme contests.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'Solana Speed',
      description: 'Fast and cheap transactions on Solana make our token perfect for micro-transactions and tipping.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'ANT DAO',
      description: 'Vote on proposals with your ANT tokens and help shape the future of our ecosystem.',
    },
    {
      icon: <Rocket className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />,
      title: 'Meme Utility',
      description: 'Staking rewards, NFT integration, and community incentives that give real value to our meme token.',
    },
  ]

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
        style={optimizeAnimation} 
      />
      <div 
        className="absolute bottom-40 right-0 w-96 h-96 bg-gradient-to-tr from-accent-500/20 to-primary-500/10 rounded-full blur-[120px] -z-10 animate-float will-change-transform opacity-0 md:opacity-100" 
        style={{ ...optimizeAnimation, animationDelay: '2s' }} 
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-secondary-500/10 via-primary-500/5 to-secondary-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow will-change-transform opacity-0 md:opacity-100" 
        style={optimizeAnimation} 
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
              filter: 'blur(40px)',
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-20 relative z-10"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: 'spring',
                  stiffness: 100,
                  damping: 20
                }
              }
            }}
            animate={inView ? 'visible' : 'hidden'}
            className="inline-block px-5 py-2.5 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 backdrop-blur-sm shadow-lg relative overflow-hidden group"
          >
            <motion.span 
              className="relative z-10 text-primary-500 font-bold flex items-center justify-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Our Vision
            </motion.span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-primary-500/30 to-transparent opacity-0 group-hover:opacity-100"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Title 
              as="h2" 
              variant="h2" 
              className="mb-6 inline-block"
            >
              <motion.span
                className="inline-block"
                initial={{ y: 0 }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                The{' '}
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500"
                  initial={{ backgroundPosition: '0% 50%' }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  whileHover={{
                    scale: 1.05,
                    textShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                  }}
                >
                  DeFi ANT!
                </motion.span>{' '}
                Vision
              </motion.span>
            </Title>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto"
          >
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.6, duration: 0.8 }
              }}
            >
              Building a revolutionary DeFi ecosystem on Solana's high-performance blockchain
            </motion.p>
            
            {/* Animated underline */}
            <motion.div 
              className="h-0.5 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent mt-6 mx-auto w-1/3"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                transition: { delay: 0.8, duration: 1, ease: 'easeInOut' }
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Counter Section */}
      <div className="container-custom">
        <motion.div
          ref={counterRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.1 * index,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }
              }}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{
                y: -5,
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              className="relative p-6 rounded-xl group bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary-500/30 transition-all duration-300 overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0.5, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
              />
              <div className="relative z-10">
                <Title 
                  as="h3" 
                  variant="h3" 
                  className="relative mb-2 text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400"
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </Title>
                <motion.p 
                  className="text-sm font-medium text-muted-foreground group-hover:text-primary-500 transition-colors"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {stat.label}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div 
              ref={containerRef}
              className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-background/80 shadow-2xl group"
            >
              {/* Main image with GSAP animations */}
              <div 
                ref={imageRef}
                className="relative w-full h-full overflow-hidden"
              >
                <Image
                  src="/vision/defi-ant-vision.png"
                  alt="DeFi ANT! Vision"
                  fill
                  className="object-cover object-center will-change-transform"
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Animated gradient overlay */}
                <div 
                  className="absolute inset-0 z-10"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                  }}
                />
              </div>
              
              {/* Content overlay with GSAP animations */}
              <div 
                ref={contentRef}
                className="absolute inset-0 z-20 p-8 flex flex-col justify-end pointer-events-none"
              >
                <div className="pointer-events-auto">
                  <div 
                    ref={titleRef}
                    className="text-2xl md:text-3xl font-bold text-white mb-3"
                    style={{ opacity: 0, transform: 'translateY(40px)' }}
                  >
                    <Title as="h3" variant="h3">
                      Our Vision for DeFi
                    </Title>
                  </div>
                  <p 
                    className="text-white/80 mb-4 max-w-md"
                    ref={textRef}
                    style={{ opacity: 0, transform: 'translateY(30px)' }}
                  >
                    Leading the next generation of decentralized finance with innovative solutions and a strong community.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 text-white transform transition-all duration-300 hover:scale-105"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
              
              {/* Animated particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10 z-30"
                  initial={{
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    opacity: 0,
                  }}
                  animate={{
                    y: [0, Math.random() * 40 - 20],
                    opacity: [0, 0.6, 0],
                    transition: {
                      duration: Math.random() * 3 + 3,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    },
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
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
            </div>
          </div>

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
              <Title 
                as="h3" 
                variant="h3"
                className="text-3xl font-bold mb-4"
              >
                Why Choose DeFi ANT!?
              </Title>
              
              <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed">
                We are a meme token with utility on Solana! Created by a team of crypto enthusiasts and meme lovers, DeFi ANT! launched in 2023 with a mission to bring fun, community, and actual utility to the meme token space.
              </motion.p>
              
              <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed mb-8">
                Our token combines the viral appeal of meme culture with real DeFi functionality, leveraging Solana's fast and low-cost blockchain to provide staking, NFTs, and community governance to our ANT army.
              </motion.p>
              
              <motion.div 
                className="h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-transparent w-48 mx-auto mb-8 rounded-full relative overflow-hidden"
                initial={{ scaleX: 0 }}
                whileInView={{ 
                  scaleX: 1,
                  transition: { 
                    duration: 1.2,
                    delay: 0.4,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }}
                viewport={{ once: true, margin: "-50px" }}
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
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-6 card-hover backdrop-blur-sm group relative overflow-hidden rounded-xl"
                  >
                    {/* Feature content */}
                    <div className="relative z-10">
                      <div className="w-12 h-12 flex items-center justify-center bg-primary-500/10 rounded-lg mb-4 group-hover:bg-primary-500/20 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary-500 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Hover effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-6 card-hover backdrop-blur-sm group relative overflow-hidden rounded-xl"
                  >
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400/0 via-primary-500/80 to-primary-400/0 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    
                    <div className="relative z-10 mb-5 bg-primary-500/10 p-3 rounded-xl inline-block group-hover:bg-primary-500/20 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary-500 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-primary-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

// About component export
export default About;
