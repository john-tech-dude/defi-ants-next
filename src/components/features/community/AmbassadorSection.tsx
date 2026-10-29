'use client';

import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';

export const AmbassadorSection = () => {
  console.log('Rendering AmbassadorSection');
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500/10 to-accent-500/5 p-8 mt-16 border border-dashed border-gray-300 dark:border-gray-700">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-lg">
          <Users className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold mb-4">
          Become an ANT Ambassador
        </h3>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-base">
          Help us grow the DeFi ANT! community and earn exclusive rewards by becoming an official ambassador. Spread the word, create content, and help onboard new users.
        </p>
        <a
          href="/ambassador-program"
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <span>Apply Now</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
      
      {/* Debug info */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
        <p className="font-medium">Debug Info:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Component: AmbassadorSection</li>
          <li>Status: Loaded successfully</li>
          <li>Motion animations disabled for debugging</li>
        </ul>
      </div>
    </div>
  );
};
