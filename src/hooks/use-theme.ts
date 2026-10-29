'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isMounted, setIsMounted] = useState(false);

  // Get the system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Get the current theme, falling back to system preference
  const getCurrentTheme = (): 'light' | 'dark' => {
    if (typeof localStorage === 'undefined') return getSystemTheme();
    
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme === 'system' || !storedTheme) {
      return getSystemTheme();
    }
    
    return storedTheme === 'dark' ? 'dark' : 'light';
  };

  // Apply the theme class to the document
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Apply the appropriate theme class
    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
    }
  };

  // Set the theme and save to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    setThemeState(storedTheme || 'system');
    setIsMounted(true);
    
    // Apply the stored theme or system preference
    applyTheme(storedTheme || 'system');
    
    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return {
    theme,
    setTheme,
    isMounted,
    resolvedTheme: isMounted ? getCurrentTheme() : 'light',
  };
}
