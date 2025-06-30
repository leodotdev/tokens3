import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClassName } from '../../lib/theme-utils';
import { anthropicAI } from '../../lib/ai';
import { peopleQueries, specialDatesQueries, productQueries } from '../../lib/queries';
import { ProductCard } from './ProductCard';
import type { Product, Person } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
  products?: Product[];
}

interface ChatAction {
  id: string;
  label: string;
  type: 'add_person' | 'create_event' | 'search_products' | 'ask_follow_up';
  data?: any;
}

interface AIChatInterfaceProps {
  placeholder?: string;
  initialPrompts?: string[];
  onProductsFound?: (products: Product[]) => void;
  compact?: boolean;
  isMobile?: boolean;
}

export const AIChatInterface: React.FC<AIChatInterfaceProps> = ({
  placeholder = "Ask AI anything: \"gifts for my mom\", \"add my sister Sarah\"...",
  initialPrompts = [
    "🎁 Gifts for my mom",
    "👨‍👩‍👧‍👦 Add my family members",
    "🎂 Upcoming birthdays this month",
    "💡 Gift ideas under $50",
    "🎄 Holiday gift planning"
  ],
  onProductsFound,
  compact = false,
  isMobile = false
}) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [aiAvailable, setAiAvailable] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, actions?: ChatAction[], products?: Product[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      actions,
      products
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    setInputText('');
    setShowPrompts(false);
    setIsLoading(true);

    // Add user message
    addMessage('user', messageText);

    try {
      // Process the message with AI
      const response = await processAIMessage(messageText);
      
      // Add AI response
      addMessage('assistant', response.content, response.actions, response.products);
      
      // Notify parent about products if any
      if (response.products && onProductsFound) {
        onProductsFound(response.products);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      addMessage('assistant', "I'm having trouble right now. Could you try rephrasing that?");
    } finally {
      setIsLoading(false);
    }
  };

  const processAIMessage = async (message: string): Promise<{
    content: string;
    actions?: ChatAction[];
    products?: Product[];
  }> => {
    try {
      // Get existing people and events for context
      let existingPeople: string[] = [];
      let recentEvents: string[] = [];
      
      if (user) {
        const { data: peopleData } = await peopleQueries.getAll(user.id);
        existingPeople = peopleData?.map(p => p.name) || [];
        
        const { data: eventsData } = await specialDatesQueries.getUpcoming(user.id, 30);
        recentEvents = eventsData?.map(e => e.name) || [];
      }

      // Build conversation history from messages
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Use the new conversation handler
      const aiResponse = await anthropicAI.handleConversation(message, {
        user_id: user?.id,
        existing_people: existingPeople,
        recent_events: recentEvents,
        conversation_history: conversationHistory
      });

      // Convert AI actions to ChatAction format
      const actions: ChatAction[] = aiResponse.actions.map((action, index) => ({
        id: `action_${Date.now()}_${index}`,
        label: action.label,
        type: action.type as any,
        data: action.data
      }));

      // Search for products if needed
      let products: Product[] = [];
      if (aiResponse.products_query) {
        const { data: productData } = await productQueries.search(aiResponse.products_query);
        products = productData?.slice(0, 6) || [];
      }

      return {
        content: aiResponse.response,
        actions,
        products
      };
    } catch (error) {
      console.error('AI conversation error:', error);
      setAiAvailable(false);
      
      // Check for specific API errors
      if (error.message?.includes('credit balance is too low')) {
        return {
          content: "I'm temporarily unavailable due to API limits. You can still browse our curated products and add people manually using the dashboard cards.",
          actions: [
            {
              id: 'browse_products',
              label: 'Browse Products',
              type: 'search_products',
              data: { query: 'all products' }
            }
          ]
        };
      }
      
      if (error.message?.includes('API error: 400')) {
        return {
          content: "I'm having trouble understanding that request. Try asking about specific gifts, people, or events.",
          actions: []
        };
      }
      
      return {
        content: "I'm having trouble right now. You can still browse products and use the manual add features on the dashboard.",
        actions: [
          {
            id: 'browse_products',
            label: 'Browse All Products',
            type: 'search_products',
            data: { query: 'all products' }
          }
        ]
      };
    }
  };

  const handleActionPress = async (action: ChatAction) => {
    switch (action.type) {
      case 'add_person':
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to add people to your profile.');
          return;
        }
        
        // Use AI to parse person details and create
        const personName = action.data?.name || 'this person';
        const relationshipHint = action.data?.relationship ? ` as your ${action.data.relationship}` : '';
        
        Alert.alert(
          'Add Person',
          `Add ${personName}${relationshipHint} to your profile?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Add Person', 
              onPress: () => handleSendMessage(`Please add ${personName}${relationshipHint} to my profile with their details`)
            }
          ]
        );
        break;
      
      case 'search_products':
        // Trigger product search - try AI first, fallback to direct search
        const query = action.data?.query || action.data?.category || 'products';
        
        if (query === 'all products') {
          // Direct product search without AI when AI is unavailable
          try {
            const { data: productData } = await productQueries.getAll({});
            if (productData && onProductsFound) {
              onProductsFound(productData.slice(0, 12));
              addMessage('assistant', `Here are our curated products. Browse through our collection of ${productData.length} high-quality, well-reviewed items.`, [], productData.slice(0, 6));
            }
          } catch (error) {
            addMessage('assistant', "Unable to load products right now. Please try again later.");
          }
        } else {
          handleSendMessage(`Show me ${query}`);
        }
        break;
      
      case 'create_event':
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to create events.');
          return;
        }
        
        const eventName = action.data?.name || 'event';
        const eventDate = action.data?.date ? ` on ${action.data.date}` : '';
        
        Alert.alert(
          'Create Event',
          `Create ${eventName}${eventDate}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Create Event', 
              onPress: () => handleSendMessage(`Please create ${eventName}${eventDate}`)
            }
          ]
        );
        break;
        
      case 'ask_follow_up':
        // Send the follow-up question directly
        if (action.data?.question) {
          handleSendMessage(action.data.question);
        }
        break;
    }
  };

  const handlePromptPress = async (prompt: string) => {
    // Try AI first, but provide fallback responses for common prompts
    try {
      await handleSendMessage(prompt);
    } catch (error) {
      // Fallback responses when AI is unavailable
      const fallbackResponses = {
        '🎁 Gift ideas for mom': {
          content: "Here are some popular gift ideas for moms: beautiful jewelry, cozy blankets, spa gift sets, gourmet tea collections, or personalized photo books. Browse our curated products below for more inspiration!",
          query: 'gifts for mom mother parent'
        },
        '🎁 Gifts for my mom': {
          content: "Here are some popular gift ideas for moms: beautiful jewelry, cozy blankets, spa gift sets, gourmet tea collections, or personalized photo books. Browse our curated products below for more inspiration!",
          query: 'gifts for mom mother parent'
        },
        '🎁 Great gifts for parents': {
          content: "Popular gifts for parents include: premium kitchen appliances, cozy home items, wellness products, gourmet food gifts, and tech gadgets that simplify life. Check out our curated selection!",
          query: 'gifts for parents'
        },
        '💝 Anniversary gifts under $100': {
          content: "Romantic anniversary gifts under $100: personalized jewelry, wine accessories, couples' experiences, beautiful home decor, or gourmet chocolate collections. Browse our affordable luxury options!",
          query: 'anniversary gifts under 100'
        }
      };

      const fallback = fallbackResponses[prompt];
      if (fallback) {
        addMessage('user', prompt);
        
        // Try to load relevant products
        try {
          const { data: productData } = await productQueries.search(fallback.query);
          const products = productData?.slice(0, 6) || [];
          addMessage('assistant', fallback.content, [
            {
              id: 'browse_more',
              label: 'Browse More Products',
              type: 'search_products',
              data: { query: 'all products' }
            }
          ], products);
          
          if (products.length > 0 && onProductsFound) {
            onProductsFound(products);
          }
        } catch (productError) {
          addMessage('assistant', fallback.content);
        }
      } else {
        addMessage('user', prompt);
        addMessage('assistant', "I'm temporarily unavailable. You can browse our curated products or use the manual features on the dashboard.", [
          {
            id: 'browse_products',
            label: 'Browse Products',
            type: 'search_products',
            data: { query: 'all products' }
          }
        ]);
      }
    }
  };

  const renderMessage = (message: ChatMessage) => (
    <Animated.View
      key={message.id}
      entering={FadeInUp.delay(100)}
      className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
    >
      <View
        className="max-w-[85%] rounded-2xl px-4 py-3 border"
        style={{
          backgroundColor: message.role === 'user' ? colors.accent : colors.backgroundSecondary,
          borderColor: message.role === 'user' ? colors.accent : colors.border,
          borderWidth: message.role === 'user' ? 0 : 1
        }}
      >
        <Text className="text-base" style={{
          color: message.role === 'user' ? colors.accentForeground : colors.foreground
        }}>
          {message.content}
        </Text>
      </View>

      {/* Action Buttons */}
      {message.actions && message.actions.length > 0 && (
        <View className="mt-2 flex-row flex-wrap gap-2">
          {message.actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleActionPress(action)}
              className="rounded-full px-3 py-2"
              style={{ backgroundColor: `${colors.accent}20` }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.accent }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Product Cards */}
      {message.products && message.products.length > 0 && (
        <View className="mt-3 w-full">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4 px-1">
              {message.products.map((product) => (
                <View key={product.id} className="w-50">
                  <ProductCard product={product} isHorizontal={false} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </Animated.View>
  );

  return (
    <View className={compact ? 'h-96' : 'flex-1'} style={{ backgroundColor: colors.background }}>
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isMobile && !compact ? 140 : 20 }}
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <Animated.View entering={FadeInDown.delay(100)} className="mb-6">
            <View className="items-center mb-6">
              <TablerIcon name="sparkles" size={48} color={colors.accent} />
              <Text className="mt-3 text-xl font-bold text-center" style={{ color: colors.foreground }}>
                Hi! I'm your AI gift assistant
              </Text>
              <Text className="mt-2 text-center" style={{ color: colors.foregroundSecondary }}>
                Ask me anything about gifts, people, or events
              </Text>
            </View>

            {/* Prompt Suggestions */}
            {showPrompts && (
              <View>
                <Text className="text-sm font-medium mb-3 px-1" style={{ color: colors.foregroundSecondary }}>
                  Try asking:
                </Text>
                <View className="gap-3">
                  {initialPrompts.map((prompt, index) => {
                    // Extract emoji and text
                    const emojiMatch = prompt.match(/^(\p{Emoji}+)\s+(.+)$/u);
                    const emoji = emojiMatch ? emojiMatch[1] : '';
                    const text = emojiMatch ? emojiMatch[2] : prompt;
                    
                    // Map Unicode emojis to Tabler icons
                    const getTablerIcon = (unicodeEmoji: string) => {
                      switch (unicodeEmoji) {
                        case '🎁': return <TablerIcon name="gift" size={20} color={colors.accent} />;
                        case '💝': return <TablerIcon name="heart" size={20} color={colors.accent} />;
                        case '🎓': return <TablerIcon name="school" size={20} color={colors.accent} />;
                        case '🏠': return <TablerIcon name="home" size={20} color={colors.accent} />;
                        case '🎂': return <TablerIcon name="cake" size={20} color={colors.accent} />;
                        default: return null;
                      }
                    };
                    
                    const tablerIcon = getTablerIcon(emoji);
                    
                    return (
                      <Animated.View key={prompt} entering={FadeInDown.delay(200 + index * 100)}>
                        <TouchableOpacity
                          onPress={() => handlePromptPress(prompt)}
                          className="rounded-xl px-4 py-3 border"
                          style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
                        >
                          <View className="flex-row items-center">
                            {tablerIcon && (
                              <View className="mr-3">
                                {tablerIcon}
                              </View>
                            )}
                            <Text style={{ 
                              fontSize: 16, 
                              fontWeight: '500',
                              color: colors.foreground,
                              flex: 1,
                            }}>
                              {text}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            )}
          </Animated.View>
        )}

        {/* Chat Messages */}
        {messages.map(renderMessage)}

        {/* Loading Indicator */}
        {isLoading && (
          <Animated.View entering={FadeInUp} className="items-start mb-4">
            <View className="rounded-2xl px-4 py-3 border" style={{ 
              backgroundColor: '#ffffff', 
              borderColor: '#e4e4e7',
              borderBottomLeftRadius: 6 
            }}>
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#6366f1" />
                <Text className="ml-2 text-foreground-secondary">
                  AI is thinking...
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View 
        className={getThemeClassName(
          'px-4 pt-3 pb-3 border-t',
          ['bg-background', 'border-border'],
          isWeb
        )}
        style={{
          ...(!isWeb && {
            backgroundColor: colors.background,
            borderColor: colors.border
          }),
          position: isMobile && !compact ? 'absolute' : 'relative',
          bottom: isMobile && !compact ? 48 + insets.bottom : 0, // Reduced from 56 to 48 to account for shorter nav bar
          left: 0,
          right: 0,
        }}
      >
        {!aiAvailable && (
          <View className="mb-3 flex-row items-center justify-center rounded-lg bg-orange-50 px-3 py-2">
            <TablerIcon name="alert-triangle" size={16} color="#c2410c" />
            <Text className="ml-2 text-sm text-orange-700">
              AI temporarily unavailable - using fallback responses
            </Text>
          </View>
        )}
        <View className="flex-row items-center rounded-2xl px-4 py-2" style={{ backgroundColor: colors.backgroundSecondary }}>
          <TablerIcon name={aiAvailable ? "sparkles" : "search"} size={20} color={colors.foregroundMuted} />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder={aiAvailable ? placeholder : "Browse products and use manual features..."}
            placeholderTextColor={colors.foregroundMuted}
            style={{ color: colors.foreground }}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage()}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="ml-2 p-2 rounded-full"
            style={{ backgroundColor: inputText.trim() ? '#3B82F6' : '#a1a1aa' }}
          >
            <TablerIcon name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};