import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClassName } from '../../lib/theme-utils';
import { anthropicAI } from '../../lib/ai';

export const AITest: React.FC = () => {
  const { colors } = useTheme();
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const isWeb = Platform.OS === 'web';

  const testAIConnection = async () => {
    setTesting(true);
    try {
      const result = await anthropicAI.chat([
        { role: 'user', content: 'Say "AI is working!" if you can see this message.' }
      ], {
        maxTokens: 20,
        temperature: 0.1
      });
      
      setLastResult(result);
      Alert.alert('✅ AI Test Success', `Response: ${result}`);
    } catch (error) {
      console.error('AI Test Error:', error);
      setLastResult(`Error: ${error}`);
      Alert.alert('❌ AI Test Failed', `Error: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testPersonParsing = async () => {
    setTesting(true);
    try {
      const result = await anthropicAI.parsePerson(
        'Add my mom Sarah, 65 years old, born March 15th, loves gardening and cooking'
      );
      
      const resultText = JSON.stringify(result, null, 2);
      setLastResult(resultText);
      Alert.alert('✅ Person Parsing Success', resultText);
    } catch (error) {
      console.error('Person Parsing Error:', error);
      setLastResult(`Error: ${error}`);
      Alert.alert('❌ Person Parsing Failed', `Error: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <View
      className={getThemeClassName(
        'm-4 rounded-2xl border p-4',
        ['bg-background-secondary', 'border-border'],
        isWeb
      )}
      style={{
        ...(!isWeb && {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border
        })
      }}
    >
      <Text
        className={getThemeClassName(
          'mb-4 text-lg font-bold',
          ['text-foreground'],
          isWeb
        )}
        style={{
          ...(!isWeb && { color: colors.foreground })
        }}
      >
        🤖 AI Debug Panel
      </Text>
      
      <View className="mb-4 space-y-2">
        <TouchableOpacity
          onPress={testAIConnection}
          disabled={testing}
          className={`rounded-xl py-3 px-4 ${testing ? 'bg-gray-200' : 'bg-blue-500'}`}
        >
          <Text className={`text-center font-medium ${testing ? 'text-gray-500' : 'text-white'}`}>
            {testing ? 'Testing...' : 'Test AI Connection'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={testPersonParsing}
          disabled={testing}
          className={`rounded-xl py-3 px-4 ${testing ? 'bg-gray-200' : 'bg-green-500'}`}
        >
          <Text className={`text-center font-medium ${testing ? 'text-gray-500' : 'text-white'}`}>
            {testing ? 'Testing...' : 'Test Person Parsing'}
          </Text>
        </TouchableOpacity>
      </View>

      {lastResult && (
        <View
          className={getThemeClassName(
            'rounded-xl p-3',
            ['bg-background-secondary'],
            isWeb
          )}
          style={{
            ...(!isWeb && { backgroundColor: colors.backgroundSecondary })
          }}
        >
          <Text
            className={getThemeClassName(
              'text-xs font-mono',
              ['text-foreground-secondary'],
              isWeb
            )}
            style={{
              ...(!isWeb && { color: colors.foregroundSecondary })
            }}
          >
            {lastResult}
          </Text>
        </View>
      )}
    </View>
  );
};