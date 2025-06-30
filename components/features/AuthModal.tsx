import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Platform, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.95);
  const modalOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      modalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withSpring(0.95, { damping: 20, stiffness: 300 });
      modalOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
    opacity: modalOpacity.value,
  }));

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = mode === 'signin' 
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      if (mode === 'signup') {
        Alert.alert('Success', 'Check your email to confirm your account!');
      }
      onClose();
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple') => {
    setLoading(true);
    const { error } = await signInWithProvider(provider);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        style={[
          backdropAnimatedStyle,
          {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          },
        ]}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            modalAnimatedStyle,
            {
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 32,
              width: '100%',
              maxWidth: 400,
            },
          ]}
          className="border border-border">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-foreground">
                {mode === 'signin' ? 'Welcome back' : 'Create account'}
              </Text>
              <Text className="mt-1 text-foreground-tertiary">
                {mode === 'signin' 
                  ? 'Sign in to your account' 
                  : 'Start building your collection'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <TablerIcon name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-foreground-secondary">
              Email
            </Text>
            <TextInput
              className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
              placeholder="you@example.com"
              placeholderTextColor="#a1a1aa"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-foreground-secondary">
              Password
            </Text>
            <TextInput
              className="rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#a1a1aa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`mb-4 items-center rounded-xl py-4 ${
              loading ? 'bg-zinc-200' : 'bg-accent'
            }`}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base font-medium text-accent-foreground">
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="mb-4 flex-row items-center">
            <View className="flex-1 border-b border-border" />
            <Text className="mx-4 text-sm text-foreground-tertiary">or</Text>
            <View className="flex-1 border-b border-border" />
          </View>

          {/* Social Login */}
          <View className="mb-6 gap-3">
            <TouchableOpacity
              onPress={() => handleSocialLogin('google')}
              disabled={loading}
              className="flex-row items-center justify-center rounded-xl border border-border bg-background py-3">
              <FluentEmoji name="Globe" size={20} />
              <Text className="ml-2 text-base font-medium text-foreground">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => handleSocialLogin('apple')}
                disabled={loading}
                className="flex-row items-center justify-center rounded-xl border border-border bg-background py-3">
                <FluentEmoji name="Heart" size={20} />
                <Text className="ml-2 text-base font-medium text-foreground">
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Toggle Mode */}
          <TouchableOpacity
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            disabled={loading}>
            <Text className="text-center text-sm text-foreground-tertiary">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <Text className="font-medium text-accent">Sign up</Text>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Text className="font-medium text-accent">Sign in</Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};