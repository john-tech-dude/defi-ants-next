'use client'

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}

export default function AnimatedCounter({ value, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only run on client side
    setIsVisible(true);
    
    if (!isVisible) return;
    
    let start = 0;
    const end = value;
    const duration = 2000; // Animation duration in ms
    const increment = end / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, isVisible]);
  
  // Don't render anything during SSR or before the component is visible
  if (!isVisible) {
    return <span>0{suffix}</span>;
  }
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}
