import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { productQueries } from '../../lib/queries';
import { anthropicService } from '../../lib/ai/anthropic';
import type { Product } from '../../lib/supabase';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji, ShoppingCartEmoji } from '../icons/FluentEmojiReal';
import { ProductCard } from './ProductCard';
import { ProductActionOverlay } from './ProductActionOverlay';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';
import { AuthModal } from './AuthModal';
import { useAuth } from '../../contexts/AuthContext';

const CARD_MARGIN = 12;
const PADDING = 24;

interface ProductsSearchTabProps {
  isMobile?: boolean;
  showSearchInput?: boolean;
}

export const ProductsSearchTab: React.FC<ProductsSearchTabProps> = ({ isMobile = false, showSearchInput = true }) => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const NUM_COLUMNS = width > 960 ? 4 : width > 500 ? 2 : 1;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearchEnhancement, setAiSearchEnhancement] = useState<any>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Animation values
  const listOpacity = useSharedValue(0);
  const fabScale = useSharedValue(0);

  const loadProducts = useCallback(async () => {
    try {
      let searchParams: any = {};
      
      if (searchQuery) {
        // Use AI enhancement if available
        if (aiSearchEnhancement) {
          const enhancedQuery = aiSearchEnhancement.searchTerms?.join(' ') || searchQuery;
          searchParams.search = enhancedQuery;
        } else {
          searchParams.search = searchQuery;
        }
      }
      
      const { data, error } = await productQueries.getAll(searchParams);

      if (!error && data) {
        let productsData = data;
        
        // Apply AI-based sorting if we have enhancement data and user is authenticated
        if (aiSearchEnhancement && user) {
          // TODO: Sort by AI relevance score in future
        }
        
        setProducts(productsData);
        if (!searchQuery) {
          setAllProducts(productsData);
        }
      }
    } catch {
      console.log('Products will load when Supabase is configured');
      setProducts([]);
      setAllProducts([]);
    }
  }, [searchQuery, aiSearchEnhancement, user]);

  const handleSearchWithAI = useCallback(async (query: string) => {
    if (!query.trim()) {
      setAiSearchEnhancement(null);
      setAiSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingAI(true);
    try {
      // Get AI enhancement for search
      const enhancement = await anthropicService.enhanceProductSearch(query);
      setAiSearchEnhancement(enhancement);
      
      // Get AI suggestions for autocomplete
      const suggestions = await anthropicService.generateSearchSuggestions(query);
      setAiSuggestions(suggestions || []);
      setShowSuggestions(suggestions && suggestions.length > 0);
    } catch (error) {
      console.log('AI enhancement failed, using basic search');
      setAiSearchEnhancement(null);
      setAiSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingAI(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    // Entrance animations
    setTimeout(() => {
      listOpacity.value = withTiming(1, { duration: 800 });
    }, 100);

    setTimeout(() => {
      fabScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, 400);
  }, [loadProducts, listOpacity, fabScale]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
      handleSearchWithAI(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [loadProducts, handleSearchWithAI, searchQuery]);

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
          <TablerIcon name="search" size={60} color="#9CA3AF" />
          <Text className="mt-6 text-center text-xl font-semibold text-foreground-secondary">
            No results for "{searchQuery}"
          </Text>
          <Text className="mt-2 text-center text-foreground-tertiary">
            Try searching with different keywords
          </Text>
          {aiSuggestions.length > 0 && (
            <View className="mt-4">
              <Text className="text-sm font-medium text-foreground-secondary mb-2">
                Try these suggestions:
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 bg-primary/10 rounded-full"
                  >
                    <Text className="text-sm text-primary">{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-8">
        <SparklesEmoji size={80} />
        <Text className="mt-6 text-center text-2xl font-bold text-foreground">
          Discover amazing products
        </Text>
        <Text className="mt-3 text-center leading-6 text-foreground-tertiary">
          Search for gifts, gadgets, and everything in between
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
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setTimeout(() => setEditingProduct(null), 300);
  };

  const handleProductAdded = () => {
    loadProducts();
  };

  const handleProductUpdated = () => {
    loadProducts();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <View className="flex-1">
      {/* Search Section */}
      {showSearchInput && (
        <View className="px-6 pb-4">
        {/* Search Input with AI Enhancement */}
        <View className="relative">
          <View className="flex-row items-center bg-background-secondary rounded-xl px-4 py-3 border border-border">
            <TablerIcon name="search" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for gifts, gadgets, or anything..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-foreground text-base"
              onFocus={() => setShowSuggestions(aiSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {isLoadingAI && (
              <View className="ml-2">
                <TablerIcon name="loading" size={16} color="#9CA3AF" />
              </View>
            )}
          </View>

          {/* AI Suggestions Dropdown */}
          {showSuggestions && aiSuggestions.length > 0 && (
            <View className="absolute top-full left-0 right-0 mt-2 bg-background-secondary rounded-xl border border-border z-10">
              {aiSuggestions.slice(0, 5).map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  className={`px-4 py-3 flex-row items-center ${
                    index < aiSuggestions.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <SparklesEmoji size={16} style={{ marginRight: 12, opacity: 0.7 }} />
                  <Text className="text-foreground">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Selection Mode Controls */}
        {selectionMode && (
          <View className="flex-row items-center justify-between mt-4 px-4 py-3 bg-background-secondary rounded-xl">
            <Text className="text-sm font-medium text-foreground-secondary">
              {selectedIds.size} selected
            </Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => {
                  setSelectionMode(false);
                  setSelectedIds(new Set());
                }}>
                <TablerIcon name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteSelected}
                disabled={selectedIds.size === 0}>
                <TablerIcon 
                  name="trash" 
                  size={24} 
                  color={selectedIds.size === 0 ? '#D1D5DB' : '#EF4444'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search Results Count with AI Enhancement */}
        {searchQuery && (
          <View className="mt-3">
            <Text className="text-sm text-foreground-tertiary">
              {products.length} result{products.length !== 1 ? 's' : ''} for "{searchQuery}"
            </Text>
            {aiSearchEnhancement && (
              <Text className="mt-1 text-xs text-primary">
                ✨ Enhanced with AI suggestions
              </Text>
            )}
          </View>
        )}
        </View>
      )}

      {/* Product List */}
      <Animated.View style={[listAnimatedStyle, { flex: 1 }]}>
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={products}
            numColumns={NUM_COLUMNS}
            key={NUM_COLUMNS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: PADDING,
              paddingBottom: isMobile ? 80 : 100,
            }}
            columnWrapperStyle={
              NUM_COLUMNS > 1 ? { justifyContent: 'space-between' } : undefined
            }
            renderItem={({ item: product, index }) => {
              const containerWidth = Math.min(width, 960);
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
                    isHorizontal={NUM_COLUMNS === 1}
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
                      openEditModal(product);
                    }}
                  />
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        )}
      </Animated.View>

      {/* Floating Action Button */}
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
          className="h-16 w-16 items-center justify-center rounded-full bg-background border border-border"
          onPress={() => {
            setAddModalVisible(true);
          }}>
          <TablerIcon name="plus" size={24} color="#374151" />
        </TouchableOpacity>
      </Animated.View>

      {/* Modals */}
      <ProductActionOverlay
        product={selectedProduct}
        visible={overlayVisible}
        onClose={closeProductOverlay}
        onAuthRequired={() => setAuthModalVisible(true)}
      />

      <AddProductModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onProductAdded={handleProductAdded}
      />

      <EditProductModal
        visible={editModalVisible}
        product={editingProduct}
        onClose={closeEditModal}
        onProductUpdated={handleProductUpdated}
      />

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </View>
  );
};