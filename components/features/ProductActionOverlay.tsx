import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Linking, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import type { Product } from '../../lib/supabase';
import { FluentEmoji } from '../icons/FluentEmojiReal';

interface ProductActionOverlayProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
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
}) => {
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
      id: 'save',
      label: 'Quick save…',
      icon: 'Star',
      onPress: () => {
        onClose();
        console.log('Quick save:', product.name);
      },
    },
    {
      id: 'list',
      label: 'Add to list…',
      icon: 'Plus',
      onPress: () => {
        onClose();
        console.log('Add to list:', product.name);
      },
    },
    {
      id: 'remind',
      label: 'Remind me…',
      icon: 'Check',
      onPress: () => {
        onClose();
        console.log('Remind me:', product.name);
      },
    },
    {
      id: 'share',
      label: 'Share…',
      icon: 'Heart',
      onPress: () => {
        onClose();
        console.log('Share:', product.name);
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
                <Image
                  source={{ uri: product.image_url }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="cover"
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
