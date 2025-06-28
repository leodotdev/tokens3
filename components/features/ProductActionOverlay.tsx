import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Linking, Platform, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import type { Product } from '../../lib/supabase';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';
import { bookmarkQueries, likeQueries } from '../../lib/queries';
import { WebImage } from '../ui/WebImage';

interface ProductActionOverlayProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  onAuthRequired?: () => void;
}

interface ActionItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

export const ProductActionOverlay: React.FC<ProductActionOverlayProps> = ({
  product,
  visible,
  onClose,
  onAuthRequired,
}) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const backdropOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(0.8);
  const overlayOpacity = useSharedValue(0);

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (visible) {
      // Entrance animation
      backdropOpacity.value = withTiming(1, { duration: 300 });
      overlayScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      overlayOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Exit animation
      backdropOpacity.value = withTiming(0, { duration: 200 });
      overlayScale.value = withSpring(0.8, { damping: 20, stiffness: 300 });
      overlayOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Load bookmark and like status when product changes
  useEffect(() => {
    if (product && user) {
      loadUserInteractions();
    }
  }, [product, user]);

  const loadUserInteractions = async () => {
    if (!product || !user) return;

    // Check bookmark status
    const { data: bookmarkData } = await bookmarkQueries.getByProduct(product.id, user.id);
    setIsBookmarked(!!bookmarkData);

    // Check like status
    const { data: likeData } = await likeQueries.getUserLike(product.id, user.id);
    setIsLiked(!!likeData);
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: overlayScale.value }],
    opacity: overlayOpacity.value,
  }));

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!product) return null;

  const handleBookmark = async () => {
    if (!user || !product) {
      onClose();
      onAuthRequired?.();
      return;
    }
    
    try {
      if (isBookmarked) {
        const { error } = await bookmarkQueries.delete(product.id, user.id);
        if (!error) {
          setIsBookmarked(false);
          Alert.alert('Removed', `${product.name} removed from bookmarks`);
        }
      } else {
        const { error } = await bookmarkQueries.create(product.id, user.id);
        if (!error) {
          setIsBookmarked(true);
          Alert.alert('Bookmarked!', `${product.name} added to bookmarks`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update bookmark');
    }
  };

  const handleLike = async () => {
    if (!user || !product) {
      onClose();
      onAuthRequired?.();
      return;
    }
    
    try {
      if (isLiked) {
        const { error } = await likeQueries.delete(product.id, user.id);
        if (!error) {
          setIsLiked(false);
        }
      } else {
        const { error } = await likeQueries.create(product.id, user.id);
        if (!error) {
          setIsLiked(true);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const actions: ActionItem[] = [
    {
      id: 'goto',
      label: 'Go to product',
      icon: 'Search',
      onPress: () => {
        onClose();
        if (product.amazon_link) {
          Linking.openURL(product.amazon_link);
        }
      },
    },
    {
      id: 'bookmark',
      label: isBookmarked ? 'Remove bookmark' : 'Bookmark',
      icon: isBookmarked ? 'StarFilled' : 'Star',
      onPress: handleBookmark,
    },
    {
      id: 'like',
      label: isLiked ? 'Unlike' : 'Like',
      icon: 'Heart',
      onPress: handleLike,
    },
    {
      id: 'list',
      label: 'Add to list…',
      icon: 'Plus',
      onPress: () => {
        if (!user) {
          onClose();
          onAuthRequired?.();
          return;
        }
        onClose();
        Alert.alert('Coming soon', 'Lists feature will be available soon!');
      },
    },
    {
      id: 'share',
      label: 'Share…',
      icon: 'Send',
      onPress: () => {
        onClose();
        // Could implement share functionality here
        Alert.alert('Share', `Check out ${product.name}!`);
      },
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View
        style={[
          backdropAnimatedStyle,
          {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          },
        ]}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Overlay Content */}
        <Animated.View
          style={[
            overlayAnimatedStyle,
            {
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 320,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 20,
              },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 20,
            },
          ]}>
          {/* Product Header */}
          <View className="mb-6 flex-row items-center">
            {product.image_url && (
              <View className="mr-4 overflow-hidden rounded-xl bg-background-secondary">
                <WebImage
                  source={{ uri: product.image_url }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="cover"
                  fallbackIcon="Package"
                  fallbackIconSize={30}
                />
              </View>
            )}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground" numberOfLines={2}>
                {product.name}
              </Text>
              {formatPrice(product.price) && (
                <Text className="mt-1 text-xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </Text>
              )}
              {product.category && (
                <Text className="mt-1 text-sm font-medium uppercase tracking-wide text-foreground-muted">
                  {product.category}
                </Text>
              )}
            </View>
          </View>

          {/* Actions List */}
          <View className="flex gap-2">
            {actions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                className="flex-row items-center rounded-xl px-4 py-4"
                style={{
                  backgroundColor: '#fafafa',
                }}>
                <View className="mr-4">
                  <FluentEmoji name={action.icon as any} size={24} />
                </View>
                <Text className="flex-1 text-base font-medium text-foreground">{action.label}</Text>
                <FluentEmoji name="ArrowRight" size={16} style={{ opacity: 0.5 }} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
