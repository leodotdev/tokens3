import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TablerIcon } from '../icons/TablerIcon';
import type { TablerIconName } from '../icons/TablerIcon';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeStyle, getThemeClassName } from '../../lib/theme-utils';

interface Tab {
  id: string;
  label: string;
  icon: TablerIconName;
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
  const { colors, cssClasses } = useTheme();
  const isMobile = width <= 500;
  const isWeb = Platform.OS === 'web';

  if (isMobile) {
    // Mobile: Fixed bottom tabs
    return (
      <View
        className={getThemeClassName(
          'absolute bottom-0 left-0 right-0 border-t',
          ['bg-background-secondary/90', 'border-border'],
          isWeb
        )}
        style={{ 
          ...(!isWeb && {
            backgroundColor: `${colors.backgroundSecondary}F0`,
            borderTopColor: colors.border
          }),
          paddingBottom: insets.bottom 
        }}
      >
        <View className="flex-row items-center justify-around py-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              className="items-center justify-center px-4 py-2"
            >
              <TablerIcon
                name={tab.icon}
                size={tab.iconSize || 24}
                color={activeTab === tab.id ? colors.accent : colors.foregroundMuted}
              />
              <Text
                className={getThemeClassName(
                  'mt-1 text-xs font-medium',
                  [activeTab === tab.id ? 'text-accent' : 'text-foreground-muted'],
                  isWeb
                )}
                style={{
                  ...(!isWeb && {
                    color: activeTab === tab.id ? colors.accent : colors.foregroundMuted
                  })
                }}
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
    <View 
      className={getThemeClassName(
        'border-b',
        ['bg-background-secondary/90', 'border-border'],
        isWeb
      )}
      style={{ 
        ...(!isWeb && {
          backgroundColor: `${colors.backgroundSecondary}F0`,
          borderBottomColor: colors.border
        }),
        paddingTop: insets.top 
      }}
    >
      <View className="mx-auto flex-row items-center justify-center gap-8 px-6 py-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className={getThemeClassName(
              'flex-row items-center gap-2 rounded-full px-6 py-2',
              [activeTab === tab.id ? 'bg-background-secondary' : 'bg-transparent'],
              isWeb
            )}
            style={{
              ...(!isWeb && {
                backgroundColor: activeTab === tab.id ? colors.backgroundSecondary : 'transparent'
              })
            }}
          >
            <TablerIcon
              name={tab.icon}
              size={tab.iconSize || 20}
              color={activeTab === tab.id ? colors.accent : colors.foregroundMuted}
            />
            <Text
              className={getThemeClassName(
                'text-sm font-medium',
                [activeTab === tab.id ? 'text-accent' : 'text-foreground-muted'],
                isWeb
              )}
              style={{
                ...(!isWeb && {
                  color: activeTab === tab.id ? colors.accent : colors.foregroundMuted
                })
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};