import React from 'react';
import { View } from 'react-native';
// Note: react-fluentui-emoji might need different import structure
// Will be updated based on actual package structure

type EmojiName =
  | 'ShoppingCart'
  | 'Sparkles'
  | 'Heart'
  | 'Star'
  | 'Plus'
  | 'Search'
  | 'Filter'
  | 'Delete'
  | 'Edit'
  | 'Check';

interface FluentEmojiProps {
  name: EmojiName;
  size?: number;
  style?: any;
}

export const FluentEmoji: React.FC<FluentEmojiProps> = ({ name, size = 24, style }) => {
  // Temporary placeholder - will implement actual FluentUI emoji integration
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: '#f0f0f0',
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    />
  );
};

// Export commonly used emojis for easy access
export const ShoppingCartEmoji = (props: Omit<FluentEmojiProps, 'name'>) => (
  <FluentEmoji {...props} name="ShoppingCart" />
);

export const SparklesEmoji = (props: Omit<FluentEmojiProps, 'name'>) => (
  <FluentEmoji {...props} name="Sparkles" />
);

export const HeartEmoji = (props: Omit<FluentEmojiProps, 'name'>) => (
  <FluentEmoji {...props} name="Heart" />
);

export const StarEmoji = (props: Omit<FluentEmojiProps, 'name'>) => (
  <FluentEmoji {...props} name="Star" />
);
