import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { magneticButton, springBouncy, springSmooth } from '@/lib/animations';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  shine?: boolean;
  glow?: boolean;
}

export default function AnimatedButton({
  variant = 'default',
  size = 'default',
  children,
  className = '',
  shine = false,
  glow = false,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      {...magneticButton}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={springBouncy}
    >
      <Button
        variant={variant}
        size={size}
        className={`relative overflow-hidden ${className} ${glow ? 'shadow-lg hover:shadow-2xl' : ''}`}
        {...props}
      >
        {shine && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
}
