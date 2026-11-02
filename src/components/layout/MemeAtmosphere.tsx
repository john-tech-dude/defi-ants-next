'use client';

const TICKER_ITEMS = [
  '$ANTS',
  'THE COLONY TAKES OVER',
  'PREMIUM MEME',
  'SOLANA',
  'SWARM THE CHART',
  'STAKE THE DRIP',
  'HONEY GOLD',
  'NOT FINANCIAL ADVICE',
];

export default function MemeAtmosphere() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <div className="site-grain" aria-hidden="true" />
      <div className="fixed top-0 left-0 right-0 z-[60] meme-ticker">
        <div className="meme-ticker-track">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`} className="meme-ticker-item">
              {item}
              <span className="mx-4 text-secondary-500">•</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
