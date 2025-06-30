import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { AIChatInterface } from './AIChatInterface';

interface AIChatCardProps {
  onDataUpdate?: () => void;
}

export const AIChatCard: React.FC<AIChatCardProps> = ({ onDataUpdate }) => {
  const [showFullChat, setShowFullChat] = useState(false);

  const quickPrompts = [
    "🎁 Gift ideas for mom",
    "👨‍👩‍👧‍👦 Add my family",
    "🎂 This month's birthdays"
  ];

  const handlePromptPress = (prompt: string) => {
    setShowFullChat(true);
  };

  return (
    <>
      <Animated.View 
        entering={FadeInDown.delay(100)}
        className="rounded-2xl bg-background-secondary border border-border p-6 h-full"
      >
        <View className="mb-4 flex-row items-center">
          <SparklesEmoji size={24} />
          <Text className="ml-2 text-lg font-semibold text-foreground">
            AI Assistant
          </Text>
        </View>

        <Text className="mb-4 text-foreground-tertiary text-sm">
          Ask me anything about gifts, people, or events
        </Text>

        <View className="flex-1 space-y-3">
          {quickPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={prompt}
              onPress={() => handlePromptPress(prompt)}
              className="rounded-xl bg-gray-50 p-4 border-2 border-dashed border-gray-200"
            >
              <Text className="text-foreground font-medium text-sm">
                {prompt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setShowFullChat(true)}
          className="mt-4 flex-row items-center justify-center rounded-full bg-primary py-3"
        >
          <TablerIcon name="message" size={18} color="#FFFFFF" />
          <Text className="ml-2 font-medium text-white">
            Start AI Chat
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Full Screen Chat Modal */}
      <Modal
        visible={showFullChat}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
            <View className="flex-row items-center">
              <SparklesEmoji size={24} />
              <Text className="ml-2 text-lg font-semibold text-foreground">
                AI Gift Assistant
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowFullChat(false)}
              className="p-2 rounded-full bg-gray-100"
            >
              <TablerIcon name="x" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Chat Interface */}
          <AIChatInterface
            placeholder="Ask me about gifts, people, events..."
            initialPrompts={[
              "🎁 Find gifts for my mom who loves cooking",
              "👨‍👩‍👧‍👦 Add my sister Sarah, 32, birthday March 15th",
              "🎂 What birthdays are coming up?",
              "💝 Gift ideas under $100",
              "🎄 Plan holiday gifts for my family",
              "📅 Add my anniversary June 10th"
            ]}
            onProductsFound={() => {
              // Products found, could trigger navigation or update
              if (onDataUpdate) onDataUpdate();
            }}
          />
        </View>
      </Modal>
    </>
  );
};