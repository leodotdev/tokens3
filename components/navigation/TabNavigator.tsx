import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useWindowDimensions } from 'react-native';

interface Tab {
  id: string;
  label: string;
  icon: string;
  iconSize?: number;
}

interface TabNavigatorProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  tabs: Tab[];
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({
  activeTab,
  onTabPress,
  tabs,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isMobile = width <= 500;

  if (isMobile) {
    // Mobile: Floating bottom tabs
    return (
      <View
        className="absolute bottom-6 left-6 right-6"
        style={{ paddingBottom: insets.bottom }}
      >
        <View
          className="flex-row items-center justify-around rounded-full bg-white px-4 py-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              className="items-center justify-center px-4 py-2"
            >
              <FluentEmoji
                name={tab.icon}
                size={tab.iconSize || 24}
                style={{
                  opacity: activeTab === tab.id ? 1 : 0.5,
                }}
              />
              <Text
                className={`mt-1 text-xs font-medium ${
                  activeTab === tab.id ? 'text-primary' : 'text-foreground-tertiary'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Desktop/Tablet: Top navigation
  return (
    <View className="border-b border-border bg-background" style={{ paddingTop: insets.top }}>
      <View className="mx-auto flex-row items-center justify-center space-x-8 px-6 py-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className={`flex-row items-center space-x-2 rounded-full px-6 py-2 ${
              activeTab === tab.id ? 'bg-primary/10' : ''
            }`}
          >
            <FluentEmoji
              name={tab.icon}
              size={tab.iconSize || 20}
              style={{
                opacity: activeTab === tab.id ? 1 : 0.6,
              }}
            />
            <Text
              className={`text-sm font-medium ${
                activeTab === tab.id ? 'text-primary' : 'text-foreground-tertiary'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};