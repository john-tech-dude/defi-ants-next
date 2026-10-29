'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Jupiter: any;
  }
}

export default function JupiterTerminalScript() {
  useEffect(() => {
    // Load Jupiter Terminal script
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main.v2.js';
    script.async = true;
    script.onload = () => {
      console.log('Jupiter Terminal script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Jupiter Terminal script');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}
