  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      // No need to update state here as we're using responsive classes
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle slide change and update navigation state
  const updateNavigationState = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
    hover: {
      y: -5,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 12
      }
    }
  };
  
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: createTransition(0.8, [0.25, 0.1, 0.25, 1] as const)
    }
  };
  
  const stepCardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    }),
    hover: {
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        y: { 
          type: 'spring', 
          stiffness: 300, 
          damping: 15 
        },
        boxShadow: { 
          duration: 0.3 
        }
      }
    }
  };
