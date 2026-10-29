'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

// Simple theme toggle component
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return (
      <button className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-500"></div>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center 
                 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}
