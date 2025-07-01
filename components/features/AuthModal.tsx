import React, { useState, useEffect, useRef } from 'react';
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
import { useTheme } from '../../contexts/ThemeContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const { colors } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef<TextInput>(null);
  
  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.95);
  const modalOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      modalOpacity.value = withTiming(1, { duration: 300 });
      
      // Focus email input after modal animation completes
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 400);
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
              backgroundColor: colors.background,
              borderRadius: 24,
              padding: 32,
              width: '100%',
              maxWidth: 400,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}>
          {/* Header */}
          <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground }}>
                {mode === 'signin' ? 'Welcome back' : 'Create account'}
              </Text>
              <Text style={{ marginTop: 4, color: colors.foregroundSecondary }}>
                {mode === 'signin' 
                  ? 'Sign in to your account' 
                  : 'Start building your collection'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <TablerIcon name="x" size={24} color={colors.foregroundMuted} />
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
              Email
            </Text>
            <TextInput
              ref={emailInputRef}
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.backgroundSecondary,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.foreground,
              }}
              placeholder="you@example.com"
              placeholderTextColor={colors.foregroundMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!loading}
              autoFocus={false}
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: '600', color: colors.foregroundSecondary }}>
              Password
            </Text>
            <TextInput
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.backgroundSecondary,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.foreground,
              }}
              placeholder="••••••••"
              placeholderTextColor={colors.foregroundMuted}
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
            style={{
              marginBottom: 16,
              alignItems: 'center',
              borderRadius: 12,
              paddingVertical: 16,
              backgroundColor: loading ? colors.foregroundMuted : colors.accent,
            }}>
            {loading ? (
              <ActivityIndicator color={colors.accentForeground} />
            ) : (
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.accentForeground,
              }}>
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: colors.border }} />
            <Text style={{ marginHorizontal: 16, fontSize: 14, color: colors.foregroundSecondary }}>or</Text>
            <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: colors.border }} />
          </View>

          {/* Social Login */}
          <View style={{ marginBottom: 24, gap: 12 }}>
            <TouchableOpacity
              onPress={() => handleSocialLogin('google')}
              disabled={loading}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.backgroundSecondary,
                paddingVertical: 12,
              }}>
              <FluentEmoji name="Globe" size={20} />
              <Text style={{
                marginLeft: 8,
                fontSize: 16,
                fontWeight: '600',
                color: colors.foreground,
              }}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => handleSocialLogin('apple')}
                disabled={loading}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundSecondary,
                  paddingVertical: 12,
                }}>
                <FluentEmoji name="Heart" size={20} />
                <Text style={{
                  marginLeft: 8,
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.foreground,
                }}>
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Toggle Mode */}
          <TouchableOpacity
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            disabled={loading}>
            <Text style={{ textAlign: 'center', fontSize: 14, color: colors.foregroundSecondary }}>
              {mode === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <Text style={{ fontWeight: '600', color: colors.accent }}>Sign up</Text>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Text style={{ fontWeight: '600', color: colors.accent }}>Sign in</Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};