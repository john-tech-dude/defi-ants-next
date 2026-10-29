        </div>

        {/* Mobile Carousel - Visible only on mobile */}
        <motion.div 
          className="md:hidden relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
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
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            loop={true}
            ref={swiperRef}
            className="w-full py-4 px-2"
            initialSlide={activeIndex}
            onSlideChange={updateNavigationState}
            onSwiper={(swiper) => {
              // Explicitly set navigation elements
              if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;
              }
              swiper.navigation.init();
              swiper.navigation.update();
              updateNavigationState(swiper);
            }}
            breakpoints={{
              320: {
                slidesPerView: 1.1,
                spaceBetween: 16,
              },
              375: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              425: {
                slidesPerView: 1.3,
                spaceBetween: 24,
              },
            }}
          >
            {steps.map((step, index) => (
              <SwiperSlide key={`mobile-${index}`} className="!h-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg flex flex-col cursor-pointer"
                  onClick={() => {
                    if (step.link === '#connect-wallet') {
                      setIsBuyPanelOpen(true);
                    } else if (step.link === '#swap') {
                      setIsBuyPanelOpen(true);
                    } else if (step.link === '#stake') {
                      // Handle staking action
                    } else {
                      window.open(step.link, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (step.link === '#connect-wallet') {
                        setIsBuyPanelOpen(true);
                      } else if (step.link === '#swap') {
                        setIsBuyPanelOpen(true);
                      } else if (step.link === '#stake') {
                        // Handle staking action
                      } else {
                        window.open(step.link, '_blank', 'noopener,noreferrer');
                      }
                    }
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mb-5 mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-5 text-center text-sm flex-grow">
                    {step.description}
                  </p>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (step.link === '#connect-wallet') {
                        setIsBuyPanelOpen(true);
                      } else if (step.link === '#swap') {
                        setIsBuyPanelOpen(true);
                      } else if (step.link === '#stake') {
                        // Handle staking action
                      } else {
                        window.open(step.link, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {step.cta}
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                </motion.div>
              </SwiperSlide>
            ))}
