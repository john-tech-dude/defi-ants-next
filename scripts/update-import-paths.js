/**
 * This script updates import paths in the codebase to reflect the new organization structure.
 * It handles the following types of updates:
 * 1. Component imports from reorganized directories
 * 2. Asset imports using the new asset path utility
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the base directory
const baseDir = path.resolve(__dirname, '..');
const srcDir = path.join(baseDir, 'src');

// Define component mappings (old import path -> new import path)
const componentMappings = {
  // Common components
  '@/components/ErrorBoundary': '@/components/common/ErrorBoundary',
  '@/components/ErrorFallback': '@/components/common/ErrorFallback',
  '@/components/FallbackImage': '@/components/common/FallbackImage',
  '@/components/ThemeToggle': '@/components/common/ThemeToggle',
  '@/components/Toaster': '@/components/common/Toaster',
  '@/components/DevFallback': '@/components/common/DevFallback',
  
  // Layout components
  '@/components/Navbar': '@/components/layout/Navbar',
  '@/components/Footer': '@/components/layout/Footer',
  '@/components/BottomNavbar': '@/components/layout/BottomNavbar',
  '@/components/Hero': '@/components/layout/Hero',
  '@/components/HeroAuroraBackground': '@/components/layout/HeroAuroraBackground',
  '@/components/BackgroundEffects': '@/components/layout/BackgroundEffects',
  
  // Community components
  '@/components/Community': '@/components/features/community/Community',
  '@/components/AmbassadorSection': '@/components/features/community/AmbassadorSection',
  '@/components/NewsletterSection': '@/components/features/community/NewsletterSection',
  '@/components/SocialLinkCard': '@/components/features/community/SocialLinkCard',
  '@/components/SocialLinks': '@/components/features/community/SocialLinks',
  '@/components/Newsletter': '@/components/features/community/Newsletter',
  '@/components/NewsletterForm': '@/components/features/community/NewsletterForm',
  '@/components/Community/': '@/components/features/community/',
  
  // NFT components
  '@/components/NFTShowcase': '@/components/features/nft/NFTShowcase',
  '@/components/NFTGallery': '@/components/features/nft/NFTGallery',
  '@/components/NFTCarousel': '@/components/features/nft/NFTCarousel',
  '@/components/AntNftCollection': '@/components/features/nft/AntNftCollection',
  '@/components/PremiumShowcase': '@/components/features/nft/PremiumShowcase',
  '@/components/MemeGallery': '@/components/features/nft/MemeGallery',
  
  // Staking components
  '@/components/StakingTab': '@/components/features/staking/StakingTab',
  '@/components/StakingTabEnhanced': '@/components/features/staking/StakingTabEnhanced',
  '@/components/staking/': '@/components/features/staking/',
  
  // Wallet components
  '@/components/WalletConnectButton': '@/components/features/wallet/WalletConnectButton',
  '@/components/UnifiedWalletButton': '@/components/features/wallet/UnifiedWalletButton',
  '@/components/UnifiedWalletProvider': '@/components/features/wallet/UnifiedWalletProvider',
  '@/components/CustomWalletModal': '@/components/features/wallet/CustomWalletModal',
  '@/components/wallet/': '@/components/features/wallet/',
  
  // Tokenomics components
  '@/components/Tokenomics': '@/components/features/tokenomics/Tokenomics',
  '@/components/AnimatedTokenomics': '@/components/features/tokenomics/AnimatedTokenomics',
  
  // Swap components
  '@/components/Swap': '@/components/features/swap/Swap',
  '@/components/BuyPanel': '@/components/features/swap/BuyPanel',
  '@/components/HowToBuy': '@/components/features/swap/HowToBuy',
  '@/components/swap/': '@/components/features/swap/',
};

// Define relative path mappings (for non-alias imports)
const relativePathMappings = {
  // Common components
  '../ErrorBoundary': '../common/ErrorBoundary',
  '../ErrorFallback': '../common/ErrorFallback',
  '../FallbackImage': '../common/FallbackImage',
  '../ThemeToggle': '../common/ThemeToggle',
  '../Toaster': '../common/Toaster',
  '../DevFallback': '../common/DevFallback',
  
  // Layout components
  '../Navbar': '../layout/Navbar',
  '../Footer': '../layout/Footer',
  '../BottomNavbar': '../layout/BottomNavbar',
  '../Hero': '../layout/Hero',
  '../HeroAuroraBackground': '../layout/HeroAuroraBackground',
  '../BackgroundEffects': '../layout/BackgroundEffects',
  
  // Community components
  '../Community': '../features/community/Community',
  '../AmbassadorSection': '../features/community/AmbassadorSection',
  '../NewsletterSection': '../features/community/NewsletterSection',
  '../SocialLinkCard': '../features/community/SocialLinkCard',
  '../SocialLinks': '../features/community/SocialLinks',
  '../Newsletter': '../features/community/Newsletter',
  '../NewsletterForm': '../features/community/NewsletterForm',
  
  // NFT components
  '../NFTShowcase': '../features/nft/NFTShowcase',
  '../NFTGallery': '../features/nft/NFTGallery',
  '../NFTCarousel': '../features/nft/NFTCarousel',
  '../AntNftCollection': '../features/nft/AntNftCollection',
  '../PremiumShowcase': '../features/nft/PremiumShowcase',
  '../MemeGallery': '../features/nft/MemeGallery',
  
  // Staking components
  '../StakingTab': '../features/staking/StakingTab',
  '../StakingTabEnhanced': '../features/staking/StakingTabEnhanced',
  
  // Wallet components
  '../WalletConnectButton': '../features/wallet/WalletConnectButton',
  '../UnifiedWalletButton': '../features/wallet/UnifiedWalletButton',
  '../UnifiedWalletProvider': '../features/wallet/UnifiedWalletProvider',
  '../CustomWalletModal': '../features/wallet/CustomWalletModal',
  
  // Tokenomics components
  '../Tokenomics': '../features/tokenomics/Tokenomics',
  '../AnimatedTokenomics': '../features/tokenomics/AnimatedTokenomics',
  
  // Swap components
  '../Swap': '../features/swap/Swap',
  '../BuyPanel': '../features/swap/BuyPanel',
  '../HowToBuy': '../features/swap/HowToBuy',
};

// Define asset path mappings for the new asset utility
const assetPathMappings = [
  {
    pattern: /['"]\/icons\/([^'"]+)['"]/g,
    replacement: "getIconPath('$1')",
    import: "import { getIconPath } from '@/lib/asset-paths';"
  },
  {
    pattern: /['"]\/images\/nft\/([^'"]+)['"]/g,
    replacement: "getNftImagePath('$1')",
    import: "import { getNftImagePath } from '@/lib/asset-paths';"
  },
  {
    pattern: /['"]\/images\/logos\/([^'"]+)['"]/g,
    replacement: "getLogoPath('$1')",
    import: "import { getLogoPath } from '@/lib/asset-paths';"
  },
  {
    pattern: /['"]\/images\/tutorial\/([^'"]+)['"]/g,
    replacement: "getTutorialImagePath('$1')",
    import: "import { getTutorialImagePath } from '@/lib/asset-paths';"
  },
  {
    pattern: /['"]\/images\/community\/([^'"]+)['"]/g,
    replacement: "getCommunityImagePath('$1')",
    import: "import { getCommunityImagePath } from '@/lib/asset-paths';"
  },
  {
    pattern: /['"]\/videos\/([^'"]+)['"]/g,
    replacement: "getVideoPath('$1')",
    import: "import { getVideoPath } from '@/lib/asset-paths';"
  },
  {
    pattern: /['"]\/memes\/([^'"]+)['"]/g,
    replacement: "getMemePath('$1')",
    import: "import { getMemePath } from '@/lib/asset-paths';"
  },
  {
    pattern: /['"]\/images\/([^'"]+)['"]/g,
    replacement: "getImagePath('$1')",
    import: "import { getImagePath } from '@/lib/asset-paths';"
  }
];

// Function to find all TypeScript and TSX files in the src directory
function findTsFiles() {
  try {
    // Use a more direct approach with fs to avoid shell escaping issues
    const getAllFiles = (dir) => {
      const files = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          // Skip node_modules and .next directories
          if (item.name !== 'node_modules' && item.name !== '.next') {
            files.push(...getAllFiles(fullPath));
          }
        } else if (item.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
      
      return files;
    };
    
    return getAllFiles(srcDir);
  } catch (error) {
    console.error('Error finding TypeScript files:', error.message);
    return [];
  }
}

// Function to update component imports in a file
function updateComponentImports(filePath, fileContent) {
  let updatedContent = fileContent;
  let hasChanges = false;
  
  // Update alias imports
  Object.entries(componentMappings).forEach(([oldPath, newPath]) => {
    const regex = new RegExp(`from ['"]${oldPath}['"]`, 'g');
    if (regex.test(updatedContent)) {
      updatedContent = updatedContent.replace(regex, `from '${newPath}'`);
      hasChanges = true;
    }
  });
  
  // Update relative imports
  Object.entries(relativePathMappings).forEach(([oldPath, newPath]) => {
    const regex = new RegExp(`from ['"]${oldPath}['"]`, 'g');
    if (regex.test(updatedContent)) {
      updatedContent = updatedContent.replace(regex, `from '${newPath}'`);
      hasChanges = true;
    }
  });
  
  return { content: updatedContent, hasChanges };
}

// Function to update asset imports in a file
function updateAssetImports(filePath, fileContent) {
  let updatedContent = fileContent;
  let hasChanges = false;
  const importsToAdd = new Set();
  
  assetPathMappings.forEach(({ pattern, replacement, import: importStatement }) => {
    if (pattern.test(updatedContent)) {
      updatedContent = updatedContent.replace(pattern, replacement);
      importsToAdd.add(importStatement);
      hasChanges = true;
    }
    // Reset the regex lastIndex
    pattern.lastIndex = 0;
  });
  
  // Add the necessary imports if changes were made
  if (importsToAdd.size > 0) {
    // Find a good place to add the imports
    const importSection = updatedContent.match(/^import.*from.*;(\r?\n|$)*/m);
    if (importSection) {
      const importSectionEnd = importSection.index + importSection[0].length;
      updatedContent = 
        updatedContent.slice(0, importSectionEnd) + 
        Array.from(importsToAdd).join('\n') + '\n' + 
        updatedContent.slice(importSectionEnd);
    } else {
      // If no import section found, add at the beginning of the file
      updatedContent = Array.from(importsToAdd).join('\n') + '\n' + updatedContent;
    }
  }
  
  return { content: updatedContent, hasChanges };
}

// Function to update a file
function updateFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Update component imports
    const { content: contentWithComponentUpdates, hasChanges: hasComponentChanges } = 
      updateComponentImports(filePath, fileContent);
    
    // Update asset imports
    const { content: finalContent, hasChanges: hasAssetChanges } = 
      updateAssetImports(filePath, contentWithComponentUpdates);
    
    // Write the file if changes were made
    if (hasComponentChanges || hasAssetChanges) {
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`Updated imports in: ${path.relative(baseDir, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('Starting import path updates...');
  
  // Find all TypeScript and TSX files
  const tsFiles = findTsFiles();
  console.log(`Found ${tsFiles.length} TypeScript files to process.`);
  
  // Update each file
  let updatedCount = 0;
  tsFiles.forEach(filePath => {
    const updated = updateFile(filePath);
    if (updated) {
      updatedCount++;
    }
  });
  
  console.log(`\nImport path updates complete!`);
  console.log(`Updated ${updatedCount} files out of ${tsFiles.length} total files.`);
  
  if (updatedCount > 0) {
    console.log('\nNote: You may need to restart your development server for changes to take effect.');
  }
}

// Run the script
main();
