import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { AIChatInterface } from '../features/AIChatInterface';
import { ProductsSearchTab } from '../features/ProductsSearchTab';
import { AuthModal } from '../features/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClassName } from '../../lib/theme-utils';

type ProductsTab = 'chat' | 'search';

export const ProductsScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;
  const isWeb = Platform.OS === 'web';
  const [activeTab, setActiveTab] = useState<ProductsTab>('search'); // Start with search tab
  const [authModalVisible, setAuthModalVisible] = useState(false);


  return (
    <View className="flex-1" style={{ backgroundColor: colors.background, paddingTop: isMobile ? insets.top : 0 }}>
      <View className="flex-1 max-w-4xl self-center w-full">
        {/* Header */}
        <View className="px-6 pb-4 pt-4">
          <View className="mb-6 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>Products</Text>
              <Text className="mt-1" style={{ color: colors.foregroundSecondary }}>
                Search and browse products
              </Text>
            </View>
            {!user && (
              <TouchableOpacity
                onPress={() => setAuthModalVisible(true)}
                className="ml-4 rounded-full bg-blue-500 px-4 py-2"
              >
                <Text className="text-sm font-medium text-white">Sign In</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          <ProductsSearchTab 
            isMobile={isMobile} 
            showSearchInput={false} // Hide the built-in search input
          />
        </View>

        {/* Sticky Search Input */}
        <View 
          className={getThemeClassName(
            'px-4 pt-3 pb-3 border-t',
            ['bg-background', 'border-border'],
            isWeb
          )}
          style={{
            ...(!isWeb && {
              backgroundColor: colors.background,
              borderColor: colors.border
            }),
            position: isMobile ? 'absolute' : 'relative',
            bottom: isMobile ? 48 + insets.bottom : 0, // Position above nav tabs
            left: 0,
            right: 0,
          }}
        >
          <View className="flex-row items-center rounded-2xl px-4 py-2" style={{ backgroundColor: colors.backgroundSecondary }}>
            <TablerIcon name="search" size={20} color={colors.foregroundMuted} />
            <Text 
              className="flex-1 ml-3 text-base"
              style={{ color: colors.foregroundMuted }}
            >
              Search for gifts, gadgets, or anything...
            </Text>
            <TouchableOpacity
              className="ml-2 p-2 rounded-full"
              style={{ backgroundColor: colors.foregroundMuted }}
            >
              <TablerIcon name="sparkles" size={18} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </View>
  );
};