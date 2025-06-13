import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { productQueries } from '../../lib/queries';
import type { Product } from '../../lib/supabase';
import { FluentEmoji, SparklesEmoji, ShoppingCartEmoji } from '../icons/FluentEmojiReal';
import { ProductCard } from '../features/ProductCard';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const PADDING = 24;
const NUM_COLUMNS = width > 800 ? 3 : width > 500 ? 2 : 1;

export const MainScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Animation values
  const headerScale = useSharedValue(0);
  const listOpacity = useSharedValue(0);
  const fabScale = useSharedValue(0);

  const loadProducts = useCallback(async () => {
    try {
      const { data, error } = await productQueries.getAll({
        search: searchQuery || undefined,
      });

      if (!error && data) {
        setProducts(data);
        if (!searchQuery) {
          setAllProducts(data); // Store all products for reference
        }
      }
    } catch {
      console.log('Products will load when Supabase is configured');
      setProducts([]);
      setAllProducts([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadProducts();

    // Fluid entrance animations
    setTimeout(() => {
      headerScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, 100);

    setTimeout(() => {
      listOpacity.value = withTiming(1, { duration: 800 });
    }, 300);

    setTimeout(() => {
      fabScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, 600);
  }, [loadProducts, headerScale, listOpacity, fabScale]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [loadProducts]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(headerScale.value, [0, 1], [0.8, 1]),
      },
    ],
    opacity: headerScale.value,
  }));

  const listAnimatedStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(fabScale.value, [0, 1], [0, 1]),
      },
    ],
  }));

  const EmptyState = () => {
    const isSearching = searchQuery.length > 0;

    if (isSearching) {
      return (
        <View className="flex-1 items-center justify-center px-8">
          <FluentEmoji name="Search" size={60} />
          <Text className="mt-6 text-center text-xl font-semibold text-gray-700">
            No results for &ldquo;{searchQuery}&rdquo;
          </Text>
          <Text className="mt-2 text-center text-gray-600">
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-8">
        <SparklesEmoji size={80} />
        <Text className="mt-6 text-center text-2xl font-bold text-gray-800">
          Ready for something magical?
        </Text>
        <Text className="mt-3 text-center leading-6 text-gray-600">
          Add your first product and watch your collection come to life
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with gentle animation */}
      <Animated.View style={[headerAnimatedStyle]} className="px-6 pb-6 pt-4">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Tokens</Text>
            <Text className="mt-1 text-gray-600">Your personal collection</Text>
          </View>
          <ShoppingCartEmoji size={32} />
        </View>

        {/* Search with subtle focus animation */}
        <View className="flex-row items-center rounded-2xl bg-gray-50 px-4 py-3">
          <FluentEmoji name="Search" size={20} />
          <TextInput
            className="ml-3 flex-1 text-gray-900"
            placeholder="Search your collection..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Search Results Count */}
        {searchQuery && (
          <Text className="mt-2 text-sm text-gray-600">
            {products.length} result{products.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}
            &rdquo;
          </Text>
        )}
      </Animated.View>

      {/* Product List with fade-in */}
      <Animated.View style={[listAnimatedStyle, { flex: 1 }]}>
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={products}
            numColumns={NUM_COLUMNS}
            key={NUM_COLUMNS} // Force re-render on orientation change
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: PADDING,
              paddingBottom: 100, // Space for FAB
            }}
            columnWrapperStyle={
              NUM_COLUMNS > 1 ? { justifyContent: 'space-between' } : undefined
            }
            renderItem={({ item: product, index }) => (
              <Animated.View
                style={[
                  {
                    opacity: listOpacity,
                    transform: [
                      {
                        translateY: interpolate(listOpacity.value, [0, 1], [20, 0]),
                      },
                    ],
                  },
                  NUM_COLUMNS === 1
                    ? { width: '100%', marginBottom: CARD_MARGIN }
                    : {
                        width:
                          (width - PADDING * 2 - CARD_MARGIN * (NUM_COLUMNS - 1)) /
                          NUM_COLUMNS,
                        marginBottom: CARD_MARGIN,
                      },
                ]}>
                <ProductCard
                  product={product}
                  onLongPress={() => {
                    // Future: Select for bulk operations
                    console.log('Long pressed:', product.name);
                  }}
                />
              </Animated.View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </Animated.View>

      {/* Floating Action Button with spring animation */}
      <Animated.View
        style={[
          fabAnimatedStyle,
          {
            position: 'absolute',
            bottom: 30,
            right: 24,
          },
        ]}>
        <TouchableOpacity
          className="h-16 w-16 items-center justify-center rounded-full bg-blue-500 shadow-lg"
          onPress={() => {
            // Add product action - will implement
            console.log('Add product pressed');
          }}>
          <FluentEmoji name="Plus" size={24} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};
