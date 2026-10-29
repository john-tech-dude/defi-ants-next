import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://terminal.jup.ag https://*.jup.ag https://solana-api.projectserum.com https://*.solana.com; style-src 'self' 'unsafe-inline' https://*.jup.ag https://fonts.googleapis.com; img-src 'self' data: blob: https: http: https://*.jup.ag https://raw.githubusercontent.com https://solscan.io https://solana.com; connect-src 'self' https: wss: https://*.jup.ag https://api.mainnet-beta.solana.com wss://api.mainnet-beta.solana.com https://rpc.ankr.com https://solana-api.projectserum.com wss://solana-api.projectserum.com https://solana-mainnet.g.alchemy.com wss://solana-mainnet.g.alchemy.com https://*.solana.com https://*.solana.com/ wss://*.solana.com wss://*.solana.com/ https://*.solana-mainnet.quiknode.pro/ wss://*.solana-mainnet.quiknode.pro/; frame-src 'self' https://terminal.jup.ag https://*.jup.ag blob:; font-src 'self' data: blob: https://fonts.gstatic.com; media-src 'self' data: blob:; worker-src 'self' blob: https://terminal.jup.ag; child-src 'self' blob: https://terminal.jup.ag; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://*.jup.ag;" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
