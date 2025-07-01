import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance , Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // The actual theme being used (resolved from system if needed)
  setTheme: (theme: Theme) => void;
  colors: {
    background: string;
    backgroundSecondary: string;
    foreground: string;
    foregroundSecondary: string;
    foregroundMuted: string;
    border: string;
    accent: string;
    accentForeground: string;
  };
  // CSS classes for web (use these instead of direct styles on web)
  cssClasses: {
    background: string;
    backgroundSecondary: string;
    foreground: string;
    foregroundSecondary: string;
    foregroundMuted: string;
    border: string;
    accent: string;
    accentForeground: string;
  };
}

// Theme color definitions matching global.css
const themeVars = {
  light: {
    '--color-background': '255 255 255',
    '--color-background-secondary': '244 244 245', 
    '--color-foreground': '24 24 27',
    '--color-foreground-secondary': '63 63 70',
    '--color-foreground-muted': '161 161 170',
    '--color-border': '228 228 231',
    '--color-accent': '59 130 246',
    '--color-accent-foreground': '255 255 255',
  },
  dark: {
    '--color-background': '24 24 27',
    '--color-background-secondary': '39 39 42',
    '--color-foreground': '250 250 250',
    '--color-foreground-secondary': '244 244 245',
    '--color-foreground-muted': '161 161 170',
    '--color-border': '63 63 70',
    '--color-accent': '96 165 250',
    '--color-accent-foreground': '24 24 27',
  },
};

// React Native color definitions matching global.css
const themes = {
  light: {
    background: '#ffffff',           // rgb(255 255 255)
    backgroundSecondary: '#f4f4f5',  // rgb(244 244 245)
    foreground: '#18181b',           // rgb(24 24 27)
    foregroundSecondary: '#3f3f46',  // rgb(63 63 70)
    foregroundMuted: '#a1a1aa',      // rgb(161 161 170)
    border: '#e4e4e7',              // rgb(228 228 231)
    accent: '#3b82f6',              // rgb(59 130 246)
    accentForeground: '#ffffff',     // rgb(255 255 255)
  },
  dark: {
    background: '#18181b',           // rgb(24 24 27)
    backgroundSecondary: '#27272a',  // rgb(39 39 42)
    foreground: '#fafafa',           // rgb(250 250 250)
    foregroundSecondary: '#f4f4f5',  // rgb(244 244 245)
    foregroundMuted: '#a1a1aa',      // rgb(161 161 170)
    border: '#3f3f46',              // rgb(63 63 70)
    accent: '#60a5fa',              // rgb(96 165 250)
    accentForeground: '#18181b',     // rgb(24 24 27)
  },
};


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize web theme on mount
  useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('Initializing web theme support');
    }
  }, []);

  // Load saved theme on startup
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Initialize theme immediately on first load
  useEffect(() => {
    if (!isInitialized) {
      const actualTheme = theme === 'system' 
        ? (systemColorScheme === 'dark' ? 'dark' : 'light')
        : theme;
      
      applyTheme(actualTheme);
      setIsInitialized(true);
    }
  }, [theme, systemColorScheme, isInitialized]);

  const applyTheme = (actualTheme: 'light' | 'dark') => {
    if (Platform.OS === 'web') {
      const root = document.documentElement;
      
      console.log('applyTheme called with:', actualTheme);
      console.log('Document root before:', root.className);
      
      // Simply toggle the theme class - CSS handles the rest
      root.classList.remove('light', 'dark');
      root.classList.add(actualTheme);
      
      console.log('Document root after class changes:', root.className);
      console.log('Applied theme to web:', actualTheme);
      
      // Force a repaint to ensure styles apply immediately
      requestAnimationFrame(() => {
        const testEl = document.querySelector('[class*="bg-background"]');
        if (testEl) {
          const styles = getComputedStyle(testEl);
          console.log('Test element background color:', styles.backgroundColor);
        }
      });
    } else {
      // For React Native, colors are handled via context
      console.log('Applied theme to native:', actualTheme);
    }
  };

  // Apply theme when it changes
  useEffect(() => {
    if (isInitialized) {
      const actualTheme = theme === 'system' 
        ? (systemColorScheme === 'dark' ? 'dark' : 'light')
        : theme;
      
      applyTheme(actualTheme);
      saveTheme(theme);
      console.log('Theme changed to:', actualTheme);
    }
  }, [theme, systemColorScheme, isInitialized]);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setTheme = (newTheme: Theme) => {
    console.log('ThemeContext setTheme called with:', newTheme);
    console.log('Platform.OS:', Platform.OS);
    console.log('Current document.documentElement.className:', Platform.OS === 'web' ? document.documentElement.className : 'N/A');
    
    setThemeState(newTheme);
    
    // Apply theme immediately for better responsiveness
    const immediateActualTheme = newTheme === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : newTheme;
    
    console.log('Immediate actual theme:', immediateActualTheme);
    
    // For React Native (not web), also force the appearance
    if (Platform.OS !== 'web' && newTheme !== 'system') {
      try {
        // Force React Native to use the selected theme
        Appearance.setColorScheme(newTheme);
      } catch (error) {
        console.warn('Could not set appearance color scheme:', error);
      }
    }
    
    applyTheme(immediateActualTheme);
    
    // Additional debugging for web
    if (Platform.OS === 'web') {
      setTimeout(() => {
        console.log('After setTheme - document.documentElement.className:', document.documentElement.className);
        console.log('After setTheme - CSS variables on root:', {
          background: getComputedStyle(document.documentElement).getPropertyValue('--color-background'),
          foreground: getComputedStyle(document.documentElement).getPropertyValue('--color-foreground')
        });
      }, 100);
    }
  };

  // Resolve actual theme
  const actualTheme: 'light' | 'dark' = 
    theme === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : theme;

  // Get colors for the current theme
  const colors = themes[actualTheme];

  // CSS classes that will respond to theme changes on web
  const cssClasses = {
    background: 'bg-background',
    backgroundSecondary: 'bg-background-secondary',
    foreground: 'text-foreground',
    foregroundSecondary: 'text-foreground-secondary',
    foregroundMuted: 'text-foreground-muted',
    border: 'border-border',
    accent: 'text-accent',
    accentForeground: 'text-accent-foreground',
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, colors, cssClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};