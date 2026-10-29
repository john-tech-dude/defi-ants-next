  return (
    <section id="how-to-buy" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/10" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-center justify-center mb-12 md:mb-20 relative overflow-hidden text-center"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full mb-6 backdrop-blur-sm"
          >
            <motion.span 
              className="text-primary-500 font-bold flex items-center justify-center gap-2 text-sm md:text-base"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -5, 10, 0] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: 'reverse' 
                }}
              >
                💰
              </motion.span>
              Easy Purchase
              <motion.span
                animate={{ rotate: [0, -10, 5, -10, 0] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: 'reverse',
                  delay: 0.5
                }}
              >
                🚀
              </motion.span>
            </motion.span>
          </motion.div>
          
          <motion.div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              variants={titleVariants}
              className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300"
            >
              How to <span className="gradient-text">Buy ANT</span>
            </motion.h2>
          </motion.div>
          
          <motion.div className="inline-block overflow-hidden">
            <motion.p 
              variants={titleVariants}
              className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              Follow these simple steps to get your hands on ANT tokens and join the colony
            </motion.p>
          </motion.div>
          
          {/* Animated decorative elements */}
          <motion.div 
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary-500/10 blur-3xl -z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0, 0.3, 0],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
