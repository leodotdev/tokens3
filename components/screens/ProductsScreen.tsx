import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { AIChatInterface } from '../features/AIChatInterface';
import { ProductsSearchTab } from '../features/ProductsSearchTab';
import { AuthModal } from '../features/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

type ProductsTab = 'chat' | 'search';

export const ProductsScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;
  const [activeTab, setActiveTab] = useState<ProductsTab>('chat');
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <View className="flex-1">
            <AIChatInterface
              placeholder={user 
                ? "Ask me about gifts for your people..." 
                : "Ask me about gifts, people, or events..."
              }
              initialPrompts={user ? [
                "🎁 Gift ideas for my mom",
                "🎂 Upcoming birthdays this month", 
                "💝 Anniversary gifts under $100",
                "🎄 Holiday gift planning",
                "👨‍👩‍👧‍👦 Add my family members"
              ] : [
                "🎁 Great gifts for parents",
                "💝 Romantic anniversary gifts",
                "🎓 Graduation gift ideas", 
                "🏠 Housewarming presents",
                "🎂 Birthday gifts by age"
              ]}
              onProductsFound={() => {
                // Switch to search tab when products are found
                setActiveTab('search');
              }}
              compact={false}
              isMobile={isMobile}
            />
          </View>
        );
      
      case 'search':
        return <ProductsSearchTab isMobile={isMobile} />;
      
      default:
        return null;
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background, paddingTop: isMobile ? insets.top : 0 }}>
      <View className="flex-1 max-w-4xl self-center w-full">
        {/* Header */}
        <View className="px-6 pb-4 pt-4">
          <View className="mb-6 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>Products</Text>
              <Text className="mt-1" style={{ color: colors.foregroundSecondary }}>
                {activeTab === 'chat' 
                  ? 'AI-powered gift discovery' 
                  : 'Search and browse products'
                }
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
          

          {/* Tab Buttons */}
          <View className="mb-4 flex-row gap-3">
            {/* Assistant Button */}
            <TouchableOpacity
              onPress={() => setActiveTab('chat')}
              className="flex-1 py-3 px-4 rounded-xl border"
              style={{
                backgroundColor: activeTab === 'chat' ? colors.accent : colors.backgroundSecondary,
                borderColor: activeTab === 'chat' ? colors.accent : colors.border
              }}
            >
              <View className="flex-row items-center justify-center">
                <TablerIcon 
                  name="message" 
                  size={20}
                  color={activeTab === 'chat' ? colors.accentForeground : colors.foregroundMuted}
                  className="mr-2" 
                />
                <Text 
                  className="font-semibold text-base"
                  style={{
                    color: activeTab === 'chat' ? colors.accentForeground : colors.foregroundMuted
                  }}
                >
                  Assistant
                </Text>
              </View>
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity
              onPress={() => setActiveTab('search')}
              className="flex-1 py-3 px-4 rounded-xl border"
              style={{
                backgroundColor: activeTab === 'search' ? colors.accent : colors.backgroundSecondary,
                borderColor: activeTab === 'search' ? colors.accent : colors.border
              }}
            >
              <View className="flex-row items-center justify-center">
                <TablerIcon 
                  name="search" 
                  size={20}
                  color={activeTab === 'search' ? colors.accentForeground : colors.foregroundMuted}
                  className="mr-2" 
                />
                <Text 
                  className="font-semibold text-base"
                  style={{
                    color: activeTab === 'search' ? colors.accentForeground : colors.foregroundMuted
                  }}
                >
                  Search
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          {renderContent()}
        </View>
      </View>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </View>
  );
};