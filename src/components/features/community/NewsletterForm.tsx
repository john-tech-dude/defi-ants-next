'use client';

import { motion } from 'framer-motion';

export const NewsletterForm = () => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.6 }
      }
    }}
    className="mt-24 text-center"
  >
    <motion.h3 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="text-2xl font-bold mb-6 gradient-text inline-block"
    >
      Subscribe to Our Newsletter
    </motion.h3>
    <motion.p 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { delay: 0.1 } }
      }}
      className="text-muted-foreground mb-8 max-w-2xl mx-auto"
    >
      Stay updated with our latest developments, token news, and exclusive community offers
    </motion.p>
    
    <motion.form 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { delay: 0.2 } }
      }}
      className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
      }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-full bg-white/5 border-2 border-primary-500/30 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all duration-200"
        required
      />
      <button
        type="submit"
        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center group"
      >
        Subscribe
      </button>
    </motion.form>
  </motion.div>
);
