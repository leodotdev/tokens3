import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TablerIcon } from '../icons/TablerIcon';
import { useTheme } from '../../contexts/ThemeContext';

interface EnhancedSearchPromptProps {
  onSearchPress: () => void;
  placeholder?: string;
}

export const EnhancedSearchPrompt: React.FC<EnhancedSearchPromptProps> = ({
  onSearchPress,
  placeholder = "Search for gifts, gadgets, or anything..."
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onSearchPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginVertical: 8,
      }}
    >
      <TablerIcon name="search" size={20} color={colors.foregroundMuted} />
      <Text 
        style={{
          flex: 1,
          marginLeft: 12,
          fontSize: 16,
          color: colors.foregroundMuted,
        }}
      >
        {placeholder}
      </Text>
      <View 
        style={{
          backgroundColor: colors.foregroundMuted,
          borderRadius: 12,
          padding: 8,
        }}
      >
        <TablerIcon name="sparkles" size={16} color={colors.background} />
      </View>
    </TouchableOpacity>
  );
};