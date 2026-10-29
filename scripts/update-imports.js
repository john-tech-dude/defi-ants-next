/**
 * This script helps update import statements after reorganizing components.
 * It will search through files and suggest replacements for import paths.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the base directory
const baseDir = path.resolve(__dirname, '..');

// Define component mappings (old path -> new path)
const componentMappings = {
  // Common components
  'components/ErrorBoundary': 'components/common/ErrorBoundary',
  'components/ErrorFallback': 'components/common/ErrorFallback',
  'components/FallbackImage': 'components/common/FallbackImage',
  'components/ThemeToggle': 'components/common/ThemeToggle',
  'components/Toaster': 'components/common/Toaster',
  'components/DevFallback': 'components/common/DevFallback',
  
  // Layout components
  'components/Navbar': 'components/layout/Navbar',
  'components/Footer': 'components/layout/Footer',
  'components/BottomNavbar': 'components/layout/BottomNavbar',
  'components/Hero': 'components/layout/Hero',
  'components/HeroAuroraBackground': 'components/layout/HeroAuroraBackground',
  'components/BackgroundEffects': 'components/layout/BackgroundEffects',
  
  // Community components
  'components/Community': 'components/features/community/Community',
  'components/AmbassadorSection': 'components/features/community/AmbassadorSection',
  'components/NewsletterSection': 'components/features/community/NewsletterSection',
  'components/SocialLinkCard': 'components/features/community/SocialLinkCard',
  'components/SocialLinks': 'components/features/community/SocialLinks',
  'components/Newsletter': 'components/features/community/Newsletter',
  'components/NewsletterForm': 'components/features/community/NewsletterForm',
  
  // NFT components
  'components/NFTShowcase': 'components/features/nft/NFTShowcase',
  'components/NFTGallery': 'components/features/nft/NFTGallery',
  'components/NFTCarousel': 'components/features/nft/NFTCarousel',
  'components/AntNftCollection': 'components/features/nft/AntNftCollection',
  'components/PremiumShowcase': 'components/features/nft/PremiumShowcase',
  'components/MemeGallery': 'components/features/nft/MemeGallery',
  
  // Staking components
  'components/StakingTab': 'components/features/staking/StakingTab',
  'components/StakingTabEnhanced': 'components/features/staking/StakingTabEnhanced',
  
  // Wallet components
  'components/WalletConnectButton': 'components/features/wallet/WalletConnectButton',
  'components/UnifiedWalletButton': 'components/features/wallet/UnifiedWalletButton',
  'components/UnifiedWalletProvider': 'components/features/wallet/UnifiedWalletProvider',
  'components/CustomWalletModal': 'components/features/wallet/CustomWalletModal',
  
  // Tokenomics components
  'components/Tokenomics': 'components/features/tokenomics/Tokenomics',
  'components/AnimatedTokenomics': 'components/features/tokenomics/AnimatedTokenomics',
  
  // Swap components
  'components/Swap': 'components/features/swap/Swap',
  'components/BuyPanel': 'components/features/swap/BuyPanel',
  'components/HowToBuy': 'components/features/swap/HowToBuy',
};

// Function to find files that need import updates
function findFilesToUpdate() {
  console.log('Searching for files that need import updates...');
  
  const filesToUpdate = new Map();
  
  // For each component mapping, search for import statements
  Object.entries(componentMappings).forEach(([oldPath, newPath]) => {
    const componentName = oldPath.split('/').pop();
    
    try {
      // Use grep to find import statements for this component
      const grepCommand = `grep -r "import.*${componentName}.*from.*${oldPath}" --include="*.tsx" --include="*.ts" ${baseDir}/src`;
      const result = execSync(grepCommand, { encoding: 'utf8' });
      
      // Process each line of the grep result
      result.split('\n').filter(Boolean).forEach(line => {
        const filePath = line.split(':')[0];
        if (!filesToUpdate.has(filePath)) {
          filesToUpdate.set(filePath, []);
        }
        
        filesToUpdate.get(filePath).push({
          component: componentName,
          oldPath,
          newPath
        });
      });
    } catch (error) {
      // Grep returns non-zero exit code if no matches found, which is fine
      if (error.status !== 1) {
        console.error(`Error searching for ${componentName} imports:`, error.message);
      }
    }
  });
  
  return filesToUpdate;
}

// Function to generate update instructions
function generateUpdateInstructions(filesToUpdate) {
  console.log('\n# Import Update Instructions\n');
  console.log('After reorganizing components, update the following import statements:\n');
  
  filesToUpdate.forEach((updates, filePath) => {
    const relativePath = path.relative(baseDir, filePath);
    console.log(`## File: ${relativePath}\n`);
    
    updates.forEach(({ component, oldPath, newPath }) => {
      console.log(`- Change import for \`${component}\`:`);
      console.log(`  - From: \`import { ${component} } from "../${oldPath}";\``);
      console.log(`  - To: \`import { ${component} } from "../${newPath}";\``);
      console.log('');
    });
    
    console.log('Or use the new index exports:');
    
    // Group updates by their new directory
    const groupedByDir = updates.reduce((acc, { component, newPath }) => {
      const dir = newPath.split('/').slice(0, -1).join('/');
      if (!acc[dir]) acc[dir] = [];
      acc[dir].push(component);
      return acc;
    }, {});
    
    Object.entries(groupedByDir).forEach(([dir, components]) => {
      console.log(`- For components from \`${dir}\`:`);
      console.log(`  \`import { ${components.join(', ')} } from "../${dir}";\``);
    });
    
    console.log('\n---\n');
  });
  
  console.log('## Automated Update Script\n');
  console.log('You can use the following commands to update imports automatically:\n');
  console.log('```bash');
  
  filesToUpdate.forEach((updates, filePath) => {
    updates.forEach(({ oldPath, newPath }) => {
      console.log(`sed -i '' 's|from ".*${oldPath}"|from "../${newPath}"|g' ${filePath}`);
    });
  });
  
  console.log('```');
}

// Main function
function main() {
  const filesToUpdate = findFilesToUpdate();
  
  if (filesToUpdate.size === 0) {
    console.log('No files found that need import updates.');
    return;
  }
  
  generateUpdateInstructions(filesToUpdate);
}

// Run the script
main();
