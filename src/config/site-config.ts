// Single source of truth for DeFiANT! website
// DO NOT CHANGE THESE VALUES WITHOUT AUTHORIZATION

export const SITE_CONFIG = {
  // Token stats (fetched live from APIs)
  MINT_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_MINT || '',
  MARKET_CAP: null, // Fetched live from DexScreener API
  HOLDERS: null, // Fetched live from Solscan/Birdeye

  // Dates
  LAUNCH_DATE: null, // REAL PUMP.FUN CREATION DATE - to be filled at launch
  STAKING_LIVE: false, // Waitlist mode until launch + 30 days with steady volume
  GOVERNANCE_LIVE: 'TBA', // After staking is live

  // External links (none until provided)
  AUDIT_URL: null,
  KYC_URL: null,
  PRESS_LINKS: null,
  POOL_URL: null,
  LOCK_LINKS: null,

  // Tokenomics - Path A: pump.fun fair launch
  TOTAL_SUPPLY: 1_000_000_000, // 1B $ANTS
  TOKENOMICS: {
    PUBLIC_PERCENT: 90, // Bonding curve + PumpSwap liquidity
    TEAM_PERCENT: 5, // Bought on curve at launch
    STAKING_REWARDS_PERCENT: 5, // Bought on curve at launch
  },

  // Staking config
  STAKING: {
    REWARD_POOL_AMOUNT: 50_000_000, // 50M $ANTS (5% of supply)
    EMISSION_MONTHS: 24,
    FUNDING_SOURCE: 'locked token reserve + PumpSwap creator fees',
    TIERS: [
      { name: 'Explorer', lockDays: 30, multiplier: 1.0 },
      { name: 'Pioneer', lockDays: 90, multiplier: 1.5 },
      { name: 'Visionary', lockDays: 180, multiplier: 2.5 },
    ],
  },

  // Restricted jurisdictions
  RESTRICTED_JURISDICTIONS: [
    'United States and its territories',
    'Countries and regions under comprehensive sanctions (e.g., Cuba, Iran, North Korea, Syria, Crimea/Donetsk/Luhansk)',
    'Any other jurisdictions as advised by legal counsel',
  ],
};

// Helper to get placeholder or real value
export const getStatValue = (value: any, placeholder: string = '—') => {
  if (value === null || value === undefined || value === '') {
    return placeholder;
  }
  return value;
};
