/**
 * Utility functions for accessing assets with the reorganized directory structure
 */

import getConfig from 'next/config';

// Get the public runtime configuration
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };
const { publicPaths = {} } = publicRuntimeConfig;

// Asset path types
type AssetCategory = 
  | 'icons' 
  | 'images' 
  | 'nft' 
  | 'logos' 
  | 'tutorial' 
  | 'community' 
  | 'videos' 
  | 'memes';

/**
 * Get the path to an asset in the public directory
 * @param category - The category of the asset
 * @param filename - The filename of the asset
 * @returns The full path to the asset
 */
export function getAssetPath(category: AssetCategory, filename: string): string {
  const basePath = publicPaths[category] || `/${category}`;
  return `${basePath}/${filename}`;
}

/**
 * Get the path to an icon
 * @param filename - The filename of the icon
 * @returns The full path to the icon
 */
export function getIconPath(filename: string): string {
  return getAssetPath('icons', filename);
}

/**
 * Get the path to an image
 * @param filename - The filename of the image
 * @returns The full path to the image
 */
export function getImagePath(filename: string): string {
  return getAssetPath('images', filename);
}

/**
 * Get the path to an NFT image
 * @param filename - The filename of the NFT image
 * @returns The full path to the NFT image
 */
export function getNftImagePath(filename: string): string {
  return getAssetPath('nft', filename);
}

/**
 * Get the path to a logo image
 * @param filename - The filename of the logo image
 * @returns The full path to the logo image
 */
export function getLogoPath(filename: string): string {
  return getAssetPath('logos', filename);
}

/**
 * Get the path to a tutorial image
 * @param filename - The filename of the tutorial image
 * @returns The full path to the tutorial image
 */
export function getTutorialImagePath(filename: string): string {
  return getAssetPath('tutorial', filename);
}

/**
 * Get the path to a community image
 * @param filename - The filename of the community image
 * @returns The full path to the community image
 */
export function getCommunityImagePath(filename: string): string {
  return getAssetPath('community', filename);
}

/**
 * Get the path to a video
 * @param filename - The filename of the video
 * @returns The full path to the video
 */
export function getVideoPath(filename: string): string {
  return getAssetPath('videos', filename);
}

/**
 * Get the path to a meme image
 * @param filename - The filename of the meme image
 * @returns The full path to the meme image
 */
export function getMemePath(filename: string): string {
  return getAssetPath('memes', filename);
}

// Export a default object with all the helper functions
const assetPaths = {
  getAssetPath,
  getIconPath,
  getImagePath,
  getNftImagePath,
  getLogoPath,
  getTutorialImagePath,
  getCommunityImagePath,
  getVideoPath,
  getMemePath,
};

export default assetPaths;
