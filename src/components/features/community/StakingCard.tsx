'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StakingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  buttonText: string;
  onClick: () => void;
  tooltipContent?: React.ReactNode;
}

const StakingCard: React.FC<StakingCardProps> = ({
  icon,
  title,
  description,
  color,
  buttonText,
  onClick,
  tooltipContent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        cardRef.current &&
        !cardRef.current.querySelector('[data-info-button]')?.contains(event.target as Node)
      ) {
        setIsTooltipOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close tooltip
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTooltipOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleCardClick = () => {
    onClick();
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTooltipOpen(!isTooltipOpen);
  };

  return (
    <div className="relative" ref={cardRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
        className={cn(
          "relative overflow-hidden rounded-xl border cursor-pointer",
          "transition-all duration-300 ease-out",
          "hover:shadow-lg",
          isDark 
            ? "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:shadow-gray-900/30" 
            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-gray-200/50"
        )}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`Select ${title} option`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* Gradient top bar */}
        <div 
          className={`h-1.5 w-full bg-gradient-to-r ${color}`}
          aria-hidden="true"
        />

        <div className="p-6">
          {/* Icon with gradient background */}
          <div 
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white shadow-md`}
            aria-hidden="true"
          >
            {icon}
          </div>

          {/* Content */}
          <h3 className={cn(
            "text-xl font-semibold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {title}
          </h3>
          <p className={cn(
            "mb-6 text-sm",
            isDark ? "text-gray-300" : "text-gray-600"
          )}>
            {description}
          </p>

          {/* Button */}
          <div className="flex items-center">
            <span className={cn(
              "text-sm font-medium flex items-center",
              `text-gradient-${color.split(' ')[1]}`
            )}>
              {buttonText}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
              >
                <ArrowRight className="h-4 w-4 ml-1" />
              </motion.div>
            </span>
          </div>
        </div>

        {/* Info button */}
        {tooltipContent && (
          <button
            className={cn(
              "absolute top-3 right-3 p-1.5 rounded-full",
              "transition-colors duration-200",
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            )}
            onClick={handleInfoClick}
            aria-label="More information"
            data-info-button
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
        )}
      </motion.div>

      {/* Tooltip */}
      {tooltipContent && (
        <div 
          ref={tooltipRef}
          className={cn(
            "absolute z-50 w-72 rounded-lg shadow-xl",
            "transition-all duration-200 ease-in-out",
            isTooltipOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          )}
          style={{
            top: "calc(100% + 10px)",
            right: 0,
            transform: isTooltipOpen ? "translateY(0)" : "translateY(-10px)",
          }}
          onClick={(e) => e.stopPropagation()}
          role="tooltip"
          aria-hidden={!isTooltipOpen}
        >
          <div className="p-4">
            {tooltipContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingCard;
