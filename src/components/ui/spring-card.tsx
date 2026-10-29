'use client';

import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '@/lib/utils';

interface SpringCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: 'flat' | 'raised' | 'floating';
  interactive?: boolean;
  glare?: boolean;
  borderGlow?: boolean;
  rotateEffect?: boolean;
}

export function SpringCard({
  children,
  className,
  depth = 'raised',
  interactive = true,
  glare = false,
  borderGlow = false,
  rotateEffect = true,
}: SpringCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Depth styles
  const depthStyles = {
    flat: {
      boxShadow: 'var(--shadow-sm)',
      y: 0,
    },
    raised: {
      boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      y: isHovered ? -4 : 0,
    },
    floating: {
      boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-lg)',
      y: isHovered ? -8 : -4,
    },
  };

  // Base spring animation
  const [springProps, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    y: depthStyles[depth].y,
    boxShadow: depthStyles[depth].boxShadow,
    borderColor: 'rgba(var(--border), 0.2)',
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  // Glare effect spring
  const [glareProps, glareApi] = useSpring(() => ({
    opacity: 0,
    x: '50%',
    y: '50%',
    config: { mass: 1, tension: 280, friction: 40 },
  }));

  // Mouse handlers for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (in -1 to 1 range)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Apply rotation effect
    if (rotateEffect) {
      api.start({
        rotateX: y * 10, // Rotate around X axis based on Y position
        rotateY: x * -10, // Rotate around Y axis based on X position
      });
    }
    
    // Apply glare effect
    if (glare) {
      glareApi.start({
        opacity: 0.15,
        x: `${(x + 0.5) * 100}%`,
        y: `${(y + 0.5) * 100}%`,
      });
    }
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    
    setIsHovered(true);
    
    api.start({
      scale: 1.02,
      y: depthStyles[depth].y,
      boxShadow: depthStyles[depth].boxShadow,
      borderColor: borderGlow ? 'rgba(var(--primary), 0.4)' : 'rgba(var(--border), 0.2)',
    });
    
    if (glare) {
      glareApi.start({
        opacity: 0.15,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    
    setIsHovered(false);
    
    api.start({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      y: depthStyles[depth].y,
      boxShadow: depthStyles[depth].boxShadow,
      borderColor: 'rgba(var(--border), 0.2)',
    });
    
    if (glare) {
      glareApi.start({
        opacity: 0,
      });
    }
  };

  return (
    <animated.div
      className={cn(
        'relative overflow-hidden rounded-lg bg-card border border-border p-6',
        className
      )}
      style={{
        ...springProps,
        transform: springProps.scale.to(s => 
          `perspective(1200px) rotateX(${springProps.rotateX}deg) rotateY(${springProps.rotateY}deg) scale(${s})`
        ),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {glare && (
        <animated.div
          className="absolute inset-0 pointer-events-none bg-gradient-radial from-white to-transparent rounded-lg"
          style={{
            opacity: glareProps.opacity,
            left: glareProps.x,
            top: glareProps.y,
            width: '150%',
            height: '150%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </animated.div>
  );
}
