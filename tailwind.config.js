/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors mapped to CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Primary color - Honey gold
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#f6d36a',
          400: '#f5c518',
          500: '#e8b30e',
          600: '#c49208',
          700: '#9a6f09',
          800: '#7a560e',
          900: '#654712',
        },
        
        // Secondary color - Colony crimson
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: '#fff1f0',
          100: '#ffd9d4',
          200: '#ffb3aa',
          300: '#f58375',
          400: '#e85a48',
          500: '#d63b28',
          600: '#b92c1d',
          700: '#962418',
          800: '#7a2118',
          900: '#66211a',
        },
        
        // Destructive color - Red
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Muted colors for subtle UI elements
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        // Accent color - Vibrant pink-red
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        
        // Brand color - Ant Brown (kept for backward compatibility)
        ant: {
          50: '#f5f5f4',
          100: '#e8e6e3',
          200: '#d3cec7',
          300: '#b5aca0',
          400: '#a18b75',
          500: '#8c7356',
          600: '#75604a',
          700: '#604e3e',
          800: '#504136',
          900: '#423730',
        },
        
        // UI component colors
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Space Grotesk', 'ui-sans-serif', 'system-ui'],
        body: ['var(--font-body)', 'Space Grotesk', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-display)', 'Bangers', 'Impact', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'hsl(var(--foreground))',
            h1: {
              color: 'hsl(var(--foreground))',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: 'hsl(var(--foreground))',
              fontWeight: '700',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              marginTop: '1.5em',
              marginBottom: '0.75em',
            },
            h3: {
              color: 'hsl(var(--foreground))',
              fontWeight: '600',
              lineHeight: '1.25',
              letterSpacing: '-0.015em',
              marginTop: '1.25em',
              marginBottom: '0.5em',
            },
            h4: {
              color: 'hsl(var(--foreground))',
              fontWeight: '600',
              lineHeight: '1.3',
              marginTop: '1em',
              marginBottom: '0.5em',
            },
          },
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
        'scale-up-down': 'scaleUpDown 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-bottom': 'slideInBottom 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'scale-in': 'scaleIn 0.3s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px theme(colors.primary.500/50))' },
          '50%': { filter: 'drop-shadow(0 0 8px theme(colors.primary.500/70))' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        "scaleUpDown": {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        "slideInRight": {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        "slideInLeft": {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        "slideInBottom": {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        "glow": {
          '0%': { boxShadow: '0 0 5px rgba(255, 179, 0, 0.6)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 179, 0, 0.8), 0 0 30px rgba(255, 179, 0, 0.6)' },
        },
      },
      boxShadow: {
        'glow': '0 0 10px 2px rgba(255, 179, 0, 0.5)',
        'glow-lg': '0 0 20px 5px rgba(255, 179, 0, 0.5)',
      },
      dropShadow: {
        'glow': [
          '0 0 5px theme(colors.primary.500/50)',
          '0 0 10px theme(colors.primary.500/30)',
        ],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
