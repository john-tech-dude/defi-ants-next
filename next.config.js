/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to prevent double rendering with wallet extensions
  reactStrictMode: false,
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  // Disable ETag generation to prevent caching issues
  generateEtags: false,
  // Enable compression for better performance
  compress: true,
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'],
  // Configure static page generation timeout (in seconds)
  staticPageGenerationTimeout: 1000,
  
  // Configure Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow all Jupiter domains with more permissive settings
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: https://terminal.jup.ag https://*.jup.ag https://*.solana.com https://*.projectserum.com",
              "style-src 'self' 'unsafe-inline' https: https://*.jup.ag https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http: https://*.jup.ag https://raw.githubusercontent.com https://*.solana.com",
              "connect-src 'self' https: wss: https://*.jup.ag https://*.solana.com wss://*.solana.com https://*.projectserum.com wss://*.projectserum.com https://*.alchemy.com wss://*.alchemy.com https://*.quiknode.pro wss://*.quiknode.pro",
              "frame-src 'self' https: https://terminal.jup.ag https://*.jup.ag blob:",
              "font-src 'self' data: blob: https: https://fonts.gstatic.com",
              "media-src 'self' data: blob: https:",
              "worker-src 'self' blob: https: https://terminal.jup.ag",
              "child-src 'self' blob: https: https://terminal.jup.ag",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Required for wallet connections and Jupiter Terminal
              "frame-ancestors 'self' https: https://*.jup.ag"
            ].join('; '),
          },
          // Relaxed cross-origin policies to allow Jupiter Terminal to work
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          // Add Access-Control-Allow-Origin header
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          // Add Permissions-Policy header
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  // Disable TypeScript type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      '@radix-ui',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui'
    ],
    // Enable external directory for public assets
    externalDir: true,
    // Configure server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Disable Sentry in development
    if (dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== 'SentryWebpackPlugin'
      );
    }
    
    // Add resolve.alias configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      // Set up path aliases
      '@': require('path').resolve(__dirname, 'src'),
      // Polyfill for process
      'process/browser': require.resolve('process/browser'),
    };

    // Add fallbacks for Node.js modules (merged configuration)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Node.js modules to disable in browser
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      process: false,
      // Polyfill for Node.js core modules
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      url: require.resolve('url/'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
    };
    
    // Add ProvidePlugin for global variables
    config.plugins.push(
      new (require('webpack').ProvidePlugin)({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );
    
    // Add externals for server-side rendering
    if (isServer) {
      config.externals = [...(config.externals || []), 'jupiverse-kit'];
    }
    
    // Only add source maps in development (use default devtool to avoid performance issues)
    // if (dev) {
    //   config.devtool = 'eval-source-map';
    // }

    return config;
  },
  images: {
    domains: [
      'i.imgur.com',
      'opensea.io',
      'img.rarible.com',
      'lh3.googleusercontent.com',
      'i.seadn.io',
      'storage.opensea.io',
      'localhost',
    ],
    unoptimized: true,
    // Define path remappings for reorganized public directory
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
}

module.exports = nextConfig
