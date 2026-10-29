// Theme provider and hooks
export * from '../components/theme/theme-provider';
export * from '../components/theme/theme-wrapper';

// Theme components
export * from '../components/theme/theme-button';
export * from '../components/theme/theme-card';
export * from '../components/theme/theme-text';
export * from '../components/theme/theme-toggle';

// Re-export hooks for convenience
export { useThemeColors, useIsDarkMode } from '../hooks/use-theme-colors';

// Common theme types
export type { Theme } from '../components/theme/theme-provider';

// Default theme configuration
export const defaultTheme = {
  light: {
    background: '#ffffff',
    foreground: '#0f172a',
    primary: '#2563eb',
    primaryForeground: '#f8fafc',
    secondary: '#4f46e5',
    secondaryForeground: '#f8fafc',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#2563eb',
    radius: '0.5rem',
  },
  dark: {
    background: '#020617',
    foreground: '#f8fafc',
    primary: '#3b82f6',
    primaryForeground: '#0f172a',
    secondary: '#6366f1',
    secondaryForeground: '#f8fafc',
    accent: '#1e293b',
    accentForeground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    destructive: '#7f1d1d',
    destructiveForeground: '#f8fafc',
    border: '#1e293b',
    input: '#1e293b',
    ring: '#3b82f6',
    radius: '0.5rem',
  },
} as const;
