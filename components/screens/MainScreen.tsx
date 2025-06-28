import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Dimensions, useWindowDimensions } from 'react-native';
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
import { ProductActionOverlay } from '../features/ProductActionOverlay';

const CARD_MARGIN = 12;
const PADDING = 24;

export const MainScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const NUM_COLUMNS = width > 960 ? 4 : width > 500 ? 2 : 1;
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

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
            No results for "{searchQuery}"
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

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    
    const ids = Array.from(selectedIds);
    const { error } = await productQueries.deleteMany(ids);
    
    if (!error) {
      setSelectedIds(new Set());
      setSelectionMode(false);
      loadProducts();
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const openProductOverlay = (product: Product) => {
    setSelectedProduct(product);
    setOverlayVisible(true);
  };

  const closeProductOverlay = () => {
    setOverlayVisible(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={{ flex: 1, maxWidth: 960, alignSelf: 'center', width: '100%' }}>
      {/* Header with gentle animation */}
      <Animated.View style={[headerAnimatedStyle]} className="px-6 pb-6 pt-4">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900">Tokens</Text>
            <Text className="mt-1 text-gray-600">Your personal collection</Text>
          </View>
          <View className="flex-row items-center gap-4">
            {selectionMode ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setSelectionMode(false);
                    setSelectedIds(new Set());
                  }}>
                  <FluentEmoji name="Close" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteSelected}
                  disabled={selectedIds.size === 0}>
                  <FluentEmoji 
                    name="Delete" 
                    size={24} 
                    style={{ opacity: selectedIds.size === 0 ? 0.5 : 1 }}
                  />
                </TouchableOpacity>
                <Text className="text-sm font-medium text-gray-700">
                  {selectedIds.size} selected
                </Text>
              </>
            ) : (
              <ShoppingCartEmoji size={32} />
            )}
          </View>
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
            {products.length} result{products.length !== 1 ? 's' : ''} for "{searchQuery}"
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
            renderItem={({ item: product, index }) => {
              const containerWidth = Math.min(width, 960); // Respect max width
              const availableWidth = containerWidth - PADDING * 2;
              const itemWidth = NUM_COLUMNS === 1 
                ? availableWidth
                : (availableWidth - CARD_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
              
              return (
                <View style={{ width: itemWidth, marginBottom: CARD_MARGIN }}>
                  <ProductCard
                    product={product}
                    isSelected={selectedIds.has(product.id)}
                    selectionMode={selectionMode}
                    onPress={() => {
                      if (selectionMode) {
                        toggleSelection(product.id);
                      } else {
                        openProductOverlay(product);
                      }
                    }}
                    onLongPress={() => {
                      if (!selectionMode) {
                        setSelectionMode(true);
                        toggleSelection(product.id);
                      }
                    }}
                    onEdit={() => {
                      console.log('Edit product:', product.name);
                      // TODO: Navigate to edit screen or open modal
                    }}
                  />
                </View>
              );
            }}
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
          style={{
            height: 64,
            width: 64,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 32,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.24,
            shadowRadius: 16,
            elevation: 16,
          }}
          onPress={() => {
            // Add product action - will implement
            console.log('Add product pressed');
          }}>
          <FluentEmoji name="Plus" size={24} />
        </TouchableOpacity>
      </Animated.View>
      </View>

      {/* Product Action Overlay */}
      <ProductActionOverlay
        product={selectedProduct}
        visible={overlayVisible}
        onClose={closeProductOverlay}
      />
    </SafeAreaView>
  );
};
