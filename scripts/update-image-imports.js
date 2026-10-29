/**
 * This script helps identify and update image imports after reorganizing the public directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the base directory
const baseDir = path.resolve(__dirname, '..');

// Define image mappings (old path -> new path)
const imageMappings = {
  // Favicon and icons
  '/favicon.ico': '/icons/favicon.ico',
  '/favicon-16x16.png': '/icons/favicon-16x16.png',
  '/favicon-32x32.png': '/icons/favicon-32x32.png',
  '/favicon-192x192.png': '/icons/favicon-192x192.png',
  '/favicon-512x512.png': '/icons/favicon-512x512.png',
  '/android-chrome-192x192.png': '/icons/android-chrome-192x192.png',
  '/android-chrome-512x512.png': '/icons/android-chrome-512x512.png',
  
  // NFT images
  '/nft-1.png': '/images/nft/nft-1.png',
  '/nft-2.png': '/images/nft/nft-2.png',
  '/nft-3.png': '/images/nft/nft-3.png',
  
  // Logo images
  '/logo.png': '/images/logos/logo.png',
  '/eth-logo.png': '/images/logos/eth-logo.png',
  '/sol-logo.png': '/images/logos/sol-logo.png',
  
  // Tutorial images
  '/get-eth.png': '/images/tutorial/get-eth.png',
  '/get-sol.png': '/images/tutorial/get-sol.png',
  '/hodl.png': '/images/tutorial/hodl.png',
  '/swap-tokens.png': '/images/tutorial/swap-tokens.png',
  '/wallet-setup.png': '/images/tutorial/wallet-setup.png',
  
  // Community images
  '/community-ama.png': '/images/community/community-ama.png',
  '/community-governance.png': '/images/community/community-governance.png',
  '/community-rewards.png': '/images/community/community-rewards.png',
  
  // Placeholder and utility images
  '/placeholder.png': '/images/placeholder.png',
  '/noise.png': '/images/noise.png',
};

// Function to find files that need image path updates
function findFilesToUpdate() {
  console.log('Searching for files that need image path updates...');
  
  const filesToUpdate = new Map();
  
  // For each image mapping, search for references
  Object.entries(imageMappings).forEach(([oldPath, newPath]) => {
    try {
      // Use grep to find references to this image path
      const grepCommand = `grep -r "${oldPath}" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.css" ${baseDir}/src`;
      const result = execSync(grepCommand, { encoding: 'utf8' });
      
      // Process each line of the grep result
      result.split('\n').filter(Boolean).forEach(line => {
        const filePath = line.split(':')[0];
        if (!filesToUpdate.has(filePath)) {
          filesToUpdate.set(filePath, []);
        }
        
        filesToUpdate.get(filePath).push({
          oldPath,
          newPath
        });
      });
    } catch (error) {
      // Grep returns non-zero exit code if no matches found, which is fine
      if (error.status !== 1) {
        console.error(`Error searching for ${oldPath} references:`, error.message);
      }
    }
  });
  
  return filesToUpdate;
}

// Function to generate update instructions
function generateUpdateInstructions(filesToUpdate) {
  console.log('\n# Image Path Update Instructions\n');
  console.log('After reorganizing the public directory, update the following image paths:\n');
  
  filesToUpdate.forEach((updates, filePath) => {
    const relativePath = path.relative(baseDir, filePath);
    console.log(`## File: ${relativePath}\n`);
    
    updates.forEach(({ oldPath, newPath }) => {
      console.log(`- Change image path:`);
      console.log(`  - From: \`${oldPath}\``);
      console.log(`  - To: \`${newPath}\``);
      console.log('');
    });
    
    console.log('\n---\n');
  });
  
  console.log('## Automated Update Script\n');
  console.log('You can use the following commands to update image paths automatically:\n');
  console.log('```bash');
  
  filesToUpdate.forEach((updates, filePath) => {
    updates.forEach(({ oldPath, newPath }) => {
      console.log(`sed -i '' 's|${oldPath}|${newPath}|g' ${filePath}`);
    });
  });
  
  console.log('```');
}

// Main function
function main() {
  const filesToUpdate = findFilesToUpdate();
  
  if (filesToUpdate.size === 0) {
    console.log('No files found that need image path updates.');
    return;
  }
  
  generateUpdateInstructions(filesToUpdate);
}

// Run the script
main();
