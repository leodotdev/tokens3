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
      
      // Semantic color system
      background: {
        DEFAULT: '#ffffff',
        secondary: '#f4f4f5', // zinc-100
        tertiary: '#fafafa', // zinc-50
      },
      
      foreground: {
        DEFAULT: '#18181b', // zinc-900
        secondary: '#3f3f46', // zinc-700
        tertiary: '#71717a', // zinc-500
        muted: '#a1a1aa', // zinc-400
      },
      
      border: {
        DEFAULT: '#e4e4e7', // zinc-200
        secondary: '#d4d4d8', // zinc-300
      },
      
      accent: {
        DEFAULT: '#3b82f6', // blue-500
        foreground: '#ffffff',
        light: '#dbeafe', // blue-100
        dark: '#1d4ed8', // blue-700
      },
      
      success: {
        DEFAULT: '#22c55e',
        foreground: '#ffffff',
        light: '#dcfce7',
      },
      
      warning: {
        DEFAULT: '#f59e0b',
        foreground: '#ffffff',
        light: '#fef3c7',
      },
      
      error: {
        DEFAULT: '#ef4444',
        foreground: '#ffffff',
        light: '#fee2e2',
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
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
};
