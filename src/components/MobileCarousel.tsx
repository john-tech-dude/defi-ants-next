'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface SocialLink {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface MobileCarouselProps {
  socialLinks: SocialLink[];
  swiperRef: React.RefObject<any>;
}

export const MobileCarousel = ({ socialLinks, swiperRef }: MobileCarouselProps) => (
  <motion.div 
    className="md:hidden relative mt-12" 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <div className="relative">
      <Swiper
        ref={swiperRef}
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
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full py-8 px-4"
      >
        {socialLinks.map((link, index) => (
          <SwiperSlide key={`mobile-${index}`} className="!h-auto">
            <motion.a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full p-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`h-full bg-gradient-to-br ${link.color} rounded-2xl p-6 text-white shadow-lg`}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    {link.icon}
                  </div>
                  <h3 className="text-xl font-bold">{link.name}</h3>
                  <p className="mt-2 text-sm opacity-90">{link.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium">
                    {link.label}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.a>
          </SwiperSlide>
        ))}
      </Swiper>
      <button 
        onClick={() => swiperRef.current?.swiper.slidePrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 -ml-4"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => swiperRef.current?.swiper.slideNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 -mr-4"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </motion.div>
);
