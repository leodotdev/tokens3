import { Platform } from 'react-native';

/**
 * Get the appropriate style for a component based on platform
 * On web: returns empty object (use CSS classes)
 * On native: returns style object with colors
 */
export const getThemeStyle = (
  colorKey: string,
  colors: Record<string, string>,
  styleType: 'background' | 'text' | 'border' = 'text'
) => {
  if (Platform.OS === 'web') {
    return {}; // Let CSS classes handle styling on web
  }

  const color = colors[colorKey];
  if (!color) return {};

  switch (styleType) {
    case 'background':
      return { backgroundColor: color };
    case 'border':
      return { borderColor: color };
    case 'text':
    default:
      return { color };
  }
};

/**
 * Get the appropriate className for a component
 * Combines base classes with theme-aware classes
 */
export const getThemeClassName = (
  baseClasses: string,
  themeClasses: string[] = [],
  isWeb: boolean = Platform.OS === 'web'
) => {
  if (isWeb) {
    return [baseClasses, ...themeClasses].join(' ');
  }
  return baseClasses;
};