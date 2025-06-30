import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthModal } from '../features/AuthModal';

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
  const { theme, setTheme, colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [themePickerVisible, setThemePickerVisible] = useState(false);

  const handleThemePress = () => {
    if (Platform.OS === 'web') {
      // For web, use custom picker
      setThemePickerVisible(!themePickerVisible);
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
    console.log('Setting theme to:', selectedTheme);
    setTheme(selectedTheme);
    setThemePickerVisible(false);
  };

  if (!user) {
    // Not signed in - show sign in interface
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background, paddingTop: isMobile ? insets.top : 0 }}>
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: isMobile ? 80 : 0 }}
        >
          <View className="mx-auto w-full max-w-md px-6 py-8">
            <View className="flex-col gap-8">
              <Animated.View entering={FadeInDown.delay(100)} className="flex-col items-center gap-4">
                <View className="h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: colors.backgroundSecondary }}>
                  <FluentEmoji name="Gear" size={48} />
                </View>
                
                <View className="flex-col items-center gap-2">
                  <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>Settings</Text>
                  <Text className="text-center" style={{ color: colors.foregroundSecondary }}>
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

              {/* Theme Section - Moved below sign-in buttons */}
              <View className="w-full">
                <View className="flex-col gap-4">
                  <Text className="text-xl font-bold" style={{ color: colors.foreground }}>Appearance</Text>
                  
                  <View className="rounded-2xl border" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                    <TouchableOpacity 
                      className="flex-row items-center justify-between px-6 py-4"
                      onPress={handleThemePress}
                    >
                      <View className="flex-row items-center gap-4">
                        <TablerIcon name={getThemeIcon(theme)} size={24} color="#a1a1aa" />
                        <Text className="text-lg" style={{ color: colors.foreground }}>Theme</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm" style={{ color: colors.foregroundSecondary }}>
                          {getThemeDisplayName(theme)}
                        </Text>
                        <TablerIcon name="chevron-right" size={20} color="#a1a1aa" />
                      </View>
                    </TouchableOpacity>
                    
                    {/* Custom Theme Picker for Web */}
                    {themePickerVisible && Platform.OS === 'web' && (
                      <View className="mt-2 border rounded-xl overflow-hidden relative z-50" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                        <TouchableOpacity
                          className="flex-row items-center justify-between px-6 py-3 border-b"
                          style={{ borderBottomColor: colors.border }}
                          onPress={() => handleThemeSelect('light')}
                        >
                          <View className="flex-row items-center gap-4">
                            <TablerIcon name="sun" size={20} color="#a1a1aa" />
                            <Text className="text-base" style={{ color: colors.foreground }}>Light</Text>
                          </View>
                          {theme === 'light' && <TablerIcon name="check" size={16} color="#3B82F6" />}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          className="flex-row items-center justify-between px-6 py-3 border-b"
                          style={{ borderBottomColor: colors.border }}
                          onPress={() => handleThemeSelect('dark')}
                        >
                          <View className="flex-row items-center gap-4">
                            <TablerIcon name="moon" size={20} color="#a1a1aa" />
                            <Text className="text-base" style={{ color: colors.foreground }}>Dark</Text>
                          </View>
                          {theme === 'dark' && <TablerIcon name="check" size={16} color="#3B82F6" />}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          className="flex-row items-center justify-between px-6 py-3"
                          onPress={() => handleThemeSelect('system')}
                        >
                          <View className="flex-row items-center gap-4">
                            <TablerIcon name="device-desktop" size={20} color="#a1a1aa" />
                            <Text className="text-base" style={{ color: colors.foreground }}>System</Text>
                          </View>
                          {theme === 'system' && <TablerIcon name="check" size={16} color="#3B82F6" />}
                        </TouchableOpacity>
                      </View>
                    )}
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
        
        {/* Overlay for theme picker */}
        {themePickerVisible && Platform.OS === 'web' && (
          <TouchableOpacity
            className="absolute inset-0 z-40"
            onPress={() => setThemePickerVisible(false)}
            style={{ backgroundColor: 'transparent' }}
          />
        )}
      </View>
    );
  }

  // Signed in - show user settings and options
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background, paddingTop: isMobile ? insets.top : 0 }}>
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isMobile ? 80 : 0 }}
      >
        <View className="mx-auto w-full max-w-2xl px-6 py-8">
          <View className="flex-col gap-8">
            {/* User Profile Header */}
            <Animated.View entering={FadeInDown.delay(100)} className="flex-col items-center gap-6">
              <View className="h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: colors.backgroundSecondary }}>
                <FluentEmoji name="Person" size={48} />
              </View>
              
              <View className="flex-col items-center gap-2">
                <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>
                  {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={{ color: colors.foregroundSecondary }}>{user.email}</Text>
              </View>
            </Animated.View>

            {/* Appearance Settings */}
            <Animated.View entering={FadeInDown.delay(200)} className="w-full">
              <View className="flex-col gap-4">
                <Text className="text-xl font-bold" style={{ color: colors.foreground }}>Appearance</Text>
                
                <View className="rounded-2xl border" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                  <TouchableOpacity 
                    className="flex-row items-center justify-between px-6 py-4"
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
                  
                  {/* Custom Theme Picker for Web */}
                  {themePickerVisible && Platform.OS === 'web' && (
                    <View className="mt-2 border rounded-xl overflow-hidden" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                      <TouchableOpacity
                        className="flex-row items-center justify-between px-6 py-3 border-b"
                        style={{ borderBottomColor: colors.border }}
                        onPress={() => handleThemeSelect('light')}
                      >
                        <View className="flex-row items-center gap-4">
                          <TablerIcon name="sun" size={20} color={colors.foregroundMuted} />
                          <Text className="text-base" style={{ color: colors.foreground }}>Light</Text>
                        </View>
                        {theme === 'light' && <TablerIcon name="check" size={16} color="#3B82F6" />}
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        className="flex-row items-center justify-between px-6 py-3 border-b"
                        style={{ borderBottomColor: colors.border }}
                        onPress={() => handleThemeSelect('dark')}
                      >
                        <View className="flex-row items-center gap-4">
                          <TablerIcon name="moon" size={20} color={colors.foregroundMuted} />
                          <Text className="text-base" style={{ color: colors.foreground }}>Dark</Text>
                        </View>
                        {theme === 'dark' && <TablerIcon name="check" size={16} color="#3B82F6" />}
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        className="flex-row items-center justify-between px-6 py-3"
                        onPress={() => handleThemeSelect('system')}
                      >
                        <View className="flex-row items-center gap-4">
                          <TablerIcon name="device-desktop" size={20} color={colors.foregroundMuted} />
                          <Text className="text-base" style={{ color: colors.foreground }}>System</Text>
                        </View>
                        {theme === 'system' && <TablerIcon name="check" size={16} color="#3B82F6" />}
                      </TouchableOpacity>
                    </View>
                  )}
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
                      <TablerIcon name="shield" size={24} color={colors.foregroundMuted} />
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
                className="w-full rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 py-4"
              >
                <View className="flex-row items-center justify-center gap-3">
                  <TablerIcon name="logout" size={24} color="#EF4444" />
                  <Text className="text-lg font-medium text-red-500">Sign Out</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
      
      {/* Overlay for theme picker */}
      {themePickerVisible && Platform.OS === 'web' && (
        <TouchableOpacity
          className="absolute inset-0"
          onPress={() => setThemePickerVisible(false)}
          style={{ backgroundColor: 'transparent' }}
        />
      )}
    </View>
  );
};