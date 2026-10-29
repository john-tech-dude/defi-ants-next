/**
 * Normalizes image paths by handling spaces and special characters
 * @param path Relative path to the image from the public directory
 * @returns Properly formatted image path
 */
export const getImagePath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Handle known image mappings
  const imageMappings: Record<string, string> = {
    'images/Defi_Ant_upscaled%20image#101.jpg': 'images/Defi_Ant_upscaled image#101.jpg',
    'UniversalUpscaler_bd00a760-f541-4742-a6fe-93ddde137d99.jpg': 'images/UniversalUpscaler_3f4f34a5-a6b5-473e-8033-55405e0dacdd.jpg',
    'defi_ant_logo_0227.jpg': 'images/logos/logo.png',
  };

  return imageMappings[cleanPath] || cleanPath;
};

/**
 * Gets the full public URL for an image
 * @param path Relative path to the image from the public directory
 * @returns Full URL to the image
 */
export const getImageUrl = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const normalizedPath = getImagePath(path);
  return `${basePath}/${normalizedPath}`.replace(/([^:]\/)\/+/g, '$1');
};
