import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { AIChatInterface } from '../features/AIChatInterface';
import { ProductsSearchTab } from '../features/ProductsSearchTab';
import { UniversalComposer } from '../features/UniversalComposer';
import { InlineChatInterface } from '../features/InlineChatInterface';
import { AuthModal } from '../features/AuthModal';
import { ChatConversation } from '../../lib/chat-storage';
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
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);


  const handleChatStart = (conversation: ChatConversation) => {
    setCurrentConversation(conversation);
    setShowChatInterface(true);
  };

  const handleCloseChatInterface = () => {
    setShowChatInterface(false);
    setCurrentConversation(null);
  };

  const handleSearchSubmit = (query: string, filters?: any) => {
    // Handle search submission - update products list
    console.log('Products search:', query, filters);
    // TODO: Implement product search functionality
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background, paddingTop: isMobile ? insets.top : 0 }}>
      {showChatInterface && currentConversation ? (
        // Full screen chat interface
        <InlineChatInterface
          initialMessage={currentConversation.messages[0]?.text || ''}
          onClose={handleCloseChatInterface}
          isMobile={isMobile}
          onProductsFound={(products) => {
            console.log('Products found:', products);
          }}
        />
      ) : (
        // Normal products view
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

          {/* Universal Composer */}
          <View
            style={{
              position: isMobile ? 'absolute' : 'relative',
              bottom: isMobile ? 48 + insets.bottom : 0, // Position above nav tabs
              left: 0,
              right: 0,
            }}
          >
            <UniversalComposer
              isMobile={isMobile}
              onChatStart={handleChatStart}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search products or ask AI assistant..."
            />
          </View>
        </View>
      )}

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </View>
  );
};