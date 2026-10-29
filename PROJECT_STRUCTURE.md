# Project Structure Organization

This document outlines the recommended organization for the Defi ANTS NEXT project.

## Directory Structure

```
/
├── .next/                  # Next.js build output (generated)
├── node_modules/           # Dependencies (generated)
├── public/                 # Static assets
│   ├── assets/             # General assets
│   ├── images/             # Image files
│   ├── memes/              # Meme images
│   ├── videos/             # Video files
│   └── vision/             # Vision-related assets
├── scripts/                # Utility scripts
├── src/                    # Source code
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   │   ├── common/         # Common components used across features
│   │   ├── features/       # Feature-specific components
│   │   │   ├── community/  # Community-related components
│   │   │   ├── nft/        # NFT-related components
│   │   │   ├── staking/    # Staking-related components
│   │   │   └── wallet/     # Wallet-related components
│   │   ├── layout/         # Layout components (navbar, footer, etc.)
│   │   └── ui/             # UI primitives and design system
│   ├── config/             # Configuration files
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   ├── providers/          # React context providers
│   ├── styles/             # Global styles
│   ├── theme/              # Theme configuration
│   └── types/              # TypeScript type definitions
├── .env.local              # Environment variables (not in git)
├── .env.local.example      # Example environment variables
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Component Organization

Components should be organized as follows:

1. **UI Components** (`/src/components/ui/`)
   - Basic, reusable UI primitives (buttons, inputs, cards, etc.)
   - Should be framework-agnostic when possible

2. **Common Components** (`/src/components/common/`)
   - Reusable components that may use UI components but are not tied to specific features
   - Examples: ErrorBoundary, FallbackImage, ThemeToggle

3. **Feature Components** (`/src/components/features/`)
   - Components specific to a feature area
   - Organized by feature domain (nft, staking, wallet, etc.)

4. **Layout Components** (`/src/components/layout/`)
   - Components that define the application layout
   - Examples: Navbar, Footer, BottomNavbar, Sidebar

## Best Practices

1. **Component Naming**:
   - Use PascalCase for component files and function names
   - Be descriptive and avoid abbreviations

2. **File Organization**:
   - Group related files together
   - Create index.ts files for cleaner imports

3. **Code Splitting**:
   - Split large components into smaller, focused components
   - Use dynamic imports for code splitting when appropriate

4. **Type Definitions**:
   - Keep shared types in `/src/types/`
   - Co-locate component-specific types with their components

5. **Styling**:
   - Use Tailwind CSS for styling
   - Keep global styles in `/src/styles/`
   - Component-specific styles should be co-located with components
