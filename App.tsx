import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from './components/ui/provider';
import { AppNavigator } from './components/screens/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import './global.css';

function AppContent() {
  const { actualTheme } = useTheme();
  
  return (
    <>
      <AppNavigator />
      <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GluestackUIProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </GluestackUIProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
