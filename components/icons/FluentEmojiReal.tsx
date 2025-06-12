import React from 'react';
import { View, Text } from 'react-native';

// Real FluentUI emoji mapping - using Unicode emoji for now
// Will be enhanced with actual FluentUI emoji package later
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

const emojiMap: Record<EmojiName, string> = {
  ShoppingCart: '🛒',
  Sparkles: '✨',
  Heart: '❤️',
  Star: '⭐',
  Plus: '➕',
  Search: '🔍',
  Filter: '🔽',
  Delete: '🗑️',
  Edit: '✏️',
  Check: '✅',
};

interface FluentEmojiProps {
  name: EmojiName;
  size?: number;
  style?: any;
}

export const FluentEmoji: React.FC<FluentEmojiProps> = ({ name, size = 24, style }) => {
  const emoji = emojiMap[name] || '⭐';

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      <Text style={{ fontSize: size * 0.8, lineHeight: size }}>{emoji}</Text>
    </View>
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
