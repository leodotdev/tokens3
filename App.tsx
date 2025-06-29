import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from './components/ui/provider';
import { AppNavigator } from './components/screens/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
