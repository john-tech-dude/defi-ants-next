import { type CSSProperties } from 'react';

/**
 * Common styles that should be applied to the body when a theme is active
 */
export const themeBodyStyles: Record<string, CSSProperties> = {
  light: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    color: 'hsl(222.2, 47.4%, 8%)',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  dark: {
    backgroundColor: 'hsl(224, 32%, 10%)',
    color: 'hsl(40, 30%, 99%)',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
};

/**
 * Common styles for cards and surfaces
 */
export const surfaceStyles = {
  light: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderColor: 'hsl(214, 32%, 91%)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  dark: {
    backgroundColor: 'hsl(224, 32%, 15%)',
    borderColor: 'hsl(215, 28%, 17%)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
  },
};

/**
 * Animation keyframes for theme transitions
 */
export const themeKeyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.98); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

/**
 * Common animations for theme transitions
 */
export const animations = {
  fadeIn: 'fadeIn 0.3s ease-out forwards',
  slideUp: 'slideUp 0.3s ease-out forwards',
  scaleIn: 'scaleIn 0.2s ease-out forwards',
};
