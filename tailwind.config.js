/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      '3xl': ['30px', { lineHeight: '36px' }],
      '4xl': ['36px', { lineHeight: '40px' }],
      '5xl': ['48px', { lineHeight: '1' }],
      '6xl': ['60px', { lineHeight: '1' }],
      '7xl': ['72px', { lineHeight: '1' }],
      '8xl': ['96px', { lineHeight: '1' }],
      '9xl': ['128px', { lineHeight: '1' }],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      
      // Base colors
      white: '#ffffff',
      black: '#000000',
      
      // Zinc palette (main neutral colors)
      zinc: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
      
      // Blue palette (accent colors)
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      
      // NativeWind Theme System - Dynamic semantic colors
      background: {
        DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
        secondary: 'rgb(var(--color-background-secondary) / <alpha-value>)',
      },
      
      foreground: {
        DEFAULT: 'rgb(var(--color-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--color-foreground-secondary) / <alpha-value>)',
        muted: 'rgb(var(--color-foreground-muted) / <alpha-value>)',
      },
      
      border: {
        DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
      },
      
      accent: {
        DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
        foreground: 'rgb(var(--color-accent-foreground) / <alpha-value>)',
      },
      
      // Semantic state colors
      destructive: {
        DEFAULT: '#ef4444',
        foreground: '#ffffff',
      },
      
      // Legacy color mappings for smooth transition
      gray: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
    },
    extend: {
      width: {
        '50': '200px', // Product card width
      },
      spacing: {
        '18': '72px', // Custom spacing values
      }
    },
  },
  plugins: [],
};
