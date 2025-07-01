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
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClassName } from '../../lib/theme-utils';
import { WebImage } from '../ui/WebImage';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onLongPress?: () => void;
  onEdit?: () => void;
  isSelected?: boolean;
  selectionMode?: boolean;
  isHorizontal?: boolean;
  showAIIndicator?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onLongPress,
  onEdit,
  isSelected = false,
  selectionMode = false,
  isHorizontal = false,
  showAIIndicator = false,
}) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const isWeb = Platform.OS === 'web';

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

  if (isHorizontal) {
    // Horizontal layout for mobile (1 column)
    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={`mb-4 overflow-hidden rounded-2xl border bg-background ${isSelected ? 'border-blue-500' : 'border-border'}`}
          style={{
            backgroundColor: colors.background,
            borderColor: isSelected ? '#3b82f6' : colors.border
          }}
          activeOpacity={0.9}>
          <View className="flex-row">
            {/* Image Section */}
            {product.image_url && (
              <View 
                className="h-24 w-24 overflow-hidden rounded-l-2xl bg-background-secondary"
                style={{ backgroundColor: colors.backgroundSecondary }}
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
                  className="absolute right-2 top-2 rounded-full bg-background border border-border p-1.5"
                  style={{ backgroundColor: colors.background, borderColor: colors.border }}>
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
                <Text 
                  className="text-foreground flex-1 pr-8 text-sm font-semibold" 
                  style={{ color: colors.foreground }}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                {getStatusEmoji() && <View className="ml-1">{getStatusEmoji()}</View>}
              </View>

              {product.description && (
                <Text 
                  className="text-foreground-tertiary mb-2 text-xs leading-4" 
                  style={{ color: colors.foregroundSecondary }}
                  numberOfLines={1}
                >
                  {product.description}
                </Text>
              )}

              <View className="flex-row items-end justify-between">
                <View className="flex-1">
                  {formatPrice(product.price) && (
                    <Text 
                      className="text-foreground text-sm font-bold"
                      style={{ color: colors.foreground }}
                    >
                      {formatPrice(product.price)}
                    </Text>
                  )}
                  {product.category && (
                    <Text 
                      className="text-foreground-muted text-xs font-medium uppercase tracking-wide"
                      style={{ color: colors.foregroundMuted }}
                    >
                      {product.category}
                    </Text>
                  )}
                </View>

                <View className="flex-row items-center gap-2">
                  {likeCount > 0 && (
                    <View className="flex-row items-center gap-1">
                      <HeartEmoji size={12} style={{ opacity: isLiked ? 1 : 0.5 }} />
                      <Text 
                        className="text-foreground-tertiary text-xs font-medium"
                        style={{ color: colors.foregroundSecondary }}
                      >
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
  }

  // Vertical layout for tablets/desktop (multi-column)
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`overflow-hidden rounded-2xl border bg-background ${isSelected ? 'border-blue-500' : 'border-border'}`}
        style={{
          backgroundColor: colors.background,
          borderColor: isSelected ? '#3b82f6' : colors.border
        }}
        activeOpacity={0.9}>
        <View className="relative">
          {product.image_url && (
            <View 
              className="w-full overflow-hidden rounded-t-2xl bg-background-secondary"
              style={{
                aspectRatio: 1,
                backgroundColor: colors.backgroundSecondary
              }}
            >
              <WebImage
                source={{ uri: product.image_url }}
                className="h-full w-full"
                resizeMode="cover"
                fallbackIcon="Package"
                fallbackIconSize={60}
              />
            </View>
          )}
          
          {/* Edit button */}
          {!selectionMode && onEdit && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="absolute right-2 top-2 rounded-full bg-background border border-border p-2"
              style={{ backgroundColor: colors.background, borderColor: colors.border }}>
              <FluentEmoji name="Edit" size={20} />
            </TouchableOpacity>
          )}
          
          {/* Selection checkbox */}
          {selectionMode && (
            <View className="absolute right-2 top-2 rounded-full bg-white/90 p-2">
              <FluentEmoji 
                name={isSelected ? "CheckboxChecked" : "CheckboxUnchecked"} 
                size={24} 
              />
            </View>
          )}
        </View>

        <View className="p-4">
          <View className="mb-2 flex-row items-start justify-between">
            <Text 
              className="flex-1 text-base font-semibold text-foreground" 
              style={{ color: colors.foreground }}
              numberOfLines={2}
            >
              {product.name}
            </Text>
            {getStatusEmoji() && <View className="ml-2">{getStatusEmoji()}</View>}
          </View>

          {product.description && (
            <Text 
              className="mb-3 text-sm leading-5 text-foreground-tertiary" 
              style={{ color: colors.foregroundSecondary }}
              numberOfLines={2}
            >
              {product.description}
            </Text>
          )}

          <View className="flex-row items-center justify-between">
            <View>
              {formatPrice(product.price) && (
                <Text 
                  className="text-lg font-bold text-foreground"
                  style={{ color: colors.foreground }}
                >
                  {formatPrice(product.price)}
                </Text>
              )}
              {product.category && (
                <Text 
                  className="text-xs font-medium uppercase tracking-wide text-foreground-muted"
                  style={{ color: colors.foregroundMuted }}
                >
                  {product.category}
                </Text>
              )}
            </View>

            <View className="flex-row items-center gap-3">
              {likeCount > 0 && (
                <View className="flex-row items-center gap-1">
                  <HeartEmoji size={16} style={{ opacity: isLiked ? 1 : 0.5 }} />
                  <Text 
                    className="text-xs font-medium text-foreground-tertiary"
                    style={{ color: colors.foregroundSecondary }}
                  >
                    {likeCount}
                  </Text>
                </View>
              )}
              
              {product.in_stock !== null && (
                <View
                  className={`rounded-full px-3 py-1 ${
                    product.in_stock ? 'bg-success-light' : 'bg-error-light'
                  }`}>
                  <Text
                    className={`text-xs font-medium ${
                      product.in_stock ? 'text-success' : 'text-error'
                    }`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
