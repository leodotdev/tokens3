import { useEffect } from 'react';
import { Platform } from 'react-native';

const getPathFromTab = (tabId: string): string => {
  switch (tabId) {
    case 'dashboard': return '/dashboard';
    case 'products': return '/products';
    case 'about': return '/about';
    case 'settings': return '/settings';
    default: return '/products';
  }
};

const getTabFromPath = (path: string): string => {
  switch (path) {
    case '/dashboard': return 'dashboard';
    case '/products': return 'products';
    case '/about': return 'about';
    case '/settings': return 'settings';
    case '/': return 'products'; // Default route
    default: return 'products';
  }
};

export const useWebRouting = (activeTab: string, setActiveTab: (tab: string) => void) => {
  const isWeb = Platform.OS === 'web';

  // Listen for browser back/forward navigation
  useEffect(() => {
    if (!isWeb) return;
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const tabFromPath = getTabFromPath(currentPath);
      if (tabFromPath !== activeTab) {
        setActiveTab(tabFromPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial route based on URL
    const initialPath = window.location.pathname;
    const initialTab = getTabFromPath(initialPath);
    if (initialTab !== activeTab) {
      setActiveTab(initialTab);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab, setActiveTab]);

  // Update URL when tab changes
  const updateURL = (tabId: string) => {
    if (!isWeb) return;
    
    const newPath = getPathFromTab(tabId);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  return { updateURL };
};