'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialCardProps {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const SocialCard: React.FC<SocialCardProps> = ({
  name,
  description,
  href,
  icon,
  color,
  index
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1
      }}
      whileHover={{ y: -5 }}
      className={cn(
        "block relative overflow-hidden rounded-xl border",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg",
        isDark 
          ? "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:shadow-gray-900/30" 
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-gray-200/50"
      )}
    >
      {/* Gradient top bar */}
      <div 
        className={`h-1.5 w-full bg-gradient-to-r ${color}`}
        aria-hidden="true"
      />

      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div 
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white shadow-md`}
            aria-hidden="true"
          >
            {icon}
          </div>

          {/* Content */}
          <h3 className={cn(
            "text-lg font-semibold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {name}
          </h3>
          <p className={cn(
            "mb-4 text-sm",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            {description}
          </p>

          {/* Join Now button */}
          <motion.span 
            className={cn(
              "inline-flex items-center text-sm font-medium",
              isDark ? "text-blue-400" : "text-blue-600"
            )}
            whileHover={{ x: 3 }}
          >
            Join Now
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
              className="ml-1"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
};

export default SocialCard;
