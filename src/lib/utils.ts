import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * This allows for conditional classes and resolves Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Formats a wallet address for display by showing only the first and last few characters
 */
export function formatWalletAddress(address: string): string {
  if (!address) return ''
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Debounces a function to limit how often it can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
