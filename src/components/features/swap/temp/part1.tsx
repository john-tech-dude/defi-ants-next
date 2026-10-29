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

  // State for mobile carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
