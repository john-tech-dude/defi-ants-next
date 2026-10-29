'use client';

import React, { FC, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useClientContext } from '@/contexts/ClientContext';
import { 
  Coins, Building, Bot, ArrowRight
} from 'lucide-react';

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  buttonText?: string;
  onClick?: () => void;
}

const FeatureCard: FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  color, 
  buttonText = "Learn More", 
  onClick 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${color} mb-4`}>
          {icon}
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
        <p className="text-gray-600 mb-6 flex-1">{description}</p>
        <button 
          type="button"
          className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${color} text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
          onClick={handleClick}
          aria-label={`${buttonText} for ${title}`}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const StakingPlatform: FC = () => {
  const { setIsBuyPanelOpen } = useClientContext();
  const router = useRouter();
  
  const handleNavigation = useCallback((path: string) => {
    try {
      if (path === 'buy') {
        setIsBuyPanelOpen(true);
      } else if (path.startsWith('http')) {
        window.open(path, '_blank', 'noopener,noreferrer');
      } else {
        router.push(path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router.push fails
      if (path !== 'buy') {
        window.location.href = path;
      }
    }
  }, [router, setIsBuyPanelOpen]);
  
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)]" />
      </div>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
            DeFi ANT Staking Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Our next-generation staking platform combines DeFi yields, real-world assets, and AI-optimized strategies for maximum returns.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center rounded-md bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-500 ring-1 ring-inset ring-amber-400/30">
              Coming Soon - Q3 2025
            </span>
          </div>
        </motion.div>

        {/* Main features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon={<Coins className="w-6 h-6 text-white" />}
            title="Multi-Tier Staking"
            description="Choose from Explorer, Pioneer, or Visionary tiers with increasing rewards and benefits based on your stake amount."
            color="from-amber-500 to-orange-600"
            buttonText="Stake Now"
            onClick={() => handleNavigation('/staking')}
          />
          <FeatureCard 
            icon={<Building className="w-6 h-6 text-white" />}
            title="Real-World Assets"
            description="Access tokenized real estate, commodities, carbon credits, and more through our RWA farming pools."
            color="from-blue-500 to-cyan-600"
            buttonText="Start Farming"
            onClick={() => handleNavigation('/farming')}
          />
          <FeatureCard 
            icon={<Bot className="w-6 h-6 text-white" />}
            title="AI-Optimized Strategies"
            description="Our AI constantly analyzes market conditions to adjust your portfolio for optimal risk-adjusted returns."
            color="from-purple-500 to-pink-600"
            buttonText="Explore Strategies"
            onClick={() => handleNavigation('/strategies')}
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <button
            type="button"
            onClick={() => handleNavigation('buy')}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:opacity-90 transition-opacity"
            aria-label="Join staking waitlist"
          >
            Join Staking Waitlist
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default StakingPlatform;
