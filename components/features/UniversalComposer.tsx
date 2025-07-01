import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatConversation } from '../../lib/chat-storage';
import { UnifiedCreationModal } from './UnifiedCreationModal';

interface UniversalComposerProps {
  isMobile: boolean;
  onChatStart: (conversation: ChatConversation) => void;
  onSearchSubmit: (query: string, filters?: any) => void;
  placeholder?: string;
  onEntityCreated?: (entity: any, type: 'person' | 'event' | 'list') => void;
}

export const UniversalComposer: React.FC<UniversalComposerProps> = ({
  isMobile,
  onChatStart,
  onSearchSubmit,
  onEntityCreated,
  placeholder = "Search or ask AI assistant..."
}) => {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [showAIMode, setShowAIMode] = useState(false);
  const [creationModalVisible, setCreationModalVisible] = useState(false);
  const [creationType, setCreationType] = useState<'person' | 'event' | 'list'>('person');

  const handleSubmit = () => {
    if (!query.trim()) return;

    if (showAIMode) {
      // Start AI chat
      const conversation: ChatConversation = {
        id: Date.now().toString(),
        messages: [{ text: query, sender: 'user', timestamp: new Date() }],
        timestamp: new Date(),
      };
      onChatStart(conversation);
    } else {
      // Submit search
      onSearchSubmit(query);
    }
    
    setQuery('');
  };

  const handleQuickCreate = (type: 'person' | 'event' | 'list') => {
    setCreationType(type);
    setCreationModalVisible(true);
  };

  const handleEntityCreated = (entity: any, type: 'person' | 'event' | 'list') => {
    onEntityCreated?.(entity, type);
    setCreationModalVisible(false);
  };

  const quickActions = [
    { id: 'person', icon: 'user', label: 'Person' },
    { id: 'event', icon: 'calendar', label: 'Event' },
    { id: 'list', icon: 'list', label: 'List' },
  ];

  return (
    <>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        {/* Quick Action Buttons */}
        <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 12,
            paddingHorizontal: 8,
          }}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleQuickCreate(action.id as 'person' | 'event' | 'list')}
              style={{
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: colors.backgroundSecondary,
                minWidth: 70,
              }}
            >
              <TablerIcon 
                name={action.icon as any} 
                size={20} 
                color={colors.foregroundSecondary} 
              />
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.foregroundSecondary,
                marginTop: 4,
              }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search/Chat Input */}
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <TablerIcon 
            name={showAIMode ? "sparkles" : "search"} 
            size={20} 
            color={colors.foregroundMuted} 
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor={colors.foregroundMuted}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: colors.foreground,
              paddingVertical: 4,
            }}
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity
            onPress={() => setShowAIMode(!showAIMode)}
            style={{
              marginLeft: 8,
              padding: 8,
              borderRadius: 8,
              backgroundColor: showAIMode ? colors.accent : 'transparent',
            }}
          >
            <SparklesEmoji size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Creation Modal */}
      <UnifiedCreationModal
        visible={creationModalVisible}
        onClose={() => setCreationModalVisible(false)}
        defaultType={creationType}
        onEntityCreated={handleEntityCreated}
      />
    </>
  );
};