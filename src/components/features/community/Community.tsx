'use client';

import React, { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useClientContext } from '@/contexts/ClientContext';
import { Coins, Building, Bot, ArrowRight, Info, TrendingUp, Shield, Gem, Home, Leaf, Landmark, BarChart3, Scale, Rocket, Twitter, MessagesSquare, Send, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Tooltip info for each staking option
const STAKING_INFO = {
  multiTier: {
    tiers: [
      {
        name: 'Explorer',
        minStake: '1,000 ANT',
        apy: '8-12%',
        benefits: ['Basic governance rights', 'Standard staking rewards', 'Community access']
      },
      {
        name: 'Pioneer',
        minStake: '10,000 ANT',
        apy: '15-20%',
        benefits: ['Enhanced governance weight', 'Priority access to new features', 'Reduced platform fees']
      },
      {
        name: 'Visionary',
        minStake: '50,000 ANT',
        apy: '25-35%',
        benefits: ['Maximum governance power', 'Early access to all features', 'Zero platform fees', 'Exclusive investment opportunities']
      }
    ]
  },
  realWorldAssets: {
    assets: [
      {
        name: 'Tokenized Real Estate',
        apy: '8.2%',
        description: 'Fractional ownership in premium commercial and residential properties worldwide.'
      },
      {
        name: 'Digital Commodities',
        apy: '6.5%',
        description: 'Exposure to tokenized gold, silver, and other precious metals without custody concerns.'
      },
      {
        name: 'Carbon Credits',
        apy: '15.4%',
        description: 'Support environmental sustainability while earning returns from verified carbon offset projects.'
      },
      {
        name: 'Tokenized Treasury Bills',
        apy: '4.8%',
        description: 'Low-risk exposure to government securities with enhanced liquidity through tokenization.'
      }
    ]
  },
  aiStrategies: {
    strategies: [
      {
        name: 'Conservative',
        expected: '8-15%',
        risk: 'Low',
        description: 'Focus on capital preservation with stable yield-generating assets and minimal volatility.'
      },
      {
        name: 'Balanced',
        expected: '15-25%',
        risk: 'Medium',
        description: 'Diversified approach balancing growth opportunities with yield-generating assets.'
      },
      {
        name: 'Aggressive',
        expected: '25-45%',
        risk: 'High',
        description: 'Maximum growth potential with higher allocation to volatile assets and emerging opportunities.'
      },
      {
        name: 'AI-Optimized',
        expected: '20-60%',
        risk: 'Dynamic',
        description: 'Machine learning algorithms continuously rebalance your portfolio based on market conditions and risk parameters.'
      }
    ]
  }
};

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  buttonText?: string;
  onClick?: () => void;
  tooltipContent?: React.ReactNode;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, color, buttonText = "Learn More", onClick, tooltipContent }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Close tooltip when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsTooltipOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsTooltipOpen(!isTooltipOpen);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger the onClick if the click wasn't on the info button
    const target = e.target as HTMLElement;
    if (!target.closest('button[aria-label="More information"]')) {
      onClick?.();
    }
  };
  
  return (
    <div className="relative group" ref={cardRef}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15, 
          delay: Math.random() * 0.2 
        }}
        whileHover={{ 
          y: -8,
          boxShadow: isDark 
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05)",
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        className={`relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 cursor-pointer ${
          isDark 
            ? 'bg-gray-800 border-gray-700 hover:shadow-2xl hover:shadow-amber-500/10' 
            : 'bg-white border-gray-200 hover:shadow-xl'
        }`}
        onClick={handleCardClick}
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className={`flex items-center justify-center w-12 h-12 rounded-full ${color.includes('from-') ? '' : `bg-gradient-to-r ${color}`} shadow-lg`}
              style={color.includes('from-') ? {} : { background: color }}
            >
              {icon}
            </motion.div>
            
            {tooltipContent && (
              <button 
                onClick={handleInfoClick}
                className={`rounded-full p-1.5 transition-colors shadow-sm z-10 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                }`}
                aria-label="More information"
                aria-expanded={isTooltipOpen}
              >
                <Info className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={`text-sm mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {description}
          </p>
          
          <div 
            className="w-full flex items-center justify-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-300"
            style={{ 
              background: color.includes('from-') 
                ? `linear-gradient(to right, ${color.split(' ').filter(c => c.startsWith('from-') || c.startsWith('to-')).join(', ')})`
                : color
            }}
          >
            <span>{buttonText}</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {tooltipContent && (
        <div 
          className={`fixed md:absolute z-50 w-72 p-4 rounded-lg border shadow-lg transition-all duration-200 ${
            isTooltipOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          } ${
            isDark ? 'bg-gray-800 border-amber-800/50' : 'bg-white border-amber-200'
          }`}
          style={{
            top: cardRef.current ? `${cardRef.current.getBoundingClientRect().bottom + window.scrollY + 8}px` : 'auto',
            right: cardRef.current ? `calc(100% - ${cardRef.current.getBoundingClientRect().right}px)` : 'auto',
            left: cardRef.current ? 'auto' : '50%',
            transform: isTooltipOpen ? 'translateY(0)' : 'translateY(10px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

// Social links component
const SocialSection: FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const socialLinks = [
    {
      name: 'Twitter',
      description: 'Follow us for the latest updates and announcements',
      href: 'https://twitter.com/defiants',
      icon: <Twitter className="h-6 w-6" />,
      color: 'from-primary-400 to-primary-600',
    },
    {
      name: 'Discord',
      description: 'Join our community for discussions and support',
      href: 'https://discord.gg/defiants',
      icon: <MessagesSquare className="h-6 w-6" />,
      color: 'from-secondary-400 to-secondary-600',
    },
    {
      name: 'Telegram',
      description: 'Get instant notifications and chat with the team',
      href: 'https://t.me/defiants',
      icon: <Send className="h-6 w-6" />,
      color: 'from-primary-300 to-secondary-500',
    },
  ];

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          type: "spring",
          stiffness: 60,
          damping: 20
        }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-display tracking-wide gradient-text mb-4">
          Join Our Community
        </h2>
        <p className="text-lg text-gray-300">
          Connect with fellow ANTs, get support, and stay updated on the latest developments.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15, 
              delay: index * 0.15 
            }}
            whileHover={{ 
              y: -8, 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            className="group sticker-card cursor-pointer z-10"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${link.color}`}></div>
            <div className="flex flex-col items-center text-center w-full h-full">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${link.color} text-white shadow-lg pointer-events-none`}
              >
                {link.icon}
              </motion.div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{link.name}</h3>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{link.description}</p>
              <motion.span 
                className="mt-4 inline-flex items-center text-sm font-medium text-primary-400 group-hover:underline"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Join Now
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                >
                  <ArrowRight className="ml-1 h-4 w-4" />
                </motion.div>
              </motion.span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.2
          }}
          className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-800/30' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'} p-8 border border-dashed`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-amber-900/10 to-transparent' : 'from-amber-100/50 to-transparent'} opacity-60`}></div>
          <div className="text-center relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg"
            >
              <Users className="h-8 w-8" />
            </motion.div>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Become an ANT Ambassador
            </h3>
            <p className={`mb-8 max-w-2xl mx-auto text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Help us grow the DeFi ANT community and earn exclusive rewards by becoming an official ambassador. Spread the word, create content, and help onboard new users.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span>Apply Now</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Community: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { setIsBuyPanelOpen } = useClientContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a loading skeleton while mounting
  if (!mounted) {
    return (
      <section className="py-16 md:py-24 relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Create tooltip content components
  const multiTierTooltip = (
    <div className={`w-72 rounded-lg p-4 border shadow-lg ${
      isDark 
        ? 'bg-gray-800 border-amber-800/50' 
        : 'bg-white border-amber-200'
    }`}>
      <h4 className={`font-semibold mb-3 flex items-center ${
        isDark ? 'text-amber-400' : 'text-amber-600'
      }`}>
        <Gem className="h-4 w-4 mr-2" />
        Staking Tiers
      </h4>
      <ul className="space-y-3">
        {STAKING_INFO.multiTier.tiers.map((tier) => (
          <li key={tier.name} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{tier.name}</span>
              <span className="text-amber-600 font-semibold">{tier.apy} APY</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Min: {tier.minStake}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <Shield className="h-3 w-3 mr-1 text-amber-500" />
              {tier.benefits[0]}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const rwaTooltip = (
    <div className={`w-72 rounded-lg p-4 border shadow-lg ${
      isDark 
        ? 'bg-gray-800 border-primary-800/50' 
        : 'bg-white border-primary-200'
    }`}>
      <h4 className={`font-semibold mb-3 flex items-center ${
        isDark ? 'text-primary-400' : 'text-primary-600'
      }`}>
        <Building className="h-4 w-4 mr-2" />
        Real-World Assets
      </h4>
      <ul className="space-y-3">
        {STAKING_INFO.realWorldAssets.assets.map((asset) => (
          <li key={asset.name} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{asset.name}</span>
              <span className="text-primary-600 font-semibold">{asset.apy} APY</span>
            </div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">{asset.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );

  const aiTooltip = (
    <div className={`w-72 rounded-lg p-4 border shadow-lg ${
      isDark
        ? 'bg-gray-800 border-secondary-800/50'
        : 'bg-white border-secondary-200'
    }`}>
      <h4 className={`font-semibold mb-3 flex items-center ${
        isDark ? 'text-secondary-400' : 'text-secondary-600'
      }`}>
        <Bot className="h-4 w-4 mr-2" />
        AI Strategy Options
      </h4>
      <ul className="space-y-3">
        {STAKING_INFO.aiStrategies.strategies.map((strategy) => (
          <li key={strategy.name} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{strategy.name}</span>
              <span className="text-secondary-600 font-semibold">{strategy.expected}</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-gray-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-secondary-500" /> Risk: {strategy.risk}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={`py-16 md:py-24 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${
          isDark ? 'from-amber-500/5' : 'from-amber-400/10'
        } via-transparent to-transparent opacity-20`}></div>
        <div className={`absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center ${
          isDark ? 'opacity-[0.03]' : 'opacity-10'
        } [mask-image:linear-gradient(180deg,white,transparent)]`}></div>
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
          <h2 className="text-3xl md:text-4xl font-display tracking-wide gradient-text mb-4">
            DeFi ANT Staking Platform
          </h2>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our next-generation staking platform combines DeFi yields, real-world assets, and AI-optimized strategies for maximum returns.
          </p>
          <div className="mt-6">
            <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${
              isDark 
                ? 'bg-amber-900/30 text-amber-400 ring-amber-700/50' 
                : 'bg-amber-100 text-amber-800 ring-amber-200'
            }`}>
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
            onClick={() => setIsBuyPanelOpen(true)}
            tooltipContent={multiTierTooltip}
          />
          <FeatureCard 
            icon={<Building className="w-6 h-6 text-white" />}
            title="Real-World Assets"
            description="Access tokenized real estate, commodities, carbon credits, and more through our RWA farming pools."
            color="from-primary-500 to-primary-700"
            buttonText="Start Farming"
            onClick={() => setIsBuyPanelOpen(true)}
            tooltipContent={rwaTooltip}
          />
          <FeatureCard 
            icon={<Bot className="w-6 h-6 text-white" />}
            title="AI-Optimized Strategies"
            description="Our AI constantly analyzes market conditions to adjust your portfolio for optimal risk-adjusted returns."
            color="from-secondary-500 to-secondary-700"
            buttonText="Explore Strategies"
            onClick={() => setIsBuyPanelOpen(true)}
            tooltipContent={aiTooltip}
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-24"
        >
          <button
            onClick={() => setIsBuyPanelOpen(true)}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              isDark 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:opacity-90 shadow-lg shadow-amber-500/20'
            }`}
          >
            Join Staking Waitlist
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </motion.div>
        
        {/* Social Section */}
        <SocialSection />
      </div>
    </div>
  );
};

export default Community;