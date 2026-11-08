'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Shuffle, ExternalLink, ArrowRight } from 'lucide-react'
import Button from './ui/button'

// Sample NFT collection data
const NFT_COLLECTION = [
  {
    id: 1,
    name: 'Golden ANT #001',
    image: '/nfts/golden-ant.jpg',
    price: '0.5 SOL',
    rarity: 'Legendary',
    ownedBy: '0x7f...3a4b'
  },
  {
    id: 2,
    name: 'Worker ANT #042',
    image: '/nfts/worker-ant.jpg',
    price: '0.1 SOL',
    rarity: 'Common',
    ownedBy: '0x8e...5c2d'
  },
  {
    id: 3,
    name: 'Queen ANT #007',
    image: '/nfts/queen-ant.jpg',
    price: '1.2 SOL',
    rarity: 'Epic',
    ownedBy: '0x2f...9e1a'
  },
  {
    id: 4,
    name: 'Soldier ANT #1337',
    image: '/nfts/soldier-ant.jpg',
    price: '0.3 SOL',
    rarity: 'Rare',
    ownedBy: '0x5d...8b3c'
  }
]

export default function AntNftCollection() {
  const [currentNft, setCurrentNft] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const handleShuffle = () => {
    const nextNft = (currentNft + 1) % NFT_COLLECTION.length
    setCurrentNft(nextNft)
  }

  return (
    <section id="nft-collection" className="py-24 relative overflow-hidden bg-gradient-to-b from-background/95 to-background">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-500/5 to-transparent -z-10" />
      
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-wider text-primary-500 font-medium mb-3 block">
            Digital Collectibles
          </span>
          <h2 className="text-4xl md:text-5xl font-display tracking-wide mb-6">
            ANT <span className="gradient-text">NFT Collection</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Exclusive digital collectibles on the Solana blockchain. Own a piece of the ANT ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold">
              Own a Piece of the Colony
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              Our ANT NFT collection features unique, algorithmically generated ants with various rarities and traits. 
              Each ANT NFT is a digital collectible that grants you access to exclusive benefits within the ecosystem.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary-500/10 p-2 rounded-lg mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Exclusive Access</h4>
                  <p className="text-sm text-muted-foreground">Special channels, events, and early access to new features</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary-500/10 p-2 rounded-lg mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <path d="M4.93 4.93l2.83 2.83"></path>
                    <path d="M16.24 16.24l2.83 2.83"></path>
                    <path d="M2 12h4"></path>
                    <path d="M18 12h4"></path>
                    <path d="M4.93 19.07l2.83-2.83"></path>
                    <path d="M16.24 7.76l2.83-2.83"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Staking Rewards</h4>
                  <p className="text-sm text-muted-foreground">Earn passive income by staking your ANT NFTs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary-500/10 p-2 rounded-lg mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">Community Governance</h4>
                  <p className="text-sm text-muted-foreground">Voting rights for future collection decisions</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                variant="primary" 
                size="lg" 
                href="https://magiceden.io/marketplace/ant-nft-collection"
                icon={<ExternalLink size={16} />}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on MagicEden
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                href="#how-to-buy"
                icon={<ArrowRight size={16} />}
              >
                How to Buy
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h4 className="font-medium">Featured NFT</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShuffle}
                  icon={<Shuffle size={16} />}
                  iconPosition="left"
                >
                  Shuffle
                </Button>
              </div>
              
              <div className="relative aspect-square w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 z-0"></div>
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🪲</div>
                    <p className="text-muted-foreground text-sm">Preview of {NFT_COLLECTION[currentNft].name}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-semibold text-xl">{NFT_COLLECTION[currentNft].name}</h5>
                    <div className="inline-block px-2 py-0.5 bg-primary-500/10 text-primary-500 text-xs rounded-full mt-1">
                      {NFT_COLLECTION[currentNft].rarity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="font-bold text-lg">{NFT_COLLECTION[currentNft].price}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted-foreground">Owned by</div>
                      <div className="text-sm font-mono">{NFT_COLLECTION[currentNft].ownedBy}</div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      href="#"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-500/10 rounded-full blur-xl -z-10" />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-secondary-500/10 rounded-full blur-xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
