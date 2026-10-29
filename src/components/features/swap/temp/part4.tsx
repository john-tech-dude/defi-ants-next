        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={`desktop-${index}`}
              custom={index}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              variants={stepCardVariants}
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
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
              {/* Animated background effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              {/* Animated border effect */}
              <motion.div 
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-500/30"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mb-5 mx-auto relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {step.icon}
                <motion.div 
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2, opacity: 0.5 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-foreground to-foreground/80 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {step.title}
              </h3>
              <p className="text-muted-foreground mb-5 text-center text-sm leading-relaxed">
                {step.description}
              </p>
              <motion.div className="relative z-10 mt-4">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
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
                  className="block relative z-10 w-full text-center px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                  <motion.span 
                    className="relative z-10 flex items-center justify-center gap-2"
                    whileHover={{ x: 2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {step.cta}
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 4, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "loop",
                        duration: 2,
                        ease: "easeInOut"
                      }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </motion.span>
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
