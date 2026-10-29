#!/bin/bash

# Script to organize the src directory
# This script will create directories and move files as needed

# Exit on error
set -e

# Define base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$BASE_DIR/src"

echo "Starting src directory organization..."

# 1. Create organized directories
echo "Creating directories..."
mkdir -p "$SRC_DIR/constants"
mkdir -p "$SRC_DIR/utils"
mkdir -p "$SRC_DIR/services"
mkdir -p "$SRC_DIR/hooks/wallet"
mkdir -p "$SRC_DIR/hooks/nft"
mkdir -p "$SRC_DIR/hooks/staking"
mkdir -p "$SRC_DIR/context"
mkdir -p "$SRC_DIR/types/wallet"
mkdir -p "$SRC_DIR/types/nft"
mkdir -p "$SRC_DIR/types/staking"
mkdir -p "$SRC_DIR/lib/api"

# 2. Create index files for better imports
echo "Creating index files..."

# Create index file for constants
cat > "$SRC_DIR/constants/index.ts" << EOF
// Export all constants from this directory
// Add your exports here as you create constant files
EOF

# Create index file for utils
cat > "$SRC_DIR/utils/index.ts" << EOF
// Export all utility functions from this directory
// Add your exports here as you create utility files
EOF

# Create index file for services
cat > "$SRC_DIR/services/index.ts" << EOF
// Export all services from this directory
// Add your exports here as you create service files
EOF

# Create index file for hooks
cat > "$SRC_DIR/hooks/index.ts" << EOF
// Export all hooks from this directory
export * from './wallet';
export * from './nft';
export * from './staking';
// Add other hook exports here
EOF

# Create index files for hook subdirectories
cat > "$SRC_DIR/hooks/wallet/index.ts" << EOF
// Export all wallet hooks from this directory
// Add your exports here as you create hook files
EOF

cat > "$SRC_DIR/hooks/nft/index.ts" << EOF
// Export all NFT hooks from this directory
// Add your exports here as you create hook files
EOF

cat > "$SRC_DIR/hooks/staking/index.ts" << EOF
// Export all staking hooks from this directory
// Add your exports here as you create hook files
EOF

# Create index file for context
cat > "$SRC_DIR/context/index.ts" << EOF
// Export all context providers from this directory
// Add your exports here as you create context files
EOF

# Create index file for types
cat > "$SRC_DIR/types/index.ts" << EOF
// Export all types from this directory
export * from './wallet';
export * from './nft';
export * from './staking';
// Add other type exports here
EOF

# Create index files for type subdirectories
cat > "$SRC_DIR/types/wallet/index.ts" << EOF
// Export all wallet types from this directory
// Add your exports here as you create type files
EOF

cat > "$SRC_DIR/types/nft/index.ts" << EOF
// Export all NFT types from this directory
// Add your exports here as you create type files
EOF

cat > "$SRC_DIR/types/staking/index.ts" << EOF
// Export all staking types from this directory
// Add your exports here as you create type files
EOF

# Create index file for lib
cat > "$SRC_DIR/lib/index.ts" << EOF
// Export all library functions from this directory
export * from './asset-paths';
export * from './api';
// Add other library exports here
EOF

# Create index file for lib/api
cat > "$SRC_DIR/lib/api/index.ts" << EOF
// Export all API functions from this directory
// Add your exports here as you create API files
EOF

echo "Src directory organization complete!"
