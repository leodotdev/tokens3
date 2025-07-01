import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatConversation, SavedSearch } from '../../lib/chat-storage';

interface ChatHistoryCardProps {
  onChatOpen: (conversation: ChatConversation) => void;
  onSearchOpen: (search: SavedSearch) => void;
}

export const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({
  onChatOpen,
  onSearchOpen,
}) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'chats' | 'searches'>('chats');
  
  // Mock data - replace with actual storage
  const mockChats: ChatConversation[] = [
    {
      id: '1',
      title: 'Gift ideas for mom',
      messages: [{ text: 'I need gift ideas for my mom who loves gardening', sender: 'user', timestamp: new Date() }],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: '2',
      title: 'Tech gadgets under $50',
      messages: [{ text: 'Show me cool tech gadgets under $50', sender: 'user', timestamp: new Date() }],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
  ];

  const mockSearches: SavedSearch[] = [
    {
      id: '1',
      query: 'wireless earbuds',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      resultCount: 42,
    },
    {
      id: '2',
      query: 'coffee maker',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      resultCount: 18,
    },
  ];

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <SparklesEmoji size={24} />
          <Text style={{ fontSize: 20, fontWeight: '600', color: colors.foreground }}>
            AI History
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <TouchableOpacity
          onPress={() => setActiveTab('chats')}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'chats' ? colors.accent : 'transparent',
          }}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: activeTab === 'chats' ? colors.accent : colors.foregroundSecondary,
          }}>
            Conversations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('searches')}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'searches' ? colors.accent : 'transparent',
          }}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: activeTab === 'searches' ? colors.accent : colors.foregroundSecondary,
          }}>
            Searches
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        {activeTab === 'chats' ? (
          <View>
            {mockChats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                onPress={() => onChatOpen(chat)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <TablerIcon name="message-circle" size={20} color={colors.foregroundMuted} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.foreground,
                    marginBottom: 4,
                  }}>
                    {chat.title || chat.messages[0]?.text.substring(0, 40) + '...'}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.foregroundSecondary,
                  }}>
                    {formatRelativeTime(chat.timestamp)}
                  </Text>
                </View>
                <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            {mockSearches.map((search) => (
              <TouchableOpacity
                key={search.id}
                onPress={() => onSearchOpen(search)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <TablerIcon name="search" size={20} color={colors.foregroundMuted} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.foreground,
                    marginBottom: 4,
                  }}>
                    {search.query}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.foregroundSecondary,
                  }}>
                    {search.resultCount} results • {formatRelativeTime(search.timestamp)}
                  </Text>
                </View>
                <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};