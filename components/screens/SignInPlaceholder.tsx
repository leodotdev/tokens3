import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FluentEmoji, HeartEmoji, SparklesEmoji } from '../icons/FluentEmojiReal';

interface SignInPlaceholderProps {
  onSignIn: () => void;
}

export const SignInPlaceholder: React.FC<SignInPlaceholderProps> = ({ onSignIn }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: isMobile ? insets.top : 0 }}>
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={FadeInDown.delay(100)} className="items-center">
          <HeartEmoji size={80} />
          <Text className="mt-6 text-center text-3xl font-bold text-foreground">
            Your Personal Dashboard
          </Text>
          <Text className="mt-3 text-center leading-relaxed text-foreground-tertiary">
            Sign in to add people you care about, track special dates, and get AI-powered gift suggestions
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} className="mt-8 w-full max-w-sm space-y-4">
          <View className="flex-row items-center rounded-2xl bg-white p-4" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
            <FluentEmoji name="Person" size={24} />
            <Text className="ml-3 flex-1 text-sm text-foreground-secondary">
              Add people in your life with AI
            </Text>
          </View>

          <View className="flex-row items-center rounded-2xl bg-white p-4" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
            <FluentEmoji name="Calendar" size={24} />
            <Text className="ml-3 flex-1 text-sm text-foreground-secondary">
              Never miss important dates
            </Text>
          </View>

          <View className="flex-row items-center rounded-2xl bg-white p-4" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}>
            <SparklesEmoji size={24} />
            <Text className="ml-3 flex-1 text-sm text-foreground-secondary">
              Get perfect gift suggestions
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} className="mt-8 w-full max-w-sm">
          <TouchableOpacity
            onPress={onSignIn}
            className="flex-row items-center justify-center rounded-full bg-primary py-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <FluentEmoji name="StarFilled" size={20} />
            <Text className="ml-2 text-base font-semibold text-white">
              Get Started
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 text-center text-xs text-foreground-tertiary">
            No ads • No data selling • Just thoughtful gift giving
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};