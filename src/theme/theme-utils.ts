/**
 * Theme utilities for consistent theming across the application
 */

type ThemeColors = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

/**
 * CSS variables for light and dark themes
 */
export const themeColors: ThemeColors = {
  light: {
    '--background': '0 0% 100%',
    '--foreground': '222 47% 8%',
    '--card': '0 0% 100%',
    '--card-foreground': '222 47% 8%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '222 47% 8%',
    '--primary': '221 83% 53%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '258 90% 63%',
    '--secondary-foreground': '0 0% 100%',
    '--muted': '210 40% 98%',
    '--muted-foreground': '215 16% 47%',
    '--accent': '346 86% 54%',
    '--accent-foreground': '0 0% 100%',
    '--destructive': '0 84% 60%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '214 32% 91%',
    '--input': '214 32% 91%',
    '--ring': '221 83% 53%',
    '--radius': '0.5rem',
  },
  dark: {
    '--background': '222 47% 4%',
    '--foreground': '40 30% 99%',
    '--card': '224 32% 10%',
    '--card-foreground': '40 30% 99%',
    '--popover': '224 32% 10%',
    '--popover-foreground': '40 30% 99%',
    '--primary': '221 83% 60%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '258 90% 70%',
    '--secondary-foreground': '0 0% 100%',
    '--muted': '224 32% 15%',
    '--muted-foreground': '215 20% 65%',
    '--accent': '346 86% 60%',
    '--accent-foreground': '0 0% 100%',
    '--destructive': '0 84% 65%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '224 32% 20%',
    '--input': '224 32% 20%',
    '--ring': '221 83% 60%',
  },
};

/**
 * Applies the specified theme colors to the document
 * @param theme - Theme to apply ('light' or 'dark')
 */
export function applyTheme(theme: 'light' | 'dark' = 'light') {
  const root = document.documentElement;
  const colors = themeColors[theme];
  
  // Apply each color variable to the root element
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Update the data-theme attribute for CSS selectors
  root.setAttribute('data-theme', theme);
}

/**
 * Returns the current theme
 * @returns The current theme ('light' or 'dark')
 */
export function getCurrentTheme(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Toggles between light and dark theme
 * @returns The new theme after toggling
 */
export function toggleTheme(): 'light' | 'dark' {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
}
