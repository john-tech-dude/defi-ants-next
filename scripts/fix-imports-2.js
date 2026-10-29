const fs = require('fs');
const path = require('path');

// List of files to update with their import fixes
const files = [
  // Button imports
  { 
    path: 'src/app/animations-demo/page.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/app/page.tsx',
    find: 'import { Button } from "@/components/ui/button";',
    replace: 'import Button from "@/components/ui/button";'
  },
  { 
    path: 'src/components/AnimatedTokenomics.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/BuyPanel.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/ErrorFallback.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/staking/StakingTab.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/StakingTab.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/StakingTabEnhanced.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/stripe/StripeCheckout.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/Swap.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/swap/IntegratedJupiterTerminal.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/swap/SlippageSettingsModal.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  { 
    path: 'src/components/swap/SwapInterface.tsx',
    find: 'import { Button } from "@/components/ui/button"',
    replace: 'import Button from "@/components/ui/button"'
  },
  
  // Other component imports
  { 
    path: 'src/components/staking/StakingTab.tsx',
    find: 'import { Input } from \'@/components/ui/input\'',
    replace: 'import Input from \'@/components/ui/input\''
  },
  { 
    path: 'src/components/staking/StakingTab.tsx',
    find: 'import { Label } from \'@/components/ui/label\'',
    replace: 'import Label from \'@/components/ui/label\''
  },
  { 
    path: 'src/components/staking/StakingTab.tsx',
    find: 'import { Progress } from \'@/components/ui/progress\'',
    replace: 'import Progress from \'@/components/ui/progress\''
  },
  { 
    path: 'src/components/StakingTab.tsx',
    find: 'import { Slider } from \'./ui/slider\'',
    replace: 'import Slider from \'./ui/slider\''
  }
];

// Update imports in each file
files.forEach(({ path: filePath, find, replace }) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes(find)) {
      content = content.replace(find, replace);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    } else {
      console.log(`Pattern not found in ${filePath}`);
    }
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Import updates complete!');
