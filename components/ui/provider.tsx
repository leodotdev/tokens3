import React from 'react';
import { View } from 'react-native';

// Simple provider wrapper for now - will enhance with Gluestack theming
export const GluestackUIProvider = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};
