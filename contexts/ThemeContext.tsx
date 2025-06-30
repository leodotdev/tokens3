import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { Platform } from 'react-native';
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

// Theme color definitions
const themeVars = {
  light: {
    '--color-background': '255 255 255',
    '--color-background-secondary': '244 244 245',
    '--color-foreground': '24 24 27',
    '--color-foreground-secondary': '113 113 122',
    '--color-foreground-muted': '161 161 170',
    '--color-border': '228 228 231',
    '--color-accent': '59 130 246',
    '--color-accent-foreground': '255 255 255',
  },
  dark: {
    '--color-background': '24 24 27',
    '--color-background-secondary': '39 39 42',
    '--color-foreground': '250 250 250',
    '--color-foreground-secondary': '212 212 216',
    '--color-foreground-muted': '161 161 170',
    '--color-border': '63 63 70',
    '--color-accent': '96 165 250',
    '--color-accent-foreground': '24 24 27',
  },
};

// React Native color definitions
const themes = {
  light: {
    background: '#ffffff',
    backgroundSecondary: '#f4f4f5',
    foreground: '#18181b',
    foregroundSecondary: '#71717a',
    foregroundMuted: '#a1a1aa',
    border: '#e4e4e7',
    accent: '#3b82f6',
    accentForeground: '#ffffff',
  },
  dark: {
    background: '#18181b',
    backgroundSecondary: '#27272a',
    foreground: '#fafafa',
    foregroundSecondary: '#d4d4d8',
    foregroundMuted: '#a1a1aa',
    border: '#3f3f46',
    accent: '#60a5fa',
    accentForeground: '#18181b',
  },
};


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isInitialized, setIsInitialized] = useState(false);

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
      // Apply CSS custom properties to the document root
      const root = document.documentElement;
      const vars = themeVars[actualTheme];
      
      // Clear any existing theme classes
      root.classList.remove('light', 'dark');
      root.classList.add(actualTheme);
      
      // Apply CSS custom properties
      Object.entries(vars).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      console.log('Applied theme to web:', actualTheme, 'Variables:', vars);
      
      // Force a repaint by triggering layout
      requestAnimationFrame(() => {
        document.body.style.opacity = '0.99';
        requestAnimationFrame(() => {
          document.body.style.opacity = '';
        });
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
    console.log('Setting theme to:', newTheme);
    setThemeState(newTheme);
    
    // Apply theme immediately for better responsiveness
    const immediateActualTheme = newTheme === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : newTheme;
    
    // For React Native, also force the appearance
    if (Platform.OS !== 'web' && newTheme !== 'system') {
      // Force React Native to use the selected theme
      Appearance.setColorScheme(newTheme);
    }
    
    applyTheme(immediateActualTheme);
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