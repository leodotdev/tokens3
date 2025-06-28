import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import type { Product, ProductInsert, ProductUpdate } from '../../lib/supabase';
import { FluentEmoji } from '../icons/FluentEmojiReal';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductInsert | ProductUpdate) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
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
}) => {
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
          <Text className="text-2xl font-bold text-foreground">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </Text>
          <Text className="mt-1 text-foreground-tertiary">
            {isEditing ? 'Update product details' : 'Add a new product to your collection'}
          </Text>
        </View>

        {/* Product Name */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-foreground-secondary">
            Product Name *
          </Text>
          <TextInput
            className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
            placeholder="Enter product name"
            placeholderTextColor="#a1a1aa"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-foreground-secondary">
            Description
          </Text>
          <TextInput
            className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
            placeholder="Enter product description"
            placeholderTextColor="#a1a1aa"
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
            <Text className="mb-2 text-sm font-medium text-foreground-secondary">
              Price
            </Text>
            <TextInput
              className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
              placeholder="0.00"
              placeholderTextColor="#a1a1aa"
              value={formData.price}
              onChangeText={(value) => updateFormData('price', value)}
              keyboardType="decimal-pad"
            />
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-sm font-medium text-foreground-secondary">
              Category
            </Text>
            <TextInput
              className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
              placeholder="e.g. Electronics"
              placeholderTextColor="#a1a1aa"
              value={formData.category}
              onChangeText={(value) => updateFormData('category', value)}
            />
          </View>
        </View>

        {/* Status Selection */}
        <View className="mb-4">
          <Text className="mb-3 text-sm font-medium text-foreground-secondary">
            Status
          </Text>
          <View className="flex-row gap-3">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => updateFormData('status', option.value)}
                className={`flex-1 flex-row items-center rounded-xl border px-3 py-3 ${
                  formData.status === option.value
                    ? 'border-accent bg-accent-light'
                    : 'border-border bg-background'
                }`}>
                <FluentEmoji name={option.icon as any} size={20} />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    formData.status === option.value
                      ? 'text-accent-dark'
                      : 'text-foreground-tertiary'
                  }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority Selection */}
        <View className="mb-4">
          <Text className="mb-3 text-sm font-medium text-foreground-secondary">
            Priority
          </Text>
          <View className="flex-row gap-3">
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => updateFormData('priority', option.value)}
                className={`flex-1 items-center rounded-xl border px-3 py-3 ${
                  formData.priority === option.value
                    ? 'border-accent bg-accent-light'
                    : 'border-border bg-background'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    formData.priority === option.value
                      ? 'text-accent-dark'
                      : 'text-foreground-tertiary'
                  }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* In Stock Toggle */}
        <View className="mb-4">
          <TouchableOpacity
            onPress={() => updateFormData('in_stock', !formData.in_stock)}
            className="flex-row items-center rounded-xl border border-border bg-background px-4 py-3">
            <FluentEmoji
              name={formData.in_stock ? 'CheckboxChecked' : 'CheckboxUnchecked'}
              size={24}
            />
            <Text className="ml-3 text-base font-medium text-foreground">
              In Stock
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amazon Link */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-foreground-secondary">
            Amazon Link
          </Text>
          <TextInput
            className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
            placeholder="https://amazon.com/..."
            placeholderTextColor="#a1a1aa"
            value={formData.amazon_link}
            onChangeText={(value) => updateFormData('amazon_link', value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Image URL */}
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-foreground-secondary">
            Image URL
          </Text>
          <TextInput
            className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
            placeholder="https://example.com/image.jpg"
            placeholderTextColor="#a1a1aa"
            value={formData.image_url}
            onChangeText={(value) => updateFormData('image_url', value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        </View>
      </ScrollView>

      {/* Sticky Action Buttons */}
      <View className="border-t border-border bg-background p-6">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 items-center rounded-xl border border-border bg-background py-4">
            <Text className="text-base font-medium text-foreground-tertiary">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            className={`flex-1 items-center rounded-xl py-4 ${
              isSubmitting || !formData.name.trim()
                ? 'bg-zinc-200'
                : 'bg-accent'
            }`}>
            <Text
              className={`text-base font-medium ${
                isSubmitting || !formData.name.trim()
                  ? 'text-zinc-400'
                  : 'text-accent-foreground'
              }`}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};