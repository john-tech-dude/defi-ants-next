          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <motion.button
            ref={navigationPrevRef}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
            aria-label="Previous step"
            whileHover={!isBeginning ? { scale: 1.1, x: -2 } : {}}
            whileTap={!isBeginning ? { scale: 0.95 } : {}}
            disabled={isBeginning}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            ref={navigationNextRef}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-primary-500/20 transition-colors duration-300 ${isEnd ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
            aria-label="Next step"
            whileHover={!isEnd ? { scale: 1.1, x: 2 } : {}}
            whileTap={!isEnd ? { scale: 0.95 } : {}}
            disabled={isEnd}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
          
          {/* Progress dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex % steps.length ? 'w-6 bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gray-600/50'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
