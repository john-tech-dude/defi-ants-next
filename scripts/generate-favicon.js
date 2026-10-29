const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  
  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = `${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ANT', size / 2, size / 2);
  
  // Save to file
  const filename = `public/favicon-${size}x${size}.png`;
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.resolve(__dirname, '..', filename), buffer);
  console.log(`Generated ${filename}`);
});

// Also create the android-chrome versions
fs.copyFileSync('public/favicon-192x192.png', 'public/android-chrome-192x192.png');
fs.copyFileSync('public/favicon-512x512.png', 'public/android-chrome-512x512.png');

console.log('Favicons generated successfully!');
