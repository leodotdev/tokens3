import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, Platform, Keyboard, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { productQueries } from '../../lib/queries';
import type { Product, ProductUpdate } from '../../lib/supabase';
import { ProductForm } from './ProductForm';
import { TablerIcon } from '../icons/TablerIcon';

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onProductUpdated?: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onClose,
  onProductUpdated,
}) => {
  const backdropOpacity = useSharedValue(0);
  const modalTranslateY = useSharedValue(Platform.OS === 'web' ? 0 : 400);
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(Platform.OS === 'web' ? 0.95 : 1);
  
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    const dimensionsHandler = Dimensions.addEventListener('change', setScreenData);

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      dimensionsHandler?.remove();
    };
  }, []);

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

  const handleSubmit = async (data: ProductUpdate) => {
    if (!product?.id) return;
    
    const { error } = await productQueries.update(product.id, data);
    if (!error) {
      onProductUpdated?.();
      onClose();
    } else {
      throw new Error('Failed to update product');
    }
  };

  if (!product) return null;

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
              height: isWeb ? '80vh' : undefined,
              maxHeight: isWeb ? '80vh' : keyboardHeight > 0 ? screenData.height - keyboardHeight - 60 : '90%',
              maxWidth: isWeb ? 600 : undefined,
              width: isWeb ? '100%' : undefined,
              flex: isWeb ? undefined : 1,
              display: 'flex',
              flexDirection: 'column',
            },
          ]}
          className="border border-border">
          <View style={{ flex: 1, overflow: 'hidden' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-border px-6 py-4">
              <View className="flex-1" />
              <TouchableOpacity
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-background-secondary">
                <TablerIcon name="x" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isEditing={true}
              autoFocus={visible}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};