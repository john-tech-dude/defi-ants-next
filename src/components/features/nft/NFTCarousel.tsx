'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, ArrowUpRight, ExternalLink, X } from 'lucide-react';
import Image from 'next/image';
import GlassCard from '@/components/ui/glass-card';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Import required modules
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';

// Get swiper configuration based on number of items
const getSwiperConfig = (items: any[]) => {
  const config = {
    modules: [Navigation, Autoplay, EffectFade],
    spaceBetween: 32,
    slidesPerView: 1,
    centeredSlides: true,
    loop: items.length > 3, // Only enable loop if we have enough slides
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    watchOverflow: true, // Disable swiper if not enough slides
    noSwiping: items.length <= 1, // Disable swiping if only one slide
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function (this: any) {
        // Add custom classes to navigation buttons
        const nextButton = document.querySelector('.swiper-button-next');
        const prevButton = document.querySelector('.swiper-button-prev');
        
        if (nextButton) nextButton.classList.add('custom-swiper-button');
        if (prevButton) prevButton.classList.add('custom-swiper-button');
      },
    },
    breakpoints: {
      768: {
        slidesPerView: 1.5,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 2.5,
        centeredSlides: false,
      },
      1280: {
        slidesPerView: 3,
        centeredSlides: false,
      },
    }
  };
  
  return config;
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
  isTrending?: boolean;
  isAuction?: boolean;
}

const NFTCarousel = () => {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const swiperRef = useRef<any>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Don't render on server
  if (!mounted) {
    return null;
  }

  // Load NFT data
  useEffect(() => {
    // This would typically be an API call
    const loadNFTs = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        const mockNFTs: NFT[] = [
          {
            id: 1,
            name: 'DeFi ANT #001',
            image: '/nfts/ant1.png',
            price: '0.5 SOL',
            likes: 124,
            isLiked: false,
            creator: '0x1234...5678',
            collection: 'DeFi ANTS',
            description: 'A rare DeFi ANT with special abilities in the ecosystem.',
            rarity: 'Rare',
            isTrending: true
          },
          {
            id: 2,
            name: 'DeFi ANT #002',
            image: '/nfts/ant2.png',
            price: '0.3 SOL',
            likes: 89,
            isLiked: false,
            creator: '0x1234...5678',
            collection: 'DeFi ANTS',
            description: 'A common DeFi ANT with unique features.',
            rarity: 'Common'
          },
          {
            id: 3,
            name: 'DeFi ANT #003',
            image: '/nfts/ant3.png',
            price: '0.7 SOL',
            likes: 156,
            isLiked: false,
            creator: '0x1234...5678',
            collection: 'DeFi ANTS',
            description: 'An epic DeFi ANT with legendary potential.',
            rarity: 'Epic',
            isAuction: true
          },
          {
            id: 4,
            name: 'DeFi ANT #004',
            image: '/nfts/ant4.png',
            price: '1.2 SOL',
            likes: 201,
            isLiked: false,
            creator: '0x1234...5678',
            collection: 'DeFi ANTS',
            description: 'A legendary DeFi ANT with exclusive benefits.',
            rarity: 'Legendary',
            isTrending: true
          }
        ];
        setNfts(mockNFTs);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTs();
  }, []);

  const openModal = (nft: NFT) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Custom navigation handlers
  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 dark:from-yellow-300 dark:to-amber-400">
            Featured NFT Collection
          </h2>
          <p className="text-muted-foreground mt-2">Discover exclusive Solana NFTs from top collections</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={goPrev}
            className="p-2 rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="p-2 rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Swiper
        {...getSwiperConfig(nfts)}
        className="w-full"
        onSwiper={(swiper) => {
          // Store Swiper instance
          swiperRef.current = swiper;
        }}
      >
        {nfts.map((nft) => (
          <SwiperSlide key={nft.id}>
            <GlassCard className="mx-2 flex flex-col h-full group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30" variant="elevated">
              <div className="relative h-56 w-full sm:h-64 md:h-72 lg:h-64 xl:h-72 bg-card/50 flex items-center justify-center overflow-hidden rounded-t-lg">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="font-bold text-white text-lg truncate">{nft.name}</div>
                  <div className="text-sm text-amber-200/90 truncate">{nft.collection}</div>
                </div>
                <div className="absolute top-3 left-3 flex space-x-2">
                  {nft.isTrending && (
                    <span className="bg-yellow-500/90 text-white text-xs font-medium rounded-full px-2.5 py-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      Trending
                    </span>
                  )}
                  {nft.isAuction && (
                    <span className="bg-pink-500/90 text-white text-xs font-medium rounded-full px-2.5 py-1">
                      Live Auction
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-amber-400 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span className="font-bold text-foreground">{nft.price}</span>
                  </div>
                </div>
                <button className="w-full mt-2 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-md text-sm transition-all duration-200 flex items-center justify-center">
                  <span>Place Bid</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => openModal(nft)}
                className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                aria-label="View details"
              >
                <ExternalLink className="w-5 h-5 text-white" />
              </button>
            </GlassCard>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-pagination mt-8 relative flex justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/20 swiper-pagination-bullet"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground/20 swiper-pagination-bullet"></div>
        <div className="w-2 h-2 rounded-full bg-muted-foreground/20 swiper-pagination-bullet"></div>
      </div>

      {/* NFT Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-accent/10 text-foreground hover:bg-accent/20 transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* NFT Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Creator
                      </span>
                    </div>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedNFT.name}</h2>
                    <p className="text-muted-foreground">{selectedNFT.collection}</p>
                  </div>
                  
                  {/* Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Contract</p>
                        <p className="text-sm font-medium text-foreground truncate" title="D3F1...a1b2">D3F1...a1b2</p>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Token ID</p>
                        <p className="text-sm font-medium text-foreground">#{selectedNFT.id}</p>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Standard</p>
                        <p className="text-sm font-medium text-foreground">SPL Token</p>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Blockchain</p>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L4 8l8 6 8-6-8-6zm0 20l-8-6V8l8 6 8-6v8l-8 6z" />
                          </svg>
                          <span className="text-sm font-medium text-foreground">Solana</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">Description</h3>
                    <p className="text-muted-foreground">
                      This is a rare and unique NFT from the {selectedNFT.collection} collection. 
                      Each piece is algorithmically generated and stored on the Solana blockchain.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="py-3 px-4 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Like
                    </button>
                    <button className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NFTCarousel;
