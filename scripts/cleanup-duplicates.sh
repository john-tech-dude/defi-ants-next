#!/bin/bash

# Script to clean up duplicate files created during reorganization
# This script will remove duplicate files and directories

# Exit on error
set -e

# Define base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPONENTS_DIR="$BASE_DIR/src/components"

echo "Starting duplicate cleanup..."

# 1. Remove original Community directory (since we moved files to features/community)
echo "Cleaning up Community components..."
if [ -d "$COMPONENTS_DIR/Community" ]; then
  rm -rf "$COMPONENTS_DIR/Community"
  echo "Removed $COMPONENTS_DIR/Community directory"
fi

# 2. Remove original staking directory (since we moved files to features/staking)
echo "Cleaning up staking components..."
if [ -d "$COMPONENTS_DIR/staking" ]; then
  # First, check if there are any files in staking that weren't moved to features/staking
  # If there are, move them first
  mkdir -p "$COMPONENTS_DIR/features/staking/premium"
  if [ -d "$COMPONENTS_DIR/staking/PremiumStakingPanel" ]; then
    cp -r "$COMPONENTS_DIR/staking/PremiumStakingPanel"/* "$COMPONENTS_DIR/features/staking/premium/"
    echo "Moved PremiumStakingPanel contents to features/staking/premium"
  fi
  
  if [ -d "$COMPONENTS_DIR/staking/components" ]; then
    cp -r "$COMPONENTS_DIR/staking/components"/* "$COMPONENTS_DIR/features/staking/"
    echo "Moved staking components to features/staking"
  fi
  
  if [ -d "$COMPONENTS_DIR/staking/enhanced" ]; then
    cp -r "$COMPONENTS_DIR/staking/enhanced"/* "$COMPONENTS_DIR/features/staking/"
    echo "Moved enhanced staking components to features/staking"
  fi
  
  # Now remove the original directory
  rm -rf "$COMPONENTS_DIR/staking"
  echo "Removed $COMPONENTS_DIR/staking directory"
fi

# 3. Remove original swap directory (since we moved files to features/swap)
echo "Cleaning up swap components..."
if [ -d "$COMPONENTS_DIR/swap" ]; then
  # First, check if there are any files in swap that weren't moved to features/swap
  mkdir -p "$COMPONENTS_DIR/features/swap/jupiter"
  
  # Move any remaining swap components to features/swap
  find "$COMPONENTS_DIR/swap" -type f -name "*.tsx" | while read -r file; do
    filename=$(basename "$file")
    if [ ! -f "$COMPONENTS_DIR/features/swap/$filename" ]; then
      cp "$file" "$COMPONENTS_DIR/features/swap/"
      echo "Moved $filename to features/swap"
    fi
  done
  
  # Now remove the original directory
  rm -rf "$COMPONENTS_DIR/swap"
  echo "Removed $COMPONENTS_DIR/swap directory"
fi

# 4. Remove original wallet directory (since we moved files to features/wallet)
echo "Cleaning up wallet components..."
if [ -d "$COMPONENTS_DIR/wallet" ]; then
  # First, check if there are any files in wallet that weren't moved to features/wallet
  find "$COMPONENTS_DIR/wallet" -type f -name "*.tsx" | while read -r file; do
    filename=$(basename "$file")
    if [ ! -f "$COMPONENTS_DIR/features/wallet/$filename" ]; then
      cp "$file" "$COMPONENTS_DIR/features/wallet/"
      echo "Moved $filename to features/wallet"
    fi
  done
  
  # Now remove the original directory
  rm -rf "$COMPONENTS_DIR/wallet"
  echo "Removed $COMPONENTS_DIR/wallet directory"
fi

# 5. Remove duplicate files in the root components directory
echo "Cleaning up duplicate root components..."
# List of files we've moved to features directories
MOVED_FILES=(
  "NFTShowcase.tsx"
  "NFTGallery.tsx"
  "NFTCarousel.tsx"
  "AntNftCollection.tsx"
  "PremiumShowcase.tsx"
  "MemeGallery.tsx"
  "WalletConnectButton.tsx"
  "UnifiedWalletButton.tsx"
  "UnifiedWalletProvider.tsx"
  "CustomWalletModal.tsx"
  "StakingTab.tsx"
  "StakingTabEnhanced.tsx"
  "Tokenomics.tsx"
  "AnimatedTokenomics.tsx"
  "Swap.tsx"
  "BuyPanel.tsx"
  "HowToBuy.tsx"
  "Community.tsx"
  "AmbassadorSection.tsx"
  "NewsletterSection.tsx"
  "SocialLinkCard.tsx"
  "Newsletter.tsx"
  "NewsletterForm.tsx"
)

for file in "${MOVED_FILES[@]}"; do
  if [ -f "$COMPONENTS_DIR/$file" ]; then
    rm "$COMPONENTS_DIR/$file"
    echo "Removed duplicate file: $COMPONENTS_DIR/$file"
  fi
done

# 6. Update the index files to reflect the cleanup
echo "Updating index files..."

# Update the main features index file
cat > "$COMPONENTS_DIR/features/index.ts" << EOF
// Export all feature components
export * from './community';
export * from './nft';
export * from './staking';
export * from './wallet';
export * from './tokenomics';
export * from './swap';
EOF

echo "Duplicate cleanup complete!"
echo "Note: You may need to update import paths in your codebase."
