#!/bin/bash

# Script to reorganize components according to the recommended structure
# This script will create directories and move files as needed

# Exit on error
set -e

# Define base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPONENTS_DIR="$BASE_DIR/src/components"

echo "Starting component reorganization..."

# 1. Create new directories
echo "Creating directories..."
mkdir -p "$COMPONENTS_DIR/common"
mkdir -p "$COMPONENTS_DIR/layout"
mkdir -p "$COMPONENTS_DIR/features/community"
mkdir -p "$COMPONENTS_DIR/features/nft"
mkdir -p "$COMPONENTS_DIR/features/staking"
mkdir -p "$COMPONENTS_DIR/features/wallet"
mkdir -p "$COMPONENTS_DIR/features/tokenomics"
mkdir -p "$COMPONENTS_DIR/features/swap"

# 2. Move common components
echo "Moving common components..."
[ -f "$COMPONENTS_DIR/ErrorBoundary.tsx" ] && mv "$COMPONENTS_DIR/ErrorBoundary.tsx" "$COMPONENTS_DIR/common/"
[ -f "$COMPONENTS_DIR/ErrorFallback.tsx" ] && mv "$COMPONENTS_DIR/ErrorFallback.tsx" "$COMPONENTS_DIR/common/"
[ -f "$COMPONENTS_DIR/FallbackImage.tsx" ] && mv "$COMPONENTS_DIR/FallbackImage.tsx" "$COMPONENTS_DIR/common/"
[ -f "$COMPONENTS_DIR/ThemeToggle.tsx" ] && mv "$COMPONENTS_DIR/ThemeToggle.tsx" "$COMPONENTS_DIR/common/"
[ -f "$COMPONENTS_DIR/Toaster.tsx" ] && mv "$COMPONENTS_DIR/Toaster.tsx" "$COMPONENTS_DIR/common/"
[ -f "$COMPONENTS_DIR/DevFallback.tsx" ] && mv "$COMPONENTS_DIR/DevFallback.tsx" "$COMPONENTS_DIR/common/"

# 3. Move layout components
echo "Moving layout components..."
[ -f "$COMPONENTS_DIR/Navbar.tsx" ] && mv "$COMPONENTS_DIR/Navbar.tsx" "$COMPONENTS_DIR/layout/"
[ -f "$COMPONENTS_DIR/Footer.tsx" ] && mv "$COMPONENTS_DIR/Footer.tsx" "$COMPONENTS_DIR/layout/"
[ -f "$COMPONENTS_DIR/BottomNavbar.tsx" ] && mv "$COMPONENTS_DIR/BottomNavbar.tsx" "$COMPONENTS_DIR/layout/"
[ -f "$COMPONENTS_DIR/Hero.tsx" ] && mv "$COMPONENTS_DIR/Hero.tsx" "$COMPONENTS_DIR/layout/"
[ -f "$COMPONENTS_DIR/HeroAuroraBackground.tsx" ] && mv "$COMPONENTS_DIR/HeroAuroraBackground.tsx" "$COMPONENTS_DIR/layout/"
[ -f "$COMPONENTS_DIR/BackgroundEffects.tsx" ] && mv "$COMPONENTS_DIR/BackgroundEffects.tsx" "$COMPONENTS_DIR/layout/"

# 4. Move feature components
# Community
echo "Moving community components..."
[ -f "$COMPONENTS_DIR/Community.tsx" ] && mv "$COMPONENTS_DIR/Community.tsx" "$COMPONENTS_DIR/features/community/"
[ -f "$COMPONENTS_DIR/AmbassadorSection.tsx" ] && mv "$COMPONENTS_DIR/AmbassadorSection.tsx" "$COMPONENTS_DIR/features/community/"
[ -f "$COMPONENTS_DIR/NewsletterSection.tsx" ] && mv "$COMPONENTS_DIR/NewsletterSection.tsx" "$COMPONENTS_DIR/features/community/"
[ -f "$COMPONENTS_DIR/SocialLinkCard.tsx" ] && mv "$COMPONENTS_DIR/SocialLinkCard.tsx" "$COMPONENTS_DIR/features/community/"
[ -f "$COMPONENTS_DIR/SocialLinks.tsx" ] && mv "$COMPONENTS_DIR/SocialLinks.tsx" "$COMPONENTS_DIR/features/community/"
[ -f "$COMPONENTS_DIR/Newsletter.tsx" ] && mv "$COMPONENTS_DIR/Newsletter.tsx" "$COMPONENTS_DIR/features/community/"
[ -f "$COMPONENTS_DIR/NewsletterForm.tsx" ] && mv "$COMPONENTS_DIR/NewsletterForm.tsx" "$COMPONENTS_DIR/features/community/"

# NFT
echo "Moving NFT components..."
[ -f "$COMPONENTS_DIR/NFTShowcase.tsx" ] && mv "$COMPONENTS_DIR/NFTShowcase.tsx" "$COMPONENTS_DIR/features/nft/"
[ -f "$COMPONENTS_DIR/NFTGallery.tsx" ] && mv "$COMPONENTS_DIR/NFTGallery.tsx" "$COMPONENTS_DIR/features/nft/"
[ -f "$COMPONENTS_DIR/NFTCarousel.tsx" ] && mv "$COMPONENTS_DIR/NFTCarousel.tsx" "$COMPONENTS_DIR/features/nft/"
[ -f "$COMPONENTS_DIR/AntNftCollection.tsx" ] && mv "$COMPONENTS_DIR/AntNftCollection.tsx" "$COMPONENTS_DIR/features/nft/"
[ -f "$COMPONENTS_DIR/PremiumShowcase.tsx" ] && mv "$COMPONENTS_DIR/PremiumShowcase.tsx" "$COMPONENTS_DIR/features/nft/"
[ -f "$COMPONENTS_DIR/MemeGallery.tsx" ] && mv "$COMPONENTS_DIR/MemeGallery.tsx" "$COMPONENTS_DIR/features/nft/"

# Staking
echo "Moving staking components..."
[ -f "$COMPONENTS_DIR/StakingTab.tsx" ] && mv "$COMPONENTS_DIR/StakingTab.tsx" "$COMPONENTS_DIR/features/staking/"
[ -f "$COMPONENTS_DIR/StakingTabEnhanced.tsx" ] && mv "$COMPONENTS_DIR/StakingTabEnhanced.tsx" "$COMPONENTS_DIR/features/staking/"
[ -f "$COMPONENTS_DIR/StakingTab.css" ] && mv "$COMPONENTS_DIR/StakingTab.css" "$COMPONENTS_DIR/features/staking/"

# Wallet
echo "Moving wallet components..."
[ -f "$COMPONENTS_DIR/WalletConnectButton.tsx" ] && mv "$COMPONENTS_DIR/WalletConnectButton.tsx" "$COMPONENTS_DIR/features/wallet/"
[ -f "$COMPONENTS_DIR/UnifiedWalletButton.tsx" ] && mv "$COMPONENTS_DIR/UnifiedWalletButton.tsx" "$COMPONENTS_DIR/features/wallet/"
[ -f "$COMPONENTS_DIR/UnifiedWalletProvider.tsx" ] && mv "$COMPONENTS_DIR/UnifiedWalletProvider.tsx" "$COMPONENTS_DIR/features/wallet/"
[ -f "$COMPONENTS_DIR/CustomWalletModal.tsx" ] && mv "$COMPONENTS_DIR/CustomWalletModal.tsx" "$COMPONENTS_DIR/features/wallet/"

# Tokenomics
echo "Moving tokenomics components..."
[ -f "$COMPONENTS_DIR/Tokenomics.tsx" ] && mv "$COMPONENTS_DIR/Tokenomics.tsx" "$COMPONENTS_DIR/features/tokenomics/"
[ -f "$COMPONENTS_DIR/AnimatedTokenomics.tsx" ] && mv "$COMPONENTS_DIR/AnimatedTokenomics.tsx" "$COMPONENTS_DIR/features/tokenomics/"

# Swap
echo "Moving swap components..."
[ -f "$COMPONENTS_DIR/Swap.tsx" ] && mv "$COMPONENTS_DIR/Swap.tsx" "$COMPONENTS_DIR/features/swap/"
[ -f "$COMPONENTS_DIR/BuyPanel.tsx" ] && mv "$COMPONENTS_DIR/BuyPanel.tsx" "$COMPONENTS_DIR/features/swap/"
[ -f "$COMPONENTS_DIR/HowToBuy.tsx" ] && mv "$COMPONENTS_DIR/HowToBuy.tsx" "$COMPONENTS_DIR/features/swap/"

# 5. Create index files
echo "Creating index files..."

# Common index
cat > "$COMPONENTS_DIR/common/index.ts" << EOF
export * from './ErrorBoundary';
export * from './ErrorFallback';
export * from './FallbackImage';
export * from './ThemeToggle';
export * from './Toaster';
export * from './DevFallback';
EOF

# Layout index
cat > "$COMPONENTS_DIR/layout/index.ts" << EOF
export * from './Navbar';
export * from './Footer';
export * from './BottomNavbar';
export * from './Hero';
export * from './HeroAuroraBackground';
export * from './BackgroundEffects';
EOF

# Feature indexes
cat > "$COMPONENTS_DIR/features/community/index.ts" << EOF
export * from './Community';
export * from './AmbassadorSection';
export * from './NewsletterSection';
export * from './SocialLinkCard';
export * from './SocialLinks';
export * from './Newsletter';
export * from './NewsletterForm';
EOF

cat > "$COMPONENTS_DIR/features/nft/index.ts" << EOF
export * from './NFTShowcase';
export * from './NFTGallery';
export * from './NFTCarousel';
export * from './AntNftCollection';
export * from './PremiumShowcase';
export * from './MemeGallery';
EOF

cat > "$COMPONENTS_DIR/features/staking/index.ts" << EOF
export * from './StakingTab';
export * from './StakingTabEnhanced';
// CSS file doesn't need to be exported
EOF

cat > "$COMPONENTS_DIR/features/wallet/index.ts" << EOF
export * from './WalletConnectButton';
export * from './UnifiedWalletButton';
export * from './UnifiedWalletProvider';
export * from './CustomWalletModal';
EOF

cat > "$COMPONENTS_DIR/features/tokenomics/index.ts" << EOF
export * from './Tokenomics';
export * from './AnimatedTokenomics';
EOF

cat > "$COMPONENTS_DIR/features/swap/index.ts" << EOF
export * from './Swap';
export * from './BuyPanel';
export * from './HowToBuy';
EOF

# Main features index
cat > "$COMPONENTS_DIR/features/index.ts" << EOF
export * from './community';
export * from './nft';
export * from './staking';
export * from './wallet';
export * from './tokenomics';
export * from './swap';
EOF

# Main components index
cat > "$COMPONENTS_DIR/index.ts" << EOF
export * from './common';
export * from './layout';
export * from './features';
export * from './ui';
EOF

echo "Component reorganization complete!"
echo "Note: You may need to update import paths in your codebase."
