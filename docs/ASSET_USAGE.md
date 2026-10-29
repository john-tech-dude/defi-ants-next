# Asset Usage Guide

This guide explains how to use assets in the Defi ANTS NEXT project after the reorganization of the public directory.

## Directory Structure

The public directory has been reorganized as follows:

```
/public
├── icons/               # Favicon and icon files
├── images/              # General images
│   ├── community/       # Community-related images
│   ├── logos/           # Logo images
│   ├── nft/             # NFT images
│   ├── tutorial/        # Tutorial and guide images
│   ├── placeholder.png  # Placeholder image
│   └── noise.png        # Noise texture
├── memes/               # Meme images
└── videos/              # Video files
```

## Using the Asset Path Utility

We've created a utility to help access assets with the new directory structure. Import it as follows:

```typescript
import assetPaths from '@/lib/asset-paths';
// or import specific functions
import { getIconPath, getNftImagePath } from '@/lib/asset-paths';
```

### Available Functions

- `getAssetPath(category, filename)`: Get the path to any asset by category and filename
- `getIconPath(filename)`: Get the path to an icon
- `getImagePath(filename)`: Get the path to a general image
- `getNftImagePath(filename)`: Get the path to an NFT image
- `getLogoPath(filename)`: Get the path to a logo image
- `getTutorialImagePath(filename)`: Get the path to a tutorial image
- `getCommunityImagePath(filename)`: Get the path to a community image
- `getVideoPath(filename)`: Get the path to a video
- `getMemePath(filename)`: Get the path to a meme image

### Examples

```typescript
// In a React component
import Image from 'next/image';
import { getNftImagePath, getLogoPath } from '@/lib/asset-paths';

function MyComponent() {
  return (
    <div>
      <Image 
        src={getNftImagePath('nft-1.png')} 
        alt="NFT #1" 
        width={200} 
        height={200} 
      />
      
      <Image 
        src={getLogoPath('logo.png')} 
        alt="Logo" 
        width={100} 
        height={100} 
      />
    </div>
  );
}
```

## Updating Existing Code

If you have existing code that references assets directly, you should update it to use the asset path utility. For example:

```typescript
// Before
<Image src="/logo.png" alt="Logo" width={100} height={100} />

// After
import { getLogoPath } from '@/lib/asset-paths';
<Image src={getLogoPath('logo.png')} alt="Logo" width={100} height={100} />
```

This ensures that your code will continue to work with the reorganized directory structure.

## Adding New Assets

When adding new assets to the project:

1. Place them in the appropriate directory based on their type
2. Use the asset path utility to reference them in your code

This helps maintain a clean and organized project structure.
