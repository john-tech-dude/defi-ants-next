'use client'

import { getImagePath } from '@/lib/asset-paths';
import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

export default function NFTGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const controls = useAnimation()
  const [hasTriggered, setHasTriggered] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView && !hasTriggered) {
      setHasTriggered(true)
      controls.start('visible')
    }
  }, [controls, inView, hasTriggered])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const nfts = [
    {
      id: 1,
      name: 'DeFi Ant Drop',
      image: getImagePath('defi_ant_drop.jpg'),
      description: 'Limited edition DeFi ant from the initial drop',
      rarity: 'Legendary',
      price: '🐜💎',
    },
    {
      id: 2,
      name: 'DeFi Ant #001',
      image: getImagePath('2fEGQtIjDHIoGniyg1df--1--tq90c.jpg'),
      description: 'The original DeFi Ant genesis piece',
      rarity: 'Epic',
      price: '👑�',
    },
    {
      id: 3,
      name: 'DeFi Ant #002',
      image: getImagePath('pCUrBYG8x2hHthrPxIEG--1--9chku.jpg'),
      description: 'Rare variant with enhanced patterns',
      rarity: 'Rare',
      price: '🎁�',
    },
  ]

  const nextNft = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % nfts.length)
  }

  const prevNft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length)
  }

  const benefits = [
    'X: 15K+ Followers - Follow us for the latest updates, announcements, and community activities',
    'Telegram: 8K+ Members - Join our Telegram group for real-time discussions and direct team access',
    'Discord: 12K+ Members - Be part of our growing Discord community with exclusive perks and events',
    'YouTube: 5K+ Subscribers - Watch tutorials, AMA sessions, and stay updated with our latest video content',
    'Reddit: 3K+ Members - Join discussions, share ideas, and connect with fellow ANTS in our subreddit',
    'Don\'t miss out on the revolution. Join thousands of like-minded individuals who believe in financial freedom and decentralization.',
  ]

  return (
    <section id="nft" className="bg-gradient-to-b from-background/95 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 left-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2.8s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="section-kicker mb-3">
            Meme Gallery
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-display tracking-wide mb-6">
            <span className="gradient-text">ANT Meme Collection</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The best memes from the ANT community - because we're a meme token with actual utility!
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={hasTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative lg:col-span-7 xl:col-span-8"
          >
            <div className="relative aspect-square w-full max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95, rotate: -5, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0, 
                    y: 0,
                    transition: { 
                      duration: 0.6, 
                      ease: [0.16, 1, 0.3, 1],
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.95, 
                    rotate: 5, 
                    y: -20,
                    transition: { duration: 0.3 }
                  }}
                  whileHover={{
                    y: -10,
                    transition: { 
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1]
                    }
                  }}
                  className="absolute inset-0 group"
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden transition-all duration-500 transform-gpu will-change-transform">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 via-transparent to-secondary-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -m-1 z-10" />
                    
                    {/* Main card */}
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-1.5 z-0">
                      {/* Inner glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Image container with shine effect */}
                      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Main image */}
                        <img
                          src={nfts[currentIndex].image}
                          alt={nfts[currentIndex].name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="eager"
                          onError={(e) => {
                            console.error('Failed to load image:', nfts[currentIndex].image);
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMxZjFmMWYiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                          }}
                          style={{
                            backgroundColor: '#1a1a1a',
                            backgroundImage: 'linear-gradient(45deg, #2a2a2a 25%, #333 25%, #333 50%, #2a2a2a 50%, #2a2a2a 75%, #333 75%, #333 100%)',
                            backgroundSize: '20px 20px'
                          }}
                        />
                        
                        {/* Shine overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      {/* Price badge */}
                      <motion.div 
                        className="absolute top-5 right-5 bg-gradient-to-r from-accent-500 to-yellow-400 text-black font-bold px-4 py-1.5 rounded-full shadow-lg z-20"
                        initial={{ scale: 0.9, rotate: 3 }}
                        animate={{ 
                          scale: 1, 
                          rotate: [3, -2, 3],
                          transition: { 
                            duration: 4,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut'
                          }
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <span className="flex items-center">
                          <span className="text-sm">{nfts[currentIndex].price}</span>
                        </span>
                      </motion.div>
                      
                      {/* Bottom info panel */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-sm rounded-b-2xl">
                        <div className="mb-2">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {nfts[currentIndex].name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-300 mb-4">{nfts[currentIndex].description}</p>
                        <div className="flex flex-wrap justify-between items-center gap-3">
                          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-black text-xs px-4 py-1.5 rounded-full font-bold shadow-lg whitespace-nowrap">
                            {nfts[currentIndex].rarity}
                          </span>
                          <button 
                            className="group/button relative overflow-hidden text-xs bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 flex items-center gap-1 hover:gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>View on Magic Eden</span>
                            <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover/button:opacity-100 transition-all" />
                            <span className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-transparent -left-full group-hover/button:left-0 transition-[left] duration-300 -z-10" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Reflection effect */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-white/30 to-transparent transform -rotate-45 origin-bottom-right" />
                    </div>
                  </div>
                  
                  {/* Floating animation */}
                  <motion.div 
                    className="absolute inset-0 rounded-3xl overflow-hidden -z-10"
                    animate={{
                      y: [0, -10, 0],
                      transition: {
                        duration: 6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                      }
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-6">
                <button
                  onClick={prevNft}
                  className="bg-primary-500/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-full p-4 shadow-lg hover:bg-primary-500/30 hover:scale-110 transition-all duration-300"
                  aria-label="Previous NFT"
                >
                  <ChevronLeft className="h-5 w-5 text-primary-500" />
                </button>
                <button
                  onClick={nextNft}
                  className="bg-primary-500/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-full p-4 shadow-lg hover:bg-primary-500/30 hover:scale-110 transition-all duration-300"
                  aria-label="Next NFT"
                >
                  <ChevronRight className="h-5 w-5 text-primary-500" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={hasTriggered ? 'visible' : 'hidden'}
            variants={containerVariants}
            className="space-y-8 lg:col-span-5 xl:col-span-4"
          >
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed">
              We're not just another meme token - we're a meme token with real utility and an amazing community of ANT enthusiasts!
            </motion.p>
            
            <motion.div variants={itemVariants} className="space-y-5 mt-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start group meme-card p-3 hover:scale-[1.02] transition-all duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="mt-1 mr-4 bg-gradient-to-br from-primary-500/30 to-accent-500/30 p-2 rounded-full border-2 border-primary-500/30 group-hover:border-primary-500/50 transition-all duration-300 animate-pulse-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <motion.p 
                    className="text-base pt-1 group-hover:text-primary-300 transition-colors duration-300"
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                  >
                    {benefit}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-10">
              <a
                href="https://opensea.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                <span>Join the ANT Army</span>
                <ExternalLink size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />

              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Community Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Holders', value: '15K+', icon: '👥' },
              { label: 'Market Cap', value: '$2.5M', icon: '💰' },
              { label: 'Transactions', value: '125K+', icon: '⚡' },
              { label: 'Community', value: '25K+', icon: '🌍' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="meme-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
