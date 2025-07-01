import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable, useWindowDimensions, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClassName } from '../../lib/theme-utils';
import { AuthModal } from '../features/AuthModal';
import { ChatHistoryCard } from '../features/ChatHistoryCard';
import { InlineChatInterface } from '../features/InlineChatInterface';
import { ChatConversation, SavedSearch } from '../../lib/chat-storage';

const getThemeDisplayName = (theme: 'light' | 'dark' | 'system') => {
  switch (theme) {
    case 'light': return 'Light';
    case 'dark': return 'Dark';
    case 'system': return 'System';
  }
};

const getThemeIcon = (theme: 'light' | 'dark' | 'system') => {
  switch (theme) {
    case 'light': return 'sun';
    case 'dark': return 'moon';
    case 'system': return 'device-desktop';
  }
};

export const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme, colors, actualTheme } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;
  const isWeb = Platform.OS === 'web';
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [themePickerVisible, setThemePickerVisible] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);

  const handleThemePress = () => {
    console.log('handleThemePress called, Platform.OS:', Platform.OS);
    console.log('Current themePickerVisible:', themePickerVisible);
    
    if (Platform.OS === 'web') {
      // For web, use custom picker
      const newVisible = !themePickerVisible;
      setThemePickerVisible(newVisible);
      console.log('Setting themePickerVisible to:', newVisible);
    } else {
      // For mobile, use Alert
      const options = [
        { 
          text: 'Light', 
          onPress: () => {
            console.log('Setting theme to light');
            setTheme('light');
          },
        },
        { 
          text: 'Dark', 
          onPress: () => {
            console.log('Setting theme to dark');
            setTheme('dark');
          },
        },
        { 
          text: 'System', 
          onPress: () => {
            console.log('Setting theme to system');
            setTheme('system');
          },
        },
        { text: 'Cancel', style: 'cancel' as const }
      ];

      Alert.alert('Choose Theme', 'Select your preferred theme', options);
    }
  };


  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'system') => {
    console.log('handleThemeSelect called with:', selectedTheme);
    console.log('Current theme:', theme);
    setTheme(selectedTheme);
    setThemePickerVisible(false);
    
    // Force re-render to ensure UI updates
    setTimeout(() => {
      console.log('Theme after setTheme:', theme);
    }, 100);
  };

  const handleChatOpen = (conversation: ChatConversation) => {
    setCurrentConversation(conversation);
    setShowChatInterface(true);
  };

  const handleSearchOpen = (search: SavedSearch) => {
    // Handle opening saved search - could navigate to products with search
    console.log('Opening saved search:', search);
  };

  const handleCloseChatInterface = () => {
    setShowChatInterface(false);
    setCurrentConversation(null);
  };

  if (!user) {
    // Not signed in - show sign in interface
    return (
      <View 
        className="flex-1 bg-background"
        style={{ 
          ...(isWeb ? {} : { backgroundColor: colors.background }),
          paddingTop: isMobile ? insets.top : 0 
        }}
      >
        {showChatInterface && currentConversation ? (
          // Full screen chat interface
          <InlineChatInterface
            initialMessage={currentConversation.messages[0]?.text || ''}
            onClose={handleCloseChatInterface}
            isMobile={isMobile}
            onProductsFound={(products) => {
              console.log('Products found:', products);
            }}
          />
        ) : (
          <>
            <ScrollView 
              className="flex-1" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: isMobile ? 80 : 20, flexGrow: 1 }}
            >
              <View className="mx-auto w-full max-w-md px-6 py-8">
                <View className="flex-col gap-8">
              <Animated.View entering={FadeInDown.delay(100)} className="flex-col items-center gap-4">
                <View 
                  className="h-24 w-24 items-center justify-center rounded-full bg-background-secondary"
                  style={isWeb ? {} : { backgroundColor: colors.backgroundSecondary }}
                >
                  <FluentEmoji name="Gear" size={48} />
                </View>
                
                <View className="flex-col items-center gap-2">
                  <Text 
                    className="text-3xl font-bold text-foreground"
                    style={isWeb ? {} : { color: colors.foreground }}
                  >
                    Settings
                  </Text>
                  <Text 
                    className="text-center text-foreground-secondary"
                    style={isWeb ? {} : { color: colors.foregroundSecondary }}
                  >
                    Customize your app experience and manage your account
                  </Text>
                </View>
              </Animated.View>
              
              <View className="flex-col gap-3">
                <TouchableOpacity
                  onPress={() => setAuthModalVisible(true)}
                  className="w-full rounded-full bg-blue-500 py-4"
                >
                  <Text className="text-center text-lg font-medium text-white">Sign In</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setAuthModalVisible(true)}
                  className="w-full rounded-full border py-4"
                  style={{ borderColor: colors.border }}
                >
                  <Text className="text-center text-lg font-medium" style={{ color: colors.foreground }}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Chat History Section */}
              <View className="w-full">
                <View style={{ height: 400 }}>
                  <ChatHistoryCard
                    onChatOpen={handleChatOpen}
                    onSearchOpen={handleSearchOpen}
                  />
                </View>
              </View>

              {/* Theme Section */}
              <View className="w-full">
                <View className="flex-col gap-4">
                  <Text 
                    className={getThemeClassName('text-xl font-bold', ['text-foreground'], isWeb)}
                    style={{ ...(!isWeb && { color: colors.foreground }) }}
                  >
                    Appearance
                  </Text>
                  
                  <View 
                    className={getThemeClassName(
                      'rounded-2xl border relative',
                      ['bg-background-secondary', 'border-border'],
                      isWeb
                    )}
                    style={{
                      ...(!isWeb && {
                        backgroundColor: colors.backgroundSecondary,
                        borderColor: colors.border
                      }),
                      position: 'relative'
                    }}
                  >
                    <TouchableOpacity 
                      className="flex-row items-center justify-between px-6 py-4 theme-button"
                      onPress={handleThemePress}
                    >
                      <View className="flex-row items-center gap-4">
                        <TablerIcon name={getThemeIcon(theme)} size={24} color="#a1a1aa" />
                        <Text 
                          className={getThemeClassName('text-lg', ['text-foreground'], isWeb)}
                          style={{ ...(!isWeb && { color: colors.foreground }) }}
                        >
                          Theme
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text 
                          className={getThemeClassName('text-sm', ['text-foreground-secondary'], isWeb)}
                          style={{ ...(!isWeb && { color: colors.foregroundSecondary }) }}
                        >
                          {getThemeDisplayName(theme)}
                        </Text>
                        <TablerIcon name="chevron-right" size={20} color="#a1a1aa" />
                      </View>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </View>
            </View>
          </View>
            </ScrollView>
            
            <AuthModal
              visible={authModalVisible}
              onClose={() => setAuthModalVisible(false)}
            />
            
          </>
        )}
      </View>
    );
  }

  // Signed in - show user settings and options
  return (
    <View 
      className={getThemeClassName('flex-1', ['bg-background'], isWeb)}
      style={{ 
        ...(!isWeb && { backgroundColor: colors.background }),
        paddingTop: isMobile ? insets.top : 0 
      }}
    >
      {showChatInterface && currentConversation ? (
        // Full screen chat interface
        <InlineChatInterface
          initialMessage={currentConversation.messages[0]?.text || ''}
          onClose={handleCloseChatInterface}
          isMobile={isMobile}
          onProductsFound={(products) => {
            console.log('Products found:', products);
          }}
        />
      ) : (
        <>
          <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: isMobile ? 80 : 20, flexGrow: 1 }}
          >
            <View className="mx-auto w-full max-w-2xl px-6 py-8">
              <View className="flex-col gap-8">
            {/* User Profile Header */}
            <Animated.View entering={FadeInDown.delay(100)} className="flex-col items-center gap-6">
              <View 
                className={getThemeClassName(
                  'h-24 w-24 items-center justify-center rounded-full',
                  ['bg-background-secondary'],
                  isWeb
                )}
                style={{
                  ...(!isWeb && { backgroundColor: colors.backgroundSecondary })
                }}
              >
                <FluentEmoji name="Person" size={48} />
              </View>
              
              <View className="flex-col items-center gap-2">
                <Text 
                  className={getThemeClassName('text-3xl font-bold', ['text-foreground'], isWeb)}
                  style={{ ...(!isWeb && { color: colors.foreground }) }}
                >
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                </Text>
                <Text 
                  className={getThemeClassName('', ['text-foreground-secondary'], isWeb)}
                  style={{ ...(!isWeb && { color: colors.foregroundSecondary }) }}
                >
                  {user.email}
                </Text>
              </View>
            </Animated.View>

            {/* Chat History Section */}
            <Animated.View entering={FadeInDown.delay(150)} className="w-full">
              <View style={{ height: 400 }}>
                <ChatHistoryCard
                  onChatOpen={handleChatOpen}
                  onSearchOpen={handleSearchOpen}
                />
              </View>
            </Animated.View>

            {/* Appearance Settings */}
            <Animated.View entering={FadeInDown.delay(200)} className="w-full">
              <View className="flex-col gap-4">
                <Text 
                  className={getThemeClassName('text-xl font-bold', ['text-foreground'], isWeb)}
                  style={{ ...(!isWeb && { color: colors.foreground }) }}
                >
                  Appearance
                </Text>
                
                <View 
                  className={getThemeClassName(
                    'rounded-2xl border relative',
                    ['bg-background-secondary', 'border-border'],
                    isWeb
                  )}
                  style={{
                    ...(!isWeb && {
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border
                    }),
                    position: 'relative'
                  }}
                >
                  <TouchableOpacity 
                    className="flex-row items-center justify-between px-6 py-4 theme-button"
                    onPress={handleThemePress}
                  >
                    <View className="flex-row items-center gap-4">
                      <TablerIcon name={getThemeIcon(theme)} size={24} color={colors.foregroundMuted} />
                      <Text className="text-lg" style={{ color: colors.foreground }}>Theme</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm" style={{ color: colors.foregroundSecondary }}>
                        {getThemeDisplayName(theme)}
                      </Text>
                      <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
                    </View>
                  </TouchableOpacity>
                  
                </View>
              </View>
            </Animated.View>


            {/* Account Settings */}
            <Animated.View entering={FadeInDown.delay(250)} className="w-full">
              <View className="flex-col gap-4">
                <Text className="text-xl font-bold" style={{ color: colors.foreground }}>Account</Text>
                
                <View className="rounded-2xl border" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                  <TouchableOpacity className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
                    <View className="flex-row items-center gap-4">
                      <FluentEmoji name="Gear" size={24} />
                      <Text className="text-lg" style={{ color: colors.foreground }}>Account Settings</Text>
                    </View>
                    <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
                    <View className="flex-row items-center gap-4">
                      <TablerIcon name="bell" size={24} color={colors.foregroundMuted} />
                      <Text className="text-lg" style={{ color: colors.foreground }}>Notifications</Text>
                    </View>
                    <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="flex-row items-center justify-between px-6 py-4">
                    <View className="flex-row items-center gap-4">
                      <TablerIcon name="lock" size={24} color={colors.foregroundMuted} />
                      <Text className="text-lg" style={{ color: colors.foreground }}>Privacy</Text>
                    </View>
                    <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Support */}
            <Animated.View entering={FadeInDown.delay(300)} className="w-full">
              <View className="flex-col gap-4">
                <Text className="text-xl font-bold" style={{ color: colors.foreground }}>Support</Text>
                
                <View className="rounded-2xl border" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                  <TouchableOpacity className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
                    <View className="flex-row items-center gap-4">
                      <TablerIcon name="help" size={24} color={colors.foregroundMuted} />
                      <Text className="text-lg" style={{ color: colors.foreground }}>Help & FAQ</Text>
                    </View>
                    <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
                    <View className="flex-row items-center gap-4">
                      <TablerIcon name="message" size={24} color={colors.foregroundMuted} />
                      <Text className="text-lg" style={{ color: colors.foreground }}>Contact Support</Text>
                    </View>
                    <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="flex-row items-center justify-between px-6 py-4">
                    <View className="flex-row items-center gap-4">
                      <TablerIcon name="star" size={24} color={colors.foregroundMuted} />
                      <Text className="text-lg" style={{ color: colors.foreground }}>Rate App</Text>
                    </View>
                    <TablerIcon name="chevron-right" size={20} color={colors.foregroundMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Sign Out */}
            <Animated.View entering={FadeInDown.delay(400)}>
              <TouchableOpacity
                onPress={signOut}
                style={{
                  width: '100%',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: actualTheme === 'dark' ? '#991b1b' : '#fecaca',
                  backgroundColor: actualTheme === 'dark' ? '#450a0a' : '#fef2f2',
                  paddingVertical: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <TablerIcon name="logout" size={24} color="#EF4444" />
                  <Text style={{ fontSize: 18, fontWeight: '500', color: '#EF4444' }}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
              </View>
            </View>
          </ScrollView>
          
        </>
      )}
      
      {/* Modal Theme Picker for Web */}
      {themePickerVisible && Platform.OS === 'web' && (
        <View 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onTouchStart={() => setThemePickerVisible(false)}
        >
          <View 
            style={{
              backgroundColor: colors.background,
              borderRadius: 12,
              padding: 0,
              margin: 20,
              maxWidth: 300,
              width: '100%',
              borderColor: colors.border,
              borderWidth: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20
            }}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border
              }}
              onPress={() => {
                console.log('Light theme pressed');
                setTheme('light');
                setThemePickerVisible(false);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TablerIcon name="sun" size={20} color={colors.foregroundMuted} />
                <Text style={{ color: colors.foreground, fontSize: 16 }}>Light</Text>
              </View>
              {theme === 'light' && <TablerIcon name="check" size={16} color="#3B82F6" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border
              }}
              onPress={() => {
                console.log('Dark theme pressed');
                setTheme('dark');
                setThemePickerVisible(false);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TablerIcon name="moon" size={20} color={colors.foregroundMuted} />
                <Text style={{ color: colors.foreground, fontSize: 16 }}>Dark</Text>
              </View>
              {theme === 'dark' && <TablerIcon name="check" size={16} color="#3B82F6" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16
              }}
              onPress={() => {
                console.log('System theme pressed');
                setTheme('system');
                setThemePickerVisible(false);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TablerIcon name="device-desktop" size={20} color={colors.foregroundMuted} />
                <Text style={{ color: colors.foreground, fontSize: 16 }}>System</Text>
              </View>
              {theme === 'system' && <TablerIcon name="check" size={16} color="#3B82F6" />}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};