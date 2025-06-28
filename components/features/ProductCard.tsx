import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { Product } from '../../lib/supabase';
import { FluentEmoji, HeartEmoji, StarEmoji } from '../icons/FluentEmojiReal';
import { likeQueries } from '../../lib/queries';
import { useAuth } from '../../contexts/AuthContext';
import { WebImage } from '../ui/WebImage';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onLongPress?: () => void;
  onEdit?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onLongPress,
  onEdit,
  isSelected = false,
  selectionMode = false,
}) => {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    loadLikeData();
  }, [product.id, user]);

  const loadLikeData = async () => {
    // Get like count
    const { count } = await likeQueries.countByProduct(product.id);
    setLikeCount(count);

    // Check if current user liked it
    if (user) {
      const { data } = await likeQueries.getUserLike(product.id, user.id);
      setIsLiked(!!data);
    }
  };

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
    return null;
  };

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return null;
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
          backgroundColor: '#ffffff',
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? '#3b82f6' : '#e4e4e7',
        }}
        activeOpacity={0.9}>
        <View className="flex-row">
          {/* Image Section */}
          {product.image_url && (
            <View 
              className={`bg-background-secondary w-24 overflow-hidden rounded-l-2xl ${
                Platform.OS === 'web' ? 'h-full' : 'h-24'
              }`}
              style={Platform.OS === 'web' ? { alignSelf: 'stretch' } : undefined}
            >
              <WebImage
                source={{ uri: product.image_url }}
                className="h-full w-full"
                resizeMode="cover"
                fallbackIcon="Package"
                fallbackIconSize={40}
              />
            </View>
          )}

          {/* Content Section */}
          <View className="relative flex-1 p-4">
            {/* Edit button */}
            {!selectionMode && onEdit && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
                <FluentEmoji name="Edit" size={16} />
              </TouchableOpacity>
            )}

            {/* Selection checkbox */}
            {selectionMode && (
              <View className="absolute right-2 top-2 rounded-full bg-white/90 p-1">
                <FluentEmoji
                  name={isSelected ? 'CheckboxChecked' : 'CheckboxUnchecked'}
                  size={20}
                />
              </View>
            )}

            <View className="mb-1 flex-row items-start justify-between">
              <Text className="text-foreground flex-1 pr-8 text-sm font-semibold" numberOfLines={1}>
                {product.name}
              </Text>
              {getStatusEmoji() && <View className="ml-1">{getStatusEmoji()}</View>}
            </View>

            {product.description && (
              <Text className="text-foreground-tertiary mb-2 text-xs leading-4" numberOfLines={1}>
                {product.description}
              </Text>
            )}

            <View className="flex-row items-end justify-between">
              <View className="flex-1">
                {formatPrice(product.price) && (
                  <Text className="text-foreground text-sm font-bold">
                    {formatPrice(product.price)}
                  </Text>
                )}
                {product.category && (
                  <Text className="text-foreground-muted text-xs font-medium uppercase tracking-wide">
                    {product.category}
                  </Text>
                )}
              </View>

              <View className="flex-row items-center gap-2">
                {likeCount > 0 && (
                  <View className="flex-row items-center gap-1">
                    <HeartEmoji size={12} style={{ opacity: isLiked ? 1 : 0.5 }} />
                    <Text className="text-foreground-tertiary text-xs font-medium">
                      {likeCount}
                    </Text>
                  </View>
                )}

                {product.in_stock !== null && (
                  <View
                    className={`rounded-full px-2 py-0.5 ${
                      product.in_stock ? 'bg-success-light' : 'bg-error-light'
                    }`}>
                    <Text
                      className={`text-xs font-medium ${
                        product.in_stock ? 'text-success' : 'text-error'
                      }`}>
                      {product.in_stock ? 'In Stock' : 'Out'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
