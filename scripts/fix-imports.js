const fs = require('fs');
const path = require('path');

// List of files to update
const files = [
  'src/app/page.tsx',
  'src/components/About.tsx',
  'src/components/AnimatedTokenomics.tsx',
  'src/components/AntNftCollection.tsx',
  'src/components/BuyPanel.tsx',
  'src/components/CustomWalletModal.tsx',
  'src/components/DevFallback.tsx',
  'src/components/ErrorBoundary.tsx',
  'src/components/ErrorFallback.tsx',
  'src/components/Hero.tsx',
  'src/components/MemeGallery.tsx',
  'src/components/StakingTab.tsx',
  'src/components/StakingTabEnhanced.tsx',
  'src/components/StakingTab.tsx',
  'src/components/swap/SlippageSettings.tsx',
  'src/components/swap/SlippageSettingsModal.tsx',
  'src/components/swap/SwapInterface.tsx',
  'src/components/swap/TokenInput.tsx',
  'src/components/theme/theme-button.tsx',
  'src/app/animations-demo/page.tsx',
  'src/components/Swap.tsx',
  'src/components/staking/StakingTab.tsx',
  'src/components/staking/components/StakingForm.tsx',
  'src/components/staking/components/StakingStats.tsx',
  'src/components/staking/components/StakingTiers.tsx',
  'src/components/staking/enhanced/EnhancedStakingTab.tsx',
  'src/components/stripe/StripeCheckout.tsx',
  'src/components/swap/IntegratedJupiterTerminal.tsx'
];

// Update imports in each file
files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Update import statements
    content = content.replace(
      /import\s+{\s*Button\s*}\s+from\s+['"]@\/components\/ui\/Button['"]/g,
      'import { Button } from "@/components/ui/button"'
    );
    
    content = content.replace(
      /import\s+Button\s+from\s+['"](?:\.\.?\/)*ui\/Button['"]/g,
      'import { Button } from "@/components/ui/button"'
    );
    
    content = content.replace(
      /import\s+Button\s+from\s+['"]@\/components\/ui\/Button['"]/g,
      'import { Button } from "@/components/ui/button"'
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Import updates complete!');
