export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
}

export interface MarketInfo {
  id: string;
  label: string;
  inputMint: string;
  outputMint: string;
  percent: number;
}

export interface Route {
  id: string;
  marketInfos: MarketInfo[];
  outAmount: string;
  outAmountWithSlippage: string;
  priceImpactPct: number;
  slippageBps: number;
}

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  routes: Route[];
  priceImpactPct: number;
  slippageBps: number;
}
