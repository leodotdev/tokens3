import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from './components/ui/provider';
import { MainScreen } from './components/screens/MainScreen';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <MainScreen />
        <StatusBar style="auto" />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
