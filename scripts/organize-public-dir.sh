#!/bin/bash

# Script to organize the public directory
# This script will create directories and move files as needed

# Exit on error
set -e

# Define base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_DIR="$BASE_DIR/public"

echo "Starting public directory organization..."

# 1. Create organized directories
echo "Creating directories..."
mkdir -p "$PUBLIC_DIR/icons"
mkdir -p "$PUBLIC_DIR/images/nft"
mkdir -p "$PUBLIC_DIR/images/logos"
mkdir -p "$PUBLIC_DIR/images/tutorial"
mkdir -p "$PUBLIC_DIR/images/community"

# 2. Move favicon and icon files
echo "Moving favicon and icon files..."
[ -f "$PUBLIC_DIR/favicon.ico" ] && mv "$PUBLIC_DIR/favicon.ico" "$PUBLIC_DIR/icons/"
[ -f "$PUBLIC_DIR/favicon-16x16.png" ] && mv "$PUBLIC_DIR/favicon-16x16.png" "$PUBLIC_DIR/icons/"
[ -f "$PUBLIC_DIR/favicon-32x32.png" ] && mv "$PUBLIC_DIR/favicon-32x32.png" "$PUBLIC_DIR/icons/"
[ -f "$PUBLIC_DIR/favicon-192x192.png" ] && mv "$PUBLIC_DIR/favicon-192x192.png" "$PUBLIC_DIR/icons/"
[ -f "$PUBLIC_DIR/favicon-512x512.png" ] && mv "$PUBLIC_DIR/favicon-512x512.png" "$PUBLIC_DIR/icons/"
[ -f "$PUBLIC_DIR/android-chrome-192x192.png" ] && mv "$PUBLIC_DIR/android-chrome-192x192.png" "$PUBLIC_DIR/icons/"
[ -f "$PUBLIC_DIR/android-chrome-512x512.png" ] && mv "$PUBLIC_DIR/android-chrome-512x512.png" "$PUBLIC_DIR/icons/"
[ -f "$PUBLIC_DIR/site.webmanifest" ] && mv "$PUBLIC_DIR/site.webmanifest" "$PUBLIC_DIR/icons/"

# 3. Move NFT images
echo "Moving NFT images..."
[ -f "$PUBLIC_DIR/nft-1.png" ] && mv "$PUBLIC_DIR/nft-1.png" "$PUBLIC_DIR/images/nft/"
[ -f "$PUBLIC_DIR/nft-2.png" ] && mv "$PUBLIC_DIR/nft-2.png" "$PUBLIC_DIR/images/nft/"
[ -f "$PUBLIC_DIR/nft-3.png" ] && mv "$PUBLIC_DIR/nft-3.png" "$PUBLIC_DIR/images/nft/"

# 4. Move logo images
echo "Moving logo images..."
[ -f "$PUBLIC_DIR/logo.png" ] && mv "$PUBLIC_DIR/logo.png" "$PUBLIC_DIR/images/logos/"
[ -f "$PUBLIC_DIR/eth-logo.png" ] && mv "$PUBLIC_DIR/eth-logo.png" "$PUBLIC_DIR/images/logos/"
[ -f "$PUBLIC_DIR/sol-logo.png" ] && mv "$PUBLIC_DIR/sol-logo.png" "$PUBLIC_DIR/images/logos/"

# 5. Move tutorial images
echo "Moving tutorial images..."
[ -f "$PUBLIC_DIR/get-eth.png" ] && mv "$PUBLIC_DIR/get-eth.png" "$PUBLIC_DIR/images/tutorial/"
[ -f "$PUBLIC_DIR/get-sol.png" ] && mv "$PUBLIC_DIR/get-sol.png" "$PUBLIC_DIR/images/tutorial/"
[ -f "$PUBLIC_DIR/hodl.png" ] && mv "$PUBLIC_DIR/hodl.png" "$PUBLIC_DIR/images/tutorial/"
[ -f "$PUBLIC_DIR/swap-tokens.png" ] && mv "$PUBLIC_DIR/swap-tokens.png" "$PUBLIC_DIR/images/tutorial/"
[ -f "$PUBLIC_DIR/wallet-setup.png" ] && mv "$PUBLIC_DIR/wallet-setup.png" "$PUBLIC_DIR/images/tutorial/"

# 6. Move community images
echo "Moving community images..."
[ -f "$PUBLIC_DIR/community-ama.png" ] && mv "$PUBLIC_DIR/community-ama.png" "$PUBLIC_DIR/images/community/"
[ -f "$PUBLIC_DIR/community-governance.png" ] && mv "$PUBLIC_DIR/community-governance.png" "$PUBLIC_DIR/images/community/"
[ -f "$PUBLIC_DIR/community-rewards.png" ] && mv "$PUBLIC_DIR/community-rewards.png" "$PUBLIC_DIR/images/community/"

# 7. Move placeholder and utility images
echo "Moving placeholder and utility images..."
[ -f "$PUBLIC_DIR/placeholder.png" ] && mv "$PUBLIC_DIR/placeholder.png" "$PUBLIC_DIR/images/"
[ -f "$PUBLIC_DIR/noise.png" ] && mv "$PUBLIC_DIR/noise.png" "$PUBLIC_DIR/images/"

echo "Public directory organization complete!"
