import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { useTheme } from '../../contexts/ThemeContext';
import type { Product } from '../../lib/supabase';

interface InlineChatInterfaceProps {
  initialMessage: string;
  onClose: () => void;
  isMobile: boolean;
  onProductsFound?: (products: Product[]) => void;
}

export const InlineChatInterface: React.FC<InlineChatInterfaceProps> = ({
  initialMessage,
  onClose,
  isMobile,
  onProductsFound,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([
    { text: initialMessage, sender: 'user' as const },
    { text: "I'll help you find the perfect products. What are you looking for?", sender: 'assistant' as const }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `I&apos;m searching for products related to "${input}". This feature is coming soon!`, 
        sender: 'assistant' 
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ 
        flex: 1,
        paddingTop: isMobile ? insets.top : 0,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <SparklesEmoji size={24} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
              AI Assistant
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <TablerIcon name="x" size={24} color={colors.foregroundMuted} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={{
                marginBottom: 16,
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <View style={{
                backgroundColor: message.sender === 'user' ? colors.accent : colors.backgroundSecondary,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 16,
                borderTopRightRadius: message.sender === 'user' ? 4 : 16,
                borderTopLeftRadius: message.sender === 'assistant' ? 4 : 16,
              }}>
                <Text style={{
                  color: message.sender === 'user' ? colors.accentForeground : colors.foreground,
                  fontSize: 16,
                }}>
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask me anything..."
              placeholderTextColor={colors.foregroundMuted}
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.foreground,
                paddingVertical: 4,
              }}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim()}
              style={{
                marginLeft: 8,
                opacity: input.trim() ? 1 : 0.5,
              }}
            >
              <TablerIcon name="send" size={20} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};