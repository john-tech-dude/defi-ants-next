import { StaticImageData } from 'next/image';

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Get dimensions from a local image import
 */
export function getImageDimensions(
  image: StaticImageData | string
): ImageDimensions {
  if (typeof image === 'string') {
    // For remote images, we can't determine dimensions statically
    return { width: 0, height: 0, aspectRatio: 1 };
  }
  
  return {
    width: image.width,
    height: image.height,
    aspectRatio: image.width / image.height,
  };
}

/**
 * Generate a blur data URL for Next.js Image component
 */
export function generateBlurDataURL(
  width: number,
  height: number,
  blurWidth: number = 8
): string {
  // This is a simple base64 encoded SVG that creates a blurred placeholder
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6" />
      <filter id="blur" x="0" y="0" width="100%" height="100%">
        <feGaussianBlur stdDeviation="${blurWidth}" color-interpolation-filters="sRGB" />
      </filter>
      <rect width="${width}" height="${height}" filter="url(#blur)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Get optimized image URL with query parameters for CDN optimization
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    position?: 'center' | 'top' | 'right' | 'bottom' | 'left' | 'entropy' | 'attention';
  } = {}
): string {
  if (!url) return '';
  
  // If it's a data URL or already has query params, return as is
  if (url.startsWith('data:') || url.includes('?')) {
    return url;
  }
  
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('q', options.quality.toString());
  if (options.format) params.append('fm', options.format);
  if (options.fit) params.append('fit', options.fit);
  if (options.position) params.append('position', options.position);
  
  // Add auto=format for WebP support
  if (!options.format) params.append('auto', 'format');
  
  return `${url}?${params.toString()}`;
}

/**
 * Preload images to improve perceived performance
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Get appropriate image sizes for responsive images
 */
export function getImageSizes(
  breakpoints: Record<string, number> = {
    '640px': 100, // sm
    '768px': 50,  // md
    '1024px': 33, // lg
    '1280px': 25, // xl
  },
  defaultSize: string = '100vw'
): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => `(min-width: ${breakpoint}) ${width}vw`)
    .concat([defaultSize])
    .join(', ');
}
