import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useWebRouting } from '../../hooks/useWebRouting';
import { TabNavigator } from '../navigation/TabNavigator';
import { MainScreen } from './MainScreen';
import { ProductsScreen } from './ProductsScreen';
import { Dashboard } from './Dashboard';
import { About } from './About';
import { SettingsScreen } from './SettingsScreen';
import { SignInPlaceholder } from './SignInPlaceholder';
import { AuthModal } from '../features/AuthModal';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'products', label: 'Products', icon: 'shopping-bag' },
  { id: 'about', label: 'About', icon: 'heart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const AppNavigator: React.FC = () => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width <= 500;
  const [activeTab, setActiveTab] = useState('products');
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const { updateURL } = useWebRouting(activeTab, setActiveTab);

  // Auto-switch to dashboard and close modal when user signs in (only on first sign-in)
  useEffect(() => {
    if (user && authModalVisible) {
      setAuthModalVisible(false);
      setActiveTab('dashboard');
      updateURL('dashboard');
    }
  }, [user, authModalVisible, updateURL]);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    updateURL(tabId);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return user ? <Dashboard /> : <SignInPlaceholder onSignIn={() => setAuthModalVisible(true)} />;
      case 'products':
        return <ProductsScreen />;
      case 'about':
        return <About />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <View className="flex-1">
      {/* Desktop/Tablet: Navigation at top */}
      {!isMobile && (
        <TabNavigator
          activeTab={activeTab}
          onTabPress={handleTabPress}
          tabs={tabs}
        />
      )}
      
      {renderScreen()}
      
      {/* Mobile: Navigation at bottom */}
      {isMobile && (
        <TabNavigator
          activeTab={activeTab}
          onTabPress={handleTabPress}
          tabs={tabs}
        />
      )}

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </View>
  );
};