import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FluentEmoji } from '../icons/FluentEmojiReal';

interface PlaceholderCardProps {
  title: string;
  icon: string;
  onPress?: () => void;
}

export const PlaceholderCard: React.FC<PlaceholderCardProps> = ({ 
  title, 
  icon, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-2xl bg-background-secondary p-6 h-full border-2 border-dashed border-border"
    >
      <View className="flex-1 items-center justify-center">
        <FluentEmoji name={icon} size={48} style={{ opacity: 0.3 }} />
        <Text className="mt-4 text-lg font-semibold text-gray-400">
          {title}
        </Text>
        <Text className="mt-2 text-sm text-gray-300 text-center">
          Coming soon
        </Text>
      </View>
    </TouchableOpacity>
  );
};