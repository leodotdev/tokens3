import React, { useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { FluentEmoji, HeartEmoji, SparklesEmoji } from '../icons/FluentEmojiReal';
import { AuthModal } from '../features/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const About: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;
  const [authModalVisible, setAuthModalVisible] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background, paddingTop: isMobile ? insets.top : 0 }}>
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isMobile ? 80 : 0 }}
      >
        <View className="mx-auto w-full max-w-2xl px-6 py-8">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} className="flex-col items-center gap-6">
            <View className="flex-col items-center gap-4">
              <HeartEmoji size={60} />
              <View className="flex-col items-center gap-2">
                <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>About Tokens</Text>
                <Text className="text-center" style={{ color: colors.foregroundSecondary }}>
                  Making gift giving easier and more meaningful
                </Text>
              </View>
            </View>
            {!user && (
              <View className="w-full max-w-sm">
                <View className="flex-col gap-3">
                  <TouchableOpacity
                    onPress={() => setAuthModalVisible(true)}
                    className="w-full rounded-full py-4"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Text className="text-center text-base font-medium" style={{ color: colors.accentForeground }}>Sign In</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setAuthModalVisible(true)}
                    className="w-full rounded-full border py-4"
                    style={{ borderColor: colors.border }}
                  >
                    <Text className="text-center text-base font-medium" style={{ color: colors.foreground }}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Mission */}
          <Animated.View entering={FadeInDown.delay(200)} className="mb-8">
            <View className="rounded-2xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
              <View className="mb-4 flex-row items-center">
                <SparklesEmoji size={24} />
                <Text className="ml-2 text-xl font-bold" style={{ color: colors.foreground }}>Our Mission</Text>
              </View>
              <Text className="leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                We believe gift giving should be joyful, not stressful. Tokens helps you remember 
                the people you care about, track important dates, and find the perfect gifts - 
                all without the usual hassle.
              </Text>
            </View>
          </Animated.View>

          {/* How It Works */}
          <Animated.View entering={FadeInDown.delay(300)} className="mb-8">
            <Text className="mb-4 text-xl font-bold" style={{ color: colors.foreground }}>How It Works</Text>
            
            <View className="space-y-4">
              <View className="flex-row">
                <View className="mr-3 mt-1">
                  <TablerIcon name="user" size={20} color={colors.foregroundMuted} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: colors.foreground }}>Add Your People</Text>
                  <Text className="mt-1 text-sm" style={{ color: colors.foregroundSecondary }}>
                    Tell us about the special people in your life - their interests, important dates, 
                    and anything else that helps find perfect gifts.
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <View className="mr-3 mt-1">
                  <FluentEmoji name="Calendar" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: colors.foreground }}>Get Reminders</Text>
                  <Text className="mt-1 text-sm" style={{ color: colors.foregroundSecondary }}>
                    We'll remind you about birthdays, anniversaries, and special occasions - 
                    with enough time to find the perfect gift.
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <View className="mr-3 mt-1">
                  <FluentEmoji name="Gift" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold" style={{ color: colors.foreground }}>AI-Powered Suggestions</Text>
                  <Text className="mt-1 text-sm" style={{ color: colors.foregroundSecondary }}>
                    Get personalized gift ideas based on their interests, past gifts, and your budget - 
                    all powered by AI that learns what they love.
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Privacy Promise */}
          <Animated.View entering={FadeInDown.delay(400)} className="mb-8">
            <View className="rounded-2xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
              <View className="mb-4 flex-row items-center">
                <TablerIcon name="shield" size={24} color={colors.foregroundMuted} />
                <Text className="ml-2 text-xl font-bold" style={{ color: colors.foreground }}>Our Promise</Text>
              </View>
              <Text className="mb-3 leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                <Text className="font-semibold" style={{ color: colors.foreground }}>No ads. Ever.</Text> We hate ads as much as you do.
              </Text>
              <Text className="mb-3 leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                <Text className="font-semibold" style={{ color: colors.foreground }}>Your data stays yours.</Text> We never sell or share 
                your personal information. Period.
              </Text>
              <Text className="leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                <Text className="font-semibold" style={{ color: colors.foreground }}>Transparent business model.</Text> We make a small 
                commission from purchases through our affiliate links. That's it. No hidden agenda, 
                no data mining, just helping you find great gifts.
              </Text>
            </View>
          </Animated.View>

          {/* Future Vision */}
          <Animated.View entering={FadeInDown.delay(500)} className="mb-8">
            <Text className="mb-4 text-xl font-bold" style={{ color: colors.foreground }}>Coming Soon</Text>
            <View className="rounded-2xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.backgroundSecondary }}>
              <Text className="leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                Imagine getting a notification: "Mother's Day is in 2 weeks! Here are 5 perfect 
                gifts for Mary based on her love of travel and art" - with options already filtered 
                by your budget, excluding anything you've given before.
              </Text>
              <Text className="mt-4 text-sm font-medium" style={{ color: colors.accent }}>
                That's the future we're building. ✨
              </Text>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(600)} className="items-center pb-8">
            <Text className="text-sm" style={{ color: colors.foregroundSecondary }}>
              Made with 💜 for thoughtful gift givers everywhere
            </Text>
          </Animated.View>
        </View>
      </ScrollView>

      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />
    </View>
  );
};