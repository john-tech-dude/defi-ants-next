const fs = require('fs');
const https = require('https');
const path = require('path');

// Ensure the wallets directory exists
const walletsDir = path.join(process.cwd(), 'public', 'wallets');
if (!fs.existsSync(walletsDir)) {
  fs.mkdirSync(walletsDir, { recursive: true });
}

// Wallet icons to download with their URLs
const walletIcons = {
  'phantom.png': 'https://cryptologos.cc/logos/phantom-crypto-logo.png',
  'solflare.png': 'https://cryptologos.cc/logos/solflare-wallet-sol-logo.png',
  'metamask.png': 'https://cryptologos.cc/logos/metamask-logo.png',
  'ledger.png': 'https://cryptologos.cc/logos/ledger-logo.png',
  'backpack.png': 'https://cryptologos.cc/logos/backpack-logo.png',
  'coinbase.png': 'https://cryptologos.cc/logos/coinbase-wallet-cwallet-logo.png',
  'glow.png': 'https://cryptologos.cc/logos/glow-logo.png',
  'torus.png': 'https://cryptologos.cc/logos/torus-logo.png',
  'trust.png': 'https://cryptologos.cc/logos/trust-wallet-token-logo.png',
  'math.png': 'https://cryptologos.cc/logos/math-token-math-logo.png',
  'sollet.png': 'https://cryptologos.cc/logos/sollet-sollet-logo.png',
  'wallet.svg': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIgMTdDMiAxOC42NTY5IDMuMzQzMTUgMjAgNSAyMEgxOUMyMC42NTY5IDIwIDIyIDE4LjY1NjkgMjIgMTdWMTFDMjIgOS4zNDMxNSAyMC42NTY5IDggMTkgOEg1QzMuMzQzMTUgOCAyIDkuMzQzMTUgMiAxMVYxN1pNNSAxMEgxOUMxOS41NTIzIDEwIDIwIDEwLjQ0NzcgMjAgMTFWMTdDMjAgMTcuNTUyMyAxOS41NTIzIDE4IDE5IDE4SDFDxYy0wLjU1MjI4IDAtMS0wLjQ0NzcyLTEtMVYxMUM0IDEwLjQ0NzcgNC40NDc3MiAxMCA1IDEwWiIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxwYXRoIGQ9Ik0xNiAxNEMxNiAxNS4xMDU0IDE1LjEwNTQgMTYgMTQgMTZDMTIuODk0NiAxNiAxMiAxNS4xMDU0IDEyIDE0QzEyIDEyLjg5NDYgMTIuODk0NiAxMiAxNCAxMkMxNS4xMDU0IDEyIDE2IDEyLjg5NDYgMTYgMTRaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==',
};

// Function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Download all wallet icons
async function downloadAllIcons() {
  const entries = Object.entries(walletIcons);
  
  for (const [filename, url] of entries) {
    const filepath = path.join(walletsDir, filename);
    
    try {
      if (url.startsWith('data:')) {
        // Handle data URL (for the default wallet icon)
        const base64Data = url.split(',')[1];
        fs.writeFileSync(filepath, base64Data, 'base64');
        console.log(`Saved ${filename} from data URL`);
      } else {
        // Handle regular URL
        await downloadFile(url, filepath);
        console.log(`Downloaded ${filename} from ${url}`);
      }
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error.message);
    }
  }
  
  console.log('\nAll wallet icons have been downloaded to public/wallets/');
}

// Run the download
downloadAllIcons().catch(console.error);
