import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { TabNavigator } from '../navigation/TabNavigator';
import { MainScreen } from './MainScreen';
import { Dashboard } from './Dashboard';
import { About } from './About';
import { SignInPlaceholder } from './SignInPlaceholder';
import { AuthModal } from '../features/AuthModal';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'House' },
  { id: 'products', label: 'Products', icon: 'Package' },
  { id: 'about', label: 'About', icon: 'Info' },
];

export const AppNavigator: React.FC = () => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width <= 500;
  const [activeTab, setActiveTab] = useState('products');
  const [authModalVisible, setAuthModalVisible] = useState(false);

  // Auto-switch to dashboard and close modal when user signs in
  useEffect(() => {
    if (user) {
      setAuthModalVisible(false);
      setActiveTab('dashboard');
    }
  }, [user]);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return user ? <Dashboard /> : <SignInPlaceholder onSignIn={() => setAuthModalVisible(true)} />;
      case 'products':
        return <MainScreen />;
      case 'about':
        return <About />;
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