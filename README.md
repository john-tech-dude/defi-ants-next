# Defi ANTS NEXT

A decentralized finance application built with Next.js and Solana wallet integration.

## Features

- Solana wallet integration with multiple wallet adapters
- NFT showcase functionality
- Modern UI components with Radix UI and Tailwind CSS
- Responsive design

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Copy `.env.local.example` to `.env.local` and fill in the required values

### Development

```bash
npm run dev
# or
yarn dev
```

### Build

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

## Project Structure

- `/src`: Main source code
  - `/app`: Next.js App Router pages and layouts
  - `/components`: Reusable UI components
  - `/config`: Configuration files
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and libraries
  - `/providers`: React context providers
  - `/styles`: Global styles
  - `/theme`: Theme configuration
  - `/types`: TypeScript type definitions
- `/public`: Static assets
- `/pages`: Next.js Pages Router (if used alongside App Router)
- `/scripts`: Utility scripts

## Technologies

- Next.js
- React
- TypeScript
- Solana Web3.js
- Tailwind CSS
- Radix UI
- GSAP for animations
