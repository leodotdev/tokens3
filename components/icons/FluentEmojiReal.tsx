import React, { useState } from 'react';
import { Image, View, Text, Platform } from 'react-native';

// Real FluentUI emoji implementation using Microsoft's Fluent Emoji assets
type EmojiName =
  | 'ShoppingCart'
  | 'Sparkles'
  | 'Heart'
  | 'Star'
  | 'StarFilled'
  | 'Plus'
  | 'Search'
  | 'Filter'
  | 'Delete'
  | 'Edit'
  | 'Check'
  | 'CheckboxChecked'
  | 'CheckboxUnchecked'
  | 'Close'
  | 'ArrowRight'
  | 'Send'
  | 'Globe'
  | 'Person'
  | 'Calendar'
  | 'Gear'
  | 'Gift'
  | 'GraduationCap'
  | 'House'
  | 'Cake';

// Map our names to Fluent Emoji folder names (with spaces and proper capitalization)
const emojiAssetMap: Record<EmojiName, { folder: string; filename: string }> = {
  ShoppingCart: { folder: 'Shopping%20cart', filename: 'shopping_cart' },
  Sparkles: { folder: 'Sparkles', filename: 'sparkles' },
  Heart: { folder: 'Red%20heart', filename: 'red_heart' },
  Star: { folder: 'Star', filename: 'star' },
  Plus: { folder: 'Plus', filename: 'plus' },
  Search: { folder: 'Magnifying%20glass%20tilted%20left', filename: 'magnifying_glass_tilted_left' },
  Filter: { folder: 'Filter', filename: 'filter' },
  Delete: { folder: 'Wastebasket', filename: 'wastebasket' },
  Edit: { folder: 'Pencil', filename: 'pencil' },
  Check: { folder: 'Check%20mark', filename: 'check_mark' },
  CheckboxChecked: { folder: 'Check%20box%20with%20check', filename: 'check_box_with_check' },
  CheckboxUnchecked: { folder: 'White%20large%20square', filename: 'white_large_square' },
  Close: { folder: 'Cross%20mark', filename: 'cross_mark' },
  ArrowRight: { folder: 'Right%20arrow', filename: 'right_arrow' },
  StarFilled: { folder: 'Star', filename: 'star' },
  Send: { folder: 'Paper%20plane', filename: 'paper_plane' },
  Globe: { folder: 'Globe%20with%20meridians', filename: 'globe_with_meridians' },
  Person: { folder: 'Bust%20in%20silhouette', filename: 'bust_in_silhouette' },
  Calendar: { folder: 'Calendar', filename: 'calendar' },
  Gear: { folder: 'Gear', filename: 'gear' },
  Gift: { folder: 'Wrapped%20gift', filename: 'wrapped_gift' },
  GraduationCap: { folder: 'Graduation%20cap', filename: 'graduation_cap' },
  House: { folder: 'House', filename: 'house' },
  Cake: { folder: 'Birthday%20cake', filename: 'birthday_cake' },
};

// Unicode fallbacks for when images fail to load
const emojiFallbackMap: Record<EmojiName, string> = {
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
  CheckboxChecked: '☑️',
  CheckboxUnchecked: '☐',
  Close: '✖️',
  ArrowRight: '→',
  StarFilled: '⭐',
  Send: '📤',
  Globe: '🌐',
  Person: '👤',
  Calendar: '📅',
  Gear: '⚙️',
  Gift: '🎁',
  GraduationCap: '🎓',
  House: '🏠',
  Cake: '🎂',
};

interface FluentEmojiProps {
  name: EmojiName;
  size?: number;
  style?: any;
  variant?: '3D' | 'Color' | 'Flat' | 'High Contrast';
}

export const FluentEmoji: React.FC<FluentEmojiProps> = ({ 
  name, 
  size = 24, 
  style,
  variant = '3D' 
}) => {
  const [imageError, setImageError] = useState(false);
  const assetInfo = emojiAssetMap[name];
  const fallbackEmoji = emojiFallbackMap[name] || '⭐';
  
  // Construct URL to Fluent Emoji from GitHub CDN with correct format
  const getEmojiUrl = () => {
    if (!assetInfo) {
      console.warn(`FluentEmoji: No mapping found for emoji "${name}"`);
      return null;
    }
    const variantPath = variant.toLowerCase().replace(' ', '_');
    return `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${assetInfo.folder}/${variant}/${assetInfo.filename}_${variantPath}.png`;
  };

  const emojiUrl = getEmojiUrl();
  
  // If no asset mapping exists or image failed to load, show Unicode emoji fallback
  if (!emojiUrl || imageError) {
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
        <Text style={{ fontSize: size * 0.8, lineHeight: size }}>{fallbackEmoji}</Text>
      </View>
    );
  }

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
      <Image
        source={{ uri: emojiUrl }}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onError={() => setImageError(true)}
      />
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

export const PersonEmoji = (props: Omit<FluentEmojiProps, 'name'>) => (
  <FluentEmoji {...props} name="Person" />
);

export const CalendarEmoji = (props: Omit<FluentEmojiProps, 'name'>) => (
  <FluentEmoji {...props} name="Calendar" />
);

export const GearEmoji = (props: Omit<FluentEmojiProps, 'name'>) => (
  <FluentEmoji {...props} name="Gear" />
);