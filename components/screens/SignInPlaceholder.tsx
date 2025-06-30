import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { FluentEmoji, HeartEmoji, SparklesEmoji, PersonEmoji, CalendarEmoji } from '../icons/FluentEmojiReal';
import { useTheme } from '../../contexts/ThemeContext';

interface SignInPlaceholderProps {
  onSignIn: () => void;
}

export const SignInPlaceholder: React.FC<SignInPlaceholderProps> = ({ onSignIn }) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className={`flex-1 justify-center px-8 ${isMobile ? 'pb-20' : ''}`}>
        <View className="flex-col items-center gap-12">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} className="flex-col items-center gap-6">
            <View className="flex-col items-center gap-4">
              <HeartEmoji size={80} />
              <Text className="text-center text-2xl font-bold" style={{ color: colors.foreground }}>
                Your Personal Dashboard
              </Text>
              <Text className="text-center leading-relaxed px-4" style={{ color: colors.foregroundSecondary }}>
                Sign in to add people you care about, track special dates, and get AI-powered gift suggestions
              </Text>
            </View>
          </Animated.View>

          {/* Features */}
          <Animated.View entering={FadeInDown.delay(200)} className="w-full max-w-md flex-col gap-3">
            {/* Feature 1 */}
            <View className="mb-3">
              <View className="flex-row items-center gap-3 rounded-2xl border p-4" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                <PersonEmoji size={24} />
                <Text className="flex-1 text-sm" style={{ color: colors.foreground }}>
                  Add people in your life with AI
                </Text>
              </View>
            </View>
            
            {/* Feature 2 */}
            <View className="mb-3">
              <View className="flex-row items-center gap-3 rounded-2xl border p-4" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                <CalendarEmoji size={24} />
                <Text className="flex-1 text-sm" style={{ color: colors.foreground }}>
                  Never miss important dates
                </Text>
              </View>
            </View>
            
            {/* Feature 3 */}
            <View className="mb-3">
              <View className="flex-row items-center gap-3 rounded-2xl border p-4" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
                <SparklesEmoji size={24} />
                <Text className="flex-1 text-sm" style={{ color: colors.foreground }}>
                  Get perfect gift suggestions
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* CTA */}
          <Animated.View entering={FadeInDown.delay(300)} className="w-full max-w-md flex-col gap-3">
            <TouchableOpacity
              onPress={onSignIn}
              className="w-full rounded-full py-4"
              style={{ backgroundColor: colors.accent }}
            >
              <Text className="text-center text-base font-medium" style={{ color: colors.accentForeground }}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onSignIn}
              className="w-full rounded-full border py-4"
              style={{ borderColor: colors.border }}
            >
              <Text className="text-center text-base font-medium" style={{ color: colors.foreground }}>Create Account</Text>
            </TouchableOpacity>
            
            <View className="mt-4">
              <Text className="text-center text-xs" style={{ color: colors.foregroundSecondary }}>
                No ads • No data selling • Just thoughtful gift giving
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};