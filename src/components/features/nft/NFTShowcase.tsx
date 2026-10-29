'use client';

import { useState, useRef, useEffect } from 'react';
import { getImagePath } from '@/lib/asset-paths';
import { motion, useAnimation, useTransform, useScroll, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';

// Import required modules
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';

interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  creator: string;
  collection: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  isLiked: boolean;
  likes: number;
}

// Type for Swiper configuration
const swiperConfig: SwiperType['params'] = {
  modules: [EffectCoverflow, Navigation, Autoplay],
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 200,
    modifier: 1,
    slideShadows: true,
  },
  spaceBetween: 24,
  loop: true,
  autoplay: {
    delay: 4500,
    disableOnInteraction: true,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    640: {
      spaceBetween: 24,
      coverflowEffect: {
        rotate: 10,
        stretch: 0,
        depth: 150,
        modifier: 1.5,
      },
    },
    1024: {
      spaceBetween: 32,
      coverflowEffect: {
        rotate: 10,
        stretch: 0,
        depth: 300,
        modifier: 2,
      },
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

interface NFT {
  id: number;
  name: string;
  image: string;
  price: string;
  likes: number;
  isLiked: boolean;
  creator: string;
  collection: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

const NFTShowcase: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: 1,
      name: 'DeFi Ant #101',
      image: getImagePath('Defi_Ant_upscaled image#101.jpg'),
      price: '2.5 SOL',
      likes: 87,
      isLiked: false,
      creator: '0x1a2b...3c4d',
      collection: 'DeFi Ants Genesis',
      description: 'Rare DeFi ant with diamond-encrusted exoskeleton',
      rarity: 'Epic'
    },
    {
      id: 2,
      name: 'Cosmic Ant #042',
      image: getImagePath('UniversalUpscaler_bd00a760-f541-4742-a6fe-93ddde137d99.jpg'),
      price: '1.5 SOL',
      likes: 124,
      isLiked: true,
      creator: '0x3f4e...5d6e',
      collection: 'Cosmic Ant Colony',
      description: 'Warrior ant with cosmic energy aura',
      rarity: 'Rare'
    },
    {
      id: 3,
      name: 'Golden Ant #007',
      image: getImagePath('UniversalUpscaler_f7efa4a0-24c4-4fa1-800e-021cde23c9a6 2.jpg'),
      price: '7.5 SOL',
      likes: 256,
      isLiked: false,
      creator: '0x7g8h...9i0j',
      collection: 'Golden Ant Empire',
      description: 'Legendary golden ant with diamond accents',
      rarity: 'Legendary'
    },
    {
      id: 4,
      name: 'Crystal Ant #133',
      image: getImagePath('UniversalUpscaler_ff43f157-7b44-4829-b3a9-3abb7a4406f1.jpg'),
      price: '4.2 SOL',
      likes: 92,
      isLiked: false,
      creator: '0x2b3c...4d5e',
      collection: 'Crystal Hive',
      description: 'Crystalline ant with prismatic refraction',
      rarity: 'Epic'
    },
    {
      id: 5,
      name: 'DeFi Ant Drop',
      image: getImagePath('defi_ant_drop.jpg'),
      price: '0.8 SOL',
      likes: 312,
      isLiked: true,
      creator: '0x4c5d...6e7f',
      collection: 'DeFi Ants Genesis',
      description: 'Limited edition DeFi ant from the initial drop',
      rarity: 'Uncommon'
    },
    {
      id: 6,
      name: 'DeFi Ant Logo',
      image: getImagePath('defi_ant_logo_0227.jpg'),
      price: '1.2 SOL',
      likes: 178,
      isLiked: false,
      creator: '0x9a8b...7c6d',
      collection: 'DeFi Ants Genesis',
      description: 'Official DeFi Ant logo variant',
      rarity: 'Common'
    },
    {
      id: 7,
      name: 'Mystery Ant #382',
      image: getImagePath('image(382).jpg'),
      price: '2.2 SOL',
      likes: 145,
      isLiked: false,
      creator: '0x5e6f...8g9h',
      collection: 'Mystery Hive',
      description: 'Mysterious ant with unknown origins',
      rarity: 'Rare'
    },
    {
      id: 8,
      name: 'Signal Ant #002',
      image: getImagePath('signal-2024-12-23-100631_002.jpeg'),
      price: '1.8 SOL',
      likes: 98,
      isLiked: true,
      creator: '0x1i2j...3k4l',
      collection: 'Signal Hive',
      description: 'Ant with advanced communication signals',
      rarity: 'Uncommon'
    },
    {
      id: 9,
      name: 'Signal Ant #002 (Variant)',
      image: getImagePath('signal-2024-12-23-100631_002 2.jpeg'),
      price: '2.8 SOL',
      likes: 112,
      isLiked: false,
      creator: '0x1i2j...3k4l',
      collection: 'Signal Hive',
      description: 'Rare variant with enhanced signal patterns',
      rarity: 'Rare'
    }
  ]);

  // Animation variants with proper TypeScript types
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const getItemVariants = (i: number) => ({
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: i * 0.1,
      },
    },
    hover: {
      y: -10,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 15
      }
    }
  } as const);

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  // Remove unused y3 or use it if needed
  // const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const handleLike = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNfts(prevNfts => 
      prevNfts.map(nft => 
        nft.id === id 
          ? { ...nft, isLiked: !nft.isLiked, likes: nft.isLiked ? nft.likes - 1 : nft.likes + 1 } 
          : nft
      )
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'text-gray-400';
      case 'Uncommon':
        return 'text-green-400';
      case 'Rare':
        return 'text-blue-400';
      case 'Epic':
        return 'text-purple-400';
      case 'Legendary':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="relative">
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, rgba(0, 0, 0, 0) 70%)' }}
        >
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-3xl"
            style={{ y: y1 }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-secondary-500/10 to-accent-500/10 blur-3xl"
            style={{ y: y2 }}
          />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div 
              variants={getItemVariants(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Exclusive NFT Collection</span>
            </motion.div>
          
          <motion.h2 
            variants={getItemVariants(1)}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400"
          >
            DeFiANT Solana NFT Gallery
          </motion.h2>
          
          <motion.p 
            variants={getItemVariants(2)}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Discover, collect, and trade unique DeFiANT digital collectibles on Solana with real utility in our ecosystem
          </motion.p>

          <motion.div 
            variants={getItemVariants(3)} 
            className="relative w-full max-w-[2000px] mx-auto px-4"
          >
            <div className="relative">
              <Swiper
                {...swiperConfig}
                className="!overflow-visible"
                onSwiper={(swiper) => console.log(swiper)}
              >
                {nfts.map((nft) => (
                  <SwiperSlide key={nft.id} className="!w-[320px] h-auto pb-12">
                    <motion.div 
                      variants={getItemVariants(0)}
                      className="relative h-full w-full bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/20 hover:shadow-2xl transition-all duration-300 flex flex-col group"
                      style={{ minHeight: '500px' }}
                    >
                      <div className="relative w-full pt-[100%] overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={nft.image}
                            alt={nft.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div className="flex items-center gap-2 text-white text-sm">
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              {nft.creator}
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            nft.rarity === 'Legendary' ? 'bg-amber-900/30 text-amber-400' :
                            nft.rarity === 'Epic' ? 'bg-purple-900/30 text-purple-400' :
                            nft.rarity === 'Rare' ? 'bg-blue-900/30 text-blue-400' :
                            nft.rarity === 'Uncommon' ? 'bg-green-900/30 text-green-400' :
                            'bg-gray-900/30 text-gray-400'
                          }`}>
                            {nft.rarity}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleLike(nft.id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                            nft.isLiked 
                              ? 'bg-red-500/20 text-red-500' 
                              : 'bg-black/50 text-white/80 hover:bg-black/70'
                          }`}
                        >
                          <Heart 
                            className={`w-5 h-5 ${nft.isLiked ? 'fill-current' : ''}`} 
                          />
                        </button>
                      </div>
                      <div className="p-5 pt-3 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-foreground">{nft.name}</h3>
                          <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                            {nft.price}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 flex-1">{nft.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/20">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className={`w-4 h-4 ${nft.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                              {nft.likes}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {nft.collection}
                          </div>
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-500/20">
                          View Details
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Navigation Buttons */}
              <div className="absolute top-1/2 left-0 right-0 z-10 flex justify-between px-4 -translate-y-1/2 pointer-events-none">
                <button 
                  className="swiper-button-prev flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 pointer-events-auto"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                  className="swiper-button-next flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 pointer-events-auto"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Call to Action */}
          <motion.div 
            variants={getItemVariants(4)}
            className="mt-16 text-center"
          >
            <Link
              href="/nft-collection"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-300 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5"
            >
              View Full Collection
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
          
          </motion.div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent -z-10" />
        </div>
      </section>
    </div>
  );
};

export default NFTShowcase;
