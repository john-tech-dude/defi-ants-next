/**
 * Format a number with commas and optional decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places to show (default: 2)
 * @param compact - Whether to use compact notation (e.g., 1.2K instead of 1,200)
 * @returns Formatted number as string
 */
export function formatNumber(
  value: number | string,
  decimals: number = 2,
  compact: boolean = false
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  if (compact && num >= 1000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a number as a currency value
 * @param value - The number to format
 * @param currency - Currency code (default: 'USD')
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string,
  currency: string = 'USD',
  decimals: number = 2
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a number as a percentage
 * @param value - The number to format (e.g., 15.5 for 15.5%)
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string,
  decimals: number = 2
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0%';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num / 100);
}

/**
 * Format a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @param includeSeconds - Whether to include seconds in the output
 * @returns Formatted duration string (e.g., "2d 5h 30m")
 */
export function formatDuration(
  seconds: number,
  includeSeconds: boolean = false
): string {
  if (seconds < 0) return '0s';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (includeSeconds && secs > 0) parts.push(`${secs}s`);
  
  return parts.length > 0 ? parts.join(' ') : '0s';
}

/**
 * Format a timestamp to a relative time string (e.g., "2 hours ago")
 * @param timestamp - Timestamp in seconds or milliseconds
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const seconds = timestamp < 10000000000 ? timestamp : Math.floor(timestamp / 1000);
  const now = Math.floor(Date.now() / 1000);
  const diff = now - seconds;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

/**
 * Truncate an address or hash for display
 * @param address - The address to truncate
 * @param start - Number of characters to show at the start (default: 6)
 * @param end - Number of characters to show at the end (default: 4)
 * @returns Truncated address (e.g., "0x1234...abcd")
 */
export function truncateAddress(
  address: string,
  start: number = 6,
  end: number = 4
): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
