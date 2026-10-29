const fs = require('fs');
const path = require('path');

// List of files to update with their import fixes
const files = [
  // StakingForm.tsx
  { 
    path: 'src/components/staking/components/StakingForm.tsx',
    changes: [
      { find: 'import { Button } from "@/components/ui/button"', replace: 'import Button from "@/components/ui/button"' },
      { find: 'import { Input } from \'@/components/ui/input\'', replace: 'import Input from \'@/components/ui/input\'' },
      { find: 'import { Label } from \'@/components/ui/label\'', replace: 'import Label from \'@/components/ui/label\'' }
    ]
  },
  // StakingStats.tsx
  { 
    path: 'src/components/staking/components/StakingStats.tsx',
    changes: [
      { find: 'import { Button } from "@/components/ui/button"', replace: 'import Button from "@/components/ui/button"' }
    ]
  },
  // StakingTiers.tsx
  { 
    path: 'src/components/staking/components/StakingTiers.tsx',
    changes: [
      { find: 'import { Button } from "@/components/ui/button"', replace: 'import Button from "@/components/ui/button"' }
    ]
  },
  // EnhancedStakingTab.tsx
  { 
    path: 'src/components/staking/enhanced/EnhancedStakingTab.tsx',
    changes: [
      { find: 'import { Button } from "@/components/ui/button"', replace: 'import Button from "@/components/ui/button"' }
    ]
  },
  // useStaking.ts
  { 
    path: 'src/components/staking/hooks/useStaking.ts',
    changes: [
      { find: 'import { useToast } from \'@/components/ui/use-toast\'', replace: 'import useToast from \'@/components/ui/use-toast\'' }
    ]
  }
];

// Update imports in each file
files.forEach(({ path: filePath, changes }) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;
    
    changes.forEach(({ find, replace }) => {
      if (content.includes(find)) {
        content = content.replace(find, replace);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    } else {
      console.log(`No changes needed in ${filePath}`);
    }
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Import updates complete!');
