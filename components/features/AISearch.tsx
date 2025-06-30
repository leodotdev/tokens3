import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { anthropicAI } from '../../lib/ai';
import { useAuth } from '../../contexts/AuthContext';
import debounce from 'lodash/debounce';

interface AISearchProps {
  onSearch: (query: string, aiEnhancement?: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const AISearch: React.FC<AISearchProps> = ({
  onSearch,
  placeholder = "AI-powered gift search...",
  autoFocus = false,
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleAISearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setAiSuggestions([]);
        return;
      }

      setIsAIProcessing(true);
      try {
        const enhancement = await anthropicAI.searchProducts(searchQuery, {
          person: user ? 'authenticated user' : 'anonymous',
        });
        
        setAiSuggestions(enhancement.searchTerms.slice(0, 3));
        onSearch(searchQuery, enhancement);
      } catch (error) {
        console.error('AI search enhancement failed:', error);
        // Fallback to regular search
        onSearch(searchQuery);
      } finally {
        setIsAIProcessing(false);
      }
    }, 500),
    [onSearch, user]
  );

  const handleQueryChange = (text: string) => {
    setQuery(text);
    handleAISearch(text);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setAiSuggestions([]);
  };

  return (
    <View className="mb-4">
      {/* Main Search Input */}
      <View className="flex-row items-center rounded-2xl bg-background-secondary">
        <View className="pl-4">
          {isAIProcessing ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : (
            <SparklesEmoji size={20} />
          )}
        </View>
        <TextInput
          className="flex-1 rounded-2xl bg-transparent px-3 py-3 text-foreground"
          placeholder={placeholder}
          placeholderTextColor="#a1a1aa"
          value={query}
          onChangeText={handleQueryChange}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery('');
              setAiSuggestions([]);
              onSearch('');
            }}
            className="pr-4"
          >
            <TablerIcon name="x" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <View className="mt-2 flex-row flex-wrap gap-2">
          <Text className="w-full text-xs font-medium text-foreground-tertiary">
            AI suggests:
          </Text>
          {aiSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSuggestionPress(suggestion)}
              className="rounded-full bg-primary/10 px-3 py-1"
            >
              <Text className="text-xs font-medium text-primary">
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};