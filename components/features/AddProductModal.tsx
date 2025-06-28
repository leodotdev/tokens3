import React, { useEffect } from 'react';
import { Modal, View, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { productQueries } from '../../lib/queries';
import type { ProductInsert } from '../../lib/supabase';
import { ProductForm } from './ProductForm';
import { FluentEmoji } from '../icons/FluentEmojiReal';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductAdded?: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onProductAdded,
}) => {
  const backdropOpacity = useSharedValue(0);
  const modalTranslateY = useSharedValue(Platform.OS === 'web' ? 0 : 400);
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(Platform.OS === 'web' ? 0.95 : 1);

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (visible) {
      // Entrance animation
      backdropOpacity.value = withTiming(1, { duration: 300 });
      if (isWeb) {
        modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      } else {
        modalTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
      modalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Exit animation
      backdropOpacity.value = withTiming(0, { duration: 200 });
      if (isWeb) {
        modalScale.value = withSpring(0.95, { damping: 20, stiffness: 300 });
      } else {
        modalTranslateY.value = withSpring(400, { damping: 20, stiffness: 300 });
      }
      modalOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, isWeb]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: modalTranslateY.value },
      { scale: modalScale.value },
    ],
    opacity: modalOpacity.value,
  }));

  const handleSubmit = async (data: ProductInsert) => {
    const { error } = await productQueries.create(data);
    if (!error) {
      onProductAdded?.();
      onClose();
    } else {
      throw new Error('Failed to add product');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View
        style={[
          backdropAnimatedStyle,
          {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: isWeb ? 'center' : 'flex-end',
            alignItems: isWeb ? 'center' : 'stretch',
            paddingHorizontal: isWeb ? 24 : 0,
          },
        ]}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Modal Content */}
        <Animated.View
          style={[
            modalAnimatedStyle,
            {
              backgroundColor: '#ffffff',
              borderRadius: isWeb ? 24 : 0,
              borderTopLeftRadius: isWeb ? 24 : 20,
              borderTopRightRadius: isWeb ? 24 : 20,
              minHeight: isWeb ? undefined : '50%',
              maxHeight: isWeb ? '80%' : '90%',
              maxWidth: isWeb ? 600 : undefined,
              width: isWeb ? '100%' : undefined,
              flex: isWeb ? 0 : 1,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: isWeb ? 0 : -10,
              },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 25,
            },
          ]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-border px-6 py-4">
              <View className="flex-1" />
              <TouchableOpacity
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-background-secondary">
                <FluentEmoji name="Close" size={16} />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ProductForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isEditing={false}
            />
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};