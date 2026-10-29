'use client'

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  PieChart as PieChartIcon, 
  Zap, 
  BarChart2, 
  Coins, 
  Shield, 
  Users
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Interfaces
interface TokenAllocationProps {
  name: string;
  percentage: number;
  color: string;
  gradient: string;
  delay?: number;
  isActive?: boolean;
  onClick?: () => void;
  description?: string;
}

interface TokenUtilityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
  onLearnMore?: () => void;
}

interface TokenData {
  id: string;
  name: string;
  value: number;
  color: string;
  gradient: string;
  description: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number = 1) => ({
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
      delayChildren: 0.1 * i,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  })
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
      mass: 0.5
    }
  }),
  hover: {
    y: -2,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20
    }
  }
} as const;

const TokenAllocation: React.FC<TokenAllocationProps> = ({
  name,
  percentage,
  color,
  gradient,
  delay = 0,
  isActive = false,
  onClick,
  description
}) => {
  return (
    <motion.div
      className={`p-4 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-background/80 backdrop-blur-sm border border-border shadow-lg scale-[1.02]' 
          : 'bg-background/50 hover:bg-background/70 border border-transparent hover:border-border/50'
      }`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={delay}
      onClick={onClick}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-foreground/90">{name}</span>
        <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {percentage}%
        </span>
      </div>
      <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full shadow-sm`}
          style={{ 
            width: `${percentage}%`, 
            background: `linear-gradient(90deg, ${gradient})`,
            boxShadow: `0 0 10px ${color}40`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1, 
            delay: 0.2 + (delay || 0),
            type: 'spring',
            damping: 15,
            stiffness: 100
          }}
        />
      </div>
      {isActive && description && (
        <motion.div
          className="mt-3 pt-3 border-t border-border/30"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

const TokenUtilityCard: React.FC<TokenUtilityCardProps> = ({
  icon,
  title,
  description,
  gradient,
  delay = 0,
  onLearnMore
}) => {
  return (
    <motion.div
      className="h-full p-6 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden relative"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={{
        y: -5,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4"
          style={{ background: `linear-gradient(135deg, ${gradient})` }}
        >
          {icon}
        </div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {onLearnMore && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore();
            }}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center group"
            aria-label={`Learn more about ${title}`}
          >
            Learn More
            <svg
              className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10"
        style={{ background: `linear-gradient(135deg, ${gradient})` }}
      />
    </motion.div>
  );
};

const Tokenomics: React.FC = () => {
  const controls = useAnimation();
  const [activeSection, setActiveSection] = useState('liquidity');
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const tokenData: TokenData[] = [
    {
      id: 'liquidity',
      name: 'Liquidity',
      value: 30,
      color: '#3b82f6',
      gradient: '#3b82f6, #06b6d4',
      description: 'Ensures smooth trading and price stability across all supported exchanges.'
    },
    {
      id: 'team',
      name: 'Team & Advisors',
      value: 20,
      color: '#a855f7',
      gradient: '#a855f7, #d946ef',
      description: 'Vested over 3 years to align long-term interests with the project\'s success.'
    },
    {
      id: 'ecosystem',
      name: 'Ecosystem',
      value: 25,
      color: '#10b981',
      gradient: '#10b981, #34d399',
      description: 'Funds allocated for development, partnerships, and growth initiatives.'
    },
    {
      id: 'staking',
      name: 'Staking Rewards',
      value: 15,
      color: '#f59e0b',
      gradient: '#f59e0b, #fbbf24',
      description: 'Distributed to users who stake their tokens to secure the network.'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      value: 10,
      color: '#ef4444',
      gradient: '#ef4444, #f87171',
      description: 'Dedicated to community growth, awareness campaigns, and user acquisition.'
    }
  ];

  const router = useRouter();

  const handleLearnMore = (section: string) => {
    const sectionMap: { [key: string]: string } = {
      'Staking Rewards': '/staking',
      'Governance': '/governance',
      'Fee Discounts': '/fees',
      'Exclusive Access': '/access',
      'Community Benefits': '/community'
    };
    
    const path = sectionMap[section] || '/';
    router.push(path);
  };

  const utilityCards: TokenUtilityCardProps[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Staking Rewards',
      description: 'Earn up to 25% APY by staking your tokens and securing the network.',
      gradient: '#9333ea, #3b82f6',
      onLearnMore: () => handleLearnMore('Staking Rewards')
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: 'Governance',
      description: 'Vote on key protocol decisions and help shape the future of the platform.',
      gradient: '#3b82f6, #06b6d4',
      onLearnMore: () => handleLearnMore('Governance')
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: 'Fee Discounts',
      description: 'Get reduced trading and transaction fees when paying with our native token.',
      gradient: '#10b981, #34d399',
      onLearnMore: () => handleLearnMore('Fee Discounts')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Exclusive Access',
      description: 'Early access to new features, products, and investment opportunities.',
      gradient: '#f59e0b, #fbbf24',
      onLearnMore: () => handleLearnMore('Exclusive Access')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Benefits',
      description: 'Participate in exclusive community events and earn special rewards.',
      gradient: '#ef4444, #f87171',
      onLearnMore: () => handleLearnMore('Community Benefits')
    }
  ];

  const activeToken = tokenData.find(token => token.id === activeSection) || tokenData[0];

  return (
    <section id="tokenomics" ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            variants={itemVariants}
          >
            Tokenomics
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Our token distribution is designed to ensure long-term sustainability and growth of the ecosystem.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-6">Token Allocation</h3>
              <div className="space-y-3">
              {tokenData.map((token, index) => (
                <TokenAllocation
                  key={token.id}
                  name={token.name}
                  percentage={token.value}
                  color={token.color}
                  gradient={token.gradient}
                  delay={index * 0.05}
                  isActive={activeSection === token.id}
                  onClick={() => setActiveSection(token.id)}
                  description={token.description}
                />
              ))}
              <div className="pt-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Click on any allocation to learn more
                </p>
              </div>
            </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8">
              <h3 className="text-2xl font-semibold mb-6">Token Utility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {utilityCards.map((card, index) => (
                  <TokenUtilityCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    gradient={card.gradient}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="sticky top-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Token Distribution</h3>
                <div className="flex items-center space-x-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{activeToken.name}</span>
                </div>
              </div>
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }: { name: string; percent: number }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {tokenData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient-${index})`}
                          stroke="transparent"
                          className="cursor-pointer"
                          onClick={() => setActiveSection(entry.id)}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${props.payload.name}: ${value}%`,
                        ''
                      ]}
                    />
                    <Legend />
                    <defs>
                      {tokenData.map((entry, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={`gradient-${index}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor={entry.gradient.split(',')[0].trim()} />
                          <stop 
                            offset="100%" 
                            stopColor={entry.gradient.split(',')[1]?.trim() || entry.gradient.split(',')[0].trim()} 
                          />
                        </linearGradient>
                      ))}
                    </defs>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-medium">Total Supply: 1,000,000,000</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
