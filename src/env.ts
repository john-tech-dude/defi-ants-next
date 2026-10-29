import { z } from 'zod';

/**
 * This file is used to validate environment variables at build time.
 * It provides type safety and runtime validation for environment variables.
 */

// Define the schema for environment variables
const envSchema = z.object({
  // Next.js built-in
  NODE_ENV: z
    .enum(['development', 'production', 'test'] as const)
    .default('development'),
  
  // Required environment variables
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Solana configuration
  NEXT_PUBLIC_SOLANA_NETWORK: z
    .enum(['mainnet-beta', 'testnet', 'devnet', 'localnet'] as const)
    .default('devnet'),
  NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url().optional(),
  
  // WalletConnect configuration
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().optional(),
  
  // Optional environment variables with defaults
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .refine((val) => val === 'true' || val === 'false')
    .transform((val) => val === 'true')
    .optional()
    .default('false'),
});

// Infer the type from the schema
type EnvVars = z.infer<typeof envSchema>;

/**
 * Validate environment variables against the schema
 */
const parseEnv = (): EnvVars => {
  // Get all environment variables that match our schema
  const envVars = Object.keys(envSchema.shape).reduce((acc, key) => {
    const value = process.env[key];
    if (value !== undefined) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {} as Record<string, string | undefined>);

  const result = envSchema.safeParse(envVars);

  if (!result.success) {
    console.error(
      '❌ Invalid environment variables:\n',
      JSON.stringify(result.error.format(), null, 2)
    );
    throw new Error('Invalid environment variables');
  }

  return result.data;
};

// Parse and validate environment variables
export const envVars = parseEnv();

// Export a type-safe version of process.env
export type ProcessEnv = typeof envVars;

// Extend NodeJS.ProcessEnv with our environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVars {}
  }
}

// This ensures the file is treated as a module
export {};
