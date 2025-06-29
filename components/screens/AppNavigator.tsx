import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { TabNavigator } from '../navigation/TabNavigator';
import { MainScreen } from './MainScreen';
import { Dashboard } from './Dashboard';
import { About } from './About';
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
  const [activeTab, setActiveTab] = useState(user ? 'dashboard' : 'products');
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleTabPress = (tabId: string) => {
    if (!user && tabId === 'dashboard') {
      setAuthModalVisible(true);
      return;
    }
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return user ? <Dashboard /> : <MainScreen />;
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
        isVisible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={() => {
          setAuthModalVisible(false);
          setActiveTab('dashboard');
        }}
      />
    </View>
  );
};