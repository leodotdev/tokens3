import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import type { Product, ProductInsert, ProductUpdate } from '../../lib/supabase';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useTheme } from '../../contexts/ThemeContext';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductInsert | ProductUpdate) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  autoFocus?: boolean;
}

const statusOptions = [
  { value: 'wishlist', label: 'Wishlist', icon: 'Heart' },
  { value: 'purchased', label: 'Purchased', icon: 'Check' },
  { value: 'considering', label: 'Considering', icon: 'Star' },
] as const;

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  autoFocus = true,
}) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || '',
    amazon_link: initialData?.amazon_link || '',
    image_url: initialData?.image_url || '',
    status: initialData?.status || 'wishlist',
    priority: initialData?.priority || 'medium',
    in_stock: initialData?.in_stock ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: ProductInsert | ProductUpdate = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category.trim() || null,
        amazon_link: formData.amazon_link.trim() || null,
        image_url: formData.image_url.trim() || null,
        status: formData.status as 'wishlist' | 'purchased' | 'considering',
        priority: formData.priority as 'low' | 'medium' | 'high',
        in_stock: formData.in_stock,
      };

      await onSubmit(submitData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 pb-2">
        {/* Form Title */}
        <View className="mb-6">
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground }}>
            {isEditing ? 'Edit Product' : 'Add Product'}
          </Text>
          <Text style={{ marginTop: 4, color: colors.foregroundSecondary }}>
            {isEditing ? 'Update product details' : 'Add a new product to your collection'}
          </Text>
        </View>

        {/* Amazon Link */}
        <View className="mb-4">
          <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
            Amazon Link
          </Text>
          <TextInput
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.foreground,
            }}
            placeholder="https://amazon.com/..."
            placeholderTextColor={colors.foregroundMuted}
            value={formData.amazon_link}
            onChangeText={(value) => updateFormData('amazon_link', value)}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={autoFocus}
          />
        </View>

        {/* Image URL */}
        <View className="mb-4">
          <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
            Image URL
          </Text>
          <TextInput
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.foreground,
            }}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={colors.foregroundMuted}
            value={formData.image_url}
            onChangeText={(value) => updateFormData('image_url', value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Product Name */}
        <View className="mb-4">
          <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
            Product Name <Text style={{ color: '#ef4444' }}>*</Text>
          </Text>
          <TextInput
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.foreground,
            }}
            placeholder="Enter product name"
            placeholderTextColor={colors.foregroundMuted}
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
            Description
          </Text>
          <TextInput
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.foreground,
            }}
            placeholder="Enter product description"
            placeholderTextColor={colors.foregroundMuted}
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Price and Category Row */}
        <View className="mb-4 flex-row gap-4">
          <View className="flex-1">
            <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
              Price
            </Text>
            <TextInput
              style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.foreground,
            }}
              placeholder="0.00"
              placeholderTextColor={colors.foregroundMuted}
              value={formData.price}
              onChangeText={(value) => updateFormData('price', value)}
              keyboardType="decimal-pad"
            />
          </View>
          <View className="flex-1">
            <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
              Category
            </Text>
            <TextInput
              style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.foreground,
            }}
              placeholder="e.g. Electronics"
              placeholderTextColor={colors.foregroundMuted}
              value={formData.category}
              onChangeText={(value) => updateFormData('category', value)}
            />
          </View>
        </View>

        {/* Status Selection */}
        <View className="mb-4">
          <Text style={{ marginBottom: 12, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
            Status
          </Text>
          <View className="flex-row gap-3">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => updateFormData('status', option.value)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 12,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderColor: formData.status === option.value
                    ? colors.accent
                    : colors.border,
                  backgroundColor: formData.status === option.value
                    ? colors.backgroundSecondary
                    : colors.background,
                }}>
                <FluentEmoji name={option.icon as any} size={20} />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 14,
                    fontWeight: '600',
                    color: formData.status === option.value
                      ? colors.accent
                      : colors.foregroundSecondary
                  }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Selection */}
        <View className="mb-4">
          <Text style={{ marginBottom: 12, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
            Priority
          </Text>
          <View className="flex-row gap-3">
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => updateFormData('priority', option.value)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderRadius: 12,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderColor: formData.priority === option.value
                    ? colors.accent
                    : colors.border,
                  backgroundColor: formData.priority === option.value
                    ? colors.backgroundSecondary
                    : colors.background,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: formData.priority === option.value
                      ? colors.accent
                      : colors.foregroundSecondary
                  }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* In Stock Toggle */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => updateFormData('in_stock', !formData.in_stock)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}>
            <FluentEmoji
              name={formData.in_stock ? 'CheckboxChecked' : 'CheckboxUnchecked'}
              size={24}
            />
            <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '600', color: colors.foreground }}>
              In Stock
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

      {/* Sticky Action Buttons */}
      <View style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
      }}>
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              alignItems: 'center',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
              paddingVertical: 16,
            }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foregroundSecondary }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            style={{
              flex: 1,
              alignItems: 'center',
              borderRadius: 12,
              paddingVertical: 16,
              backgroundColor: isSubmitting || !formData.name.trim()
                ? colors.foregroundMuted
                : colors.accent,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isSubmitting || !formData.name.trim()
                  ? colors.background
                  : colors.accentForeground,
              }}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};