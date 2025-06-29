import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FluentEmoji, HeartEmoji, SparklesEmoji } from '../icons/FluentEmojiReal';

export const About: React.FC = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: isMobile ? insets.top : 0 }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-2xl px-6 py-8">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} className="mb-8 items-center">
            <HeartEmoji size={60} />
            <Text className="mt-4 text-3xl font-bold text-foreground">About Tokens</Text>
            <Text className="mt-2 text-center text-foreground-tertiary">
              Making gift giving easier and more meaningful
            </Text>
          </Animated.View>

          {/* Mission */}
          <Animated.View entering={FadeInDown.delay(200)} className="mb-8">
            <View className="rounded-2xl bg-white p-6" style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}>
              <View className="mb-4 flex-row items-center">
                <SparklesEmoji size={24} />
                <Text className="ml-2 text-xl font-bold text-foreground">Our Mission</Text>
              </View>
              <Text className="leading-relaxed text-foreground-secondary">
                We believe gift giving should be joyful, not stressful. Tokens helps you remember 
                the people you care about, track important dates, and find the perfect gifts - 
                all without the usual hassle.
              </Text>
            </View>
          </Animated.View>

          {/* How It Works */}
          <Animated.View entering={FadeInDown.delay(300)} className="mb-8">
            <Text className="mb-4 text-xl font-bold text-foreground">How It Works</Text>
            
            <View className="space-y-4">
              <View className="flex-row">
                <View className="mr-3 mt-1">
                  <FluentEmoji name="Person" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Add Your People</Text>
                  <Text className="mt-1 text-sm text-foreground-tertiary">
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
                  <Text className="font-semibold text-foreground">Get Reminders</Text>
                  <Text className="mt-1 text-sm text-foreground-tertiary">
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
                  <Text className="font-semibold text-foreground">AI-Powered Suggestions</Text>
                  <Text className="mt-1 text-sm text-foreground-tertiary">
                    Get personalized gift ideas based on their interests, past gifts, and your budget - 
                    all powered by AI that learns what they love.
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Privacy Promise */}
          <Animated.View entering={FadeInDown.delay(400)} className="mb-8">
            <View className="rounded-2xl bg-primary/5 p-6">
              <View className="mb-4 flex-row items-center">
                <FluentEmoji name="Lock" size={24} />
                <Text className="ml-2 text-xl font-bold text-foreground">Our Promise</Text>
              </View>
              <Text className="mb-3 leading-relaxed text-foreground-secondary">
                <Text className="font-semibold">No ads. Ever.</Text> We hate ads as much as you do.
              </Text>
              <Text className="mb-3 leading-relaxed text-foreground-secondary">
                <Text className="font-semibold">Your data stays yours.</Text> We never sell or share 
                your personal information. Period.
              </Text>
              <Text className="leading-relaxed text-foreground-secondary">
                <Text className="font-semibold">Transparent business model.</Text> We make a small 
                commission from purchases through our affiliate links. That's it. No hidden agenda, 
                no data mining, just helping you find great gifts.
              </Text>
            </View>
          </Animated.View>

          {/* Future Vision */}
          <Animated.View entering={FadeInDown.delay(500)} className="mb-8">
            <Text className="mb-4 text-xl font-bold text-foreground">Coming Soon</Text>
            <View className="rounded-2xl border border-border bg-white p-6">
              <Text className="leading-relaxed text-foreground-secondary">
                Imagine getting a notification: "Mother's Day is in 2 weeks! Here are 5 perfect 
                gifts for Mary based on her love of travel and art" - with options already filtered 
                by your budget, excluding anything you've given before.
              </Text>
              <Text className="mt-4 text-sm font-medium text-primary">
                That's the future we're building. ✨
              </Text>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(600)} className="items-center pb-8">
            <Text className="text-sm text-foreground-tertiary">
              Made with 💜 for thoughtful gift givers everywhere
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};