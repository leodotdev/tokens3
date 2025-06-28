import React, { useState } from 'react';
import { Image, View, Text, Platform } from 'react-native';

// Real FluentUI emoji implementation using Microsoft's Fluent Emoji assets
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
  | 'Check'
  | 'CheckboxChecked'
  | 'CheckboxUnchecked'
  | 'Close';

// Map our names to Fluent Emoji asset names
const emojiAssetMap: Record<EmojiName, string> = {
  ShoppingCart: 'shopping_cart',
  Sparkles: 'sparkles',
  Heart: 'red_heart',
  Star: 'star',
  Plus: 'plus',
  Search: 'magnifying_glass_tilted_left',
  Filter: 'filter',
  Delete: 'wastebasket',
  Edit: 'pencil',
  Check: 'check_mark',
  CheckboxChecked: 'check_box_with_check',
  CheckboxUnchecked: 'white_square_button',
  Close: 'cross_mark',
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
  const [imageLoading, setImageLoading] = useState(true);
  const assetName = emojiAssetMap[name];
  const fallbackEmoji = emojiFallbackMap[name] || '⭐';
  
  // On iOS, start with Unicode emoji for immediate display
  const shouldUseImage = Platform.OS !== 'ios' || !imageLoading;
  
  // Construct URL to Fluent Emoji from GitHub CDN
  const getEmojiUrl = () => {
    const variantPath = variant.toLowerCase().replace(' ', '_');
    return `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${assetName}/${variant}/${assetName}_${variantPath}.png`;
  };

  // If image failed to load or we're using fallback, show Unicode emoji
  if (imageError || !shouldUseImage) {
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
        {/* Hidden image to test loading on iOS */}
        {Platform.OS === 'ios' && imageLoading && (
          <Image
            source={{ uri: getEmojiUrl() }}
            style={{ width: 0, height: 0, position: 'absolute' }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageError(true)}
          />
        )}
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
        source={{ uri: getEmojiUrl() }}
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