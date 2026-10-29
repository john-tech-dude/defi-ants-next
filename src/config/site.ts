import { envVars } from '../env';

const isProd = envVars.NODE_ENV === 'production';
const baseUrl = isProd ? 'https://defiant.fun' : '';

export const siteConfig = {
  name: "DeFi ANT!",
  description: "DeFi ANT! is a community-driven cryptocurrency project with NFT integration and innovative tokenomics.",
  url: baseUrl,
  ogImage: `${baseUrl}/og.jpg`,
  links: {
    twitter: "https://twitter.com/defiant_token",
    github: "https://github.com/defiant-token",
    discord: "https://discord.gg/defiant",
    telegram: "https://t.me/defiant_token",
  },
  creator: "DeFi ANT! Team"
}
