import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { Product } from '../../lib/supabase';
import { FluentEmoji, HeartEmoji, StarEmoji } from '../icons/FluentEmojiReal';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onLongPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (product.amazon_link) {
      // Open Amazon link with gentle feedback
      opacity.value = withTiming(0.7, { duration: 100 });
      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 200 });
        Linking.openURL(product.amazon_link!);
      }, 100);
    }
  };

  const getStatusEmoji = () => {
    if (product.status === 'wishlist') return <HeartEmoji size={16} />;
    if (product.status === 'purchased') return <FluentEmoji name="Check" size={16} />;
    if (product.in_stock === false) return <FluentEmoji name="Delete" size={16} />;
    return <StarEmoji size={16} />;
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          marginBottom: 16,
          overflow: 'hidden',
          borderRadius: 16,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
        activeOpacity={0.9}>
        {product.image_url && (
          <View className="w-full overflow-hidden rounded-t-2xl bg-gray-100" style={{ aspectRatio: 1 }}>
            <Image
              source={{ uri: product.image_url }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="p-4">
          <View className="mb-2 flex-row items-start justify-between">
            <Text className="flex-1 text-base font-semibold text-gray-900" numberOfLines={2}>
              {product.name}
            </Text>
            <View className="ml-2">{getStatusEmoji()}</View>
          </View>

          {product.description && (
            <Text className="mb-3 text-sm leading-5 text-gray-600" numberOfLines={2}>
              {product.description}
            </Text>
          )}

          <View className="flex-row items-center justify-between">
            <View>
              {product.price && (
                <Text className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </Text>
              )}
              {product.category && (
                <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {product.category}
                </Text>
              )}
            </View>

            {product.in_stock !== null && (
              <View
                className={`rounded-full px-3 py-1 ${
                  product.in_stock ? 'bg-green-100' : 'bg-red-100'
                }`}>
                <Text
                  className={`text-xs font-medium ${
                    product.in_stock ? 'text-green-800' : 'text-red-800'
                  }`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
