import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { SparklesEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClassName } from '../../lib/theme-utils';
import { anthropicAI } from '../../lib/ai';
import { peopleQueries, specialDatesQueries } from '../../lib/queries';

interface AddPeopleCardProps {
  onPersonAdded: () => void;
}

export const AddPeopleCard: React.FC<AddPeopleCardProps> = ({ onPersonAdded }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [aiInput, setAiInput] = useState('');
  const [addingPerson, setAddingPerson] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const isWeb = Platform.OS === 'web';

  const handleAddPerson = async () => {
    if (!user || !aiInput.trim()) return;
    
    setAddingPerson(true);
    try {
      // Use AI to parse the person details
      const parsedPerson = await anthropicAI.parsePerson(aiInput);
      
      // Show confirmation dialog with parsed data
      Alert.alert(
        '🤖 AI Parsed This Information',
        `Name: ${parsedPerson.name}\n${parsedPerson.relationship ? `Relationship: ${parsedPerson.relationship}\n` : ''}${parsedPerson.age ? `Age: ${parsedPerson.age}\n` : ''}${parsedPerson.birthday ? `Birthday: ${parsedPerson.birthday}\n` : ''}${parsedPerson.interests ? `Interests: ${parsedPerson.interests.join(', ')}\n` : ''}${parsedPerson.notes ? `Notes: ${parsedPerson.notes}\n` : ''}\nConfidence: ${Math.round(parsedPerson.confidence * 100)}%`,
        [
          {
            text: 'Edit Manually',
            style: 'default',
            onPress: () => setShowManualForm(true),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Looks Good!',
            style: 'default',
            onPress: () => createPerson(parsedPerson),
          },
        ]
      );
    } catch (error) {
      console.error('Error parsing person:', error);
      Alert.alert('AI Parsing Failed', 'Would you like to add this person manually?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Manually', onPress: () => setShowManualForm(true) },
      ]);
    } finally {
      setAddingPerson(false);
    }
  };

  const createPerson = async (parsedPerson: any) => {
    if (!user) return;

    try {
      // Create person with AI-extracted data
      const personData = {
        user_id: user.id,
        name: parsedPerson.name,
        relationship: parsedPerson.relationship,
        age: parsedPerson.age,
        birthday: parsedPerson.birthday,
        interests: parsedPerson.interests,
        address: parsedPerson.address,
        notes: parsedPerson.notes,
        ai_context: { 
          raw_input: aiInput,
          parsed_data: parsedPerson,
          confidence: parsedPerson.confidence 
        },
      };

      const { data: person, error } = await peopleQueries.create(personData);

      if (!error && person) {
        // If birthday was provided, create a special date
        if (parsedPerson.birthday) {
          await specialDatesQueries.create({
            person_id: person.id,
            user_id: user.id,
            name: `${parsedPerson.name}'s Birthday`,
            date: parsedPerson.birthday,
            recurrence_type: 'annual',
            category: 'birthday',
            reminder_days_before: 14,
          });
        }
        
        setAiInput('');
        onPersonAdded();
      }
    } catch (error) {
      console.error('Error creating person:', error);
      Alert.alert('Error', 'Failed to create person. Please try again.');
    }
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(100)}
      className={getThemeClassName(
        'rounded-2xl border p-6 h-full',
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
      <View className="mb-4 flex-row items-center">
        <TablerIcon name="user-plus" size={24} color={colors.accent} />
        <Text
          className={getThemeClassName(
            'ml-2 text-lg font-semibold',
            ['text-foreground'],
            isWeb
          )}
          style={{
            ...(!isWeb && { color: colors.foreground })
          }}
        >
          Add People
        </Text>
      </View>
      
      <TextInput
        className={getThemeClassName(
          'mb-3 rounded-xl border px-4 py-3 text-base flex-1',
          ['bg-background', 'border-border', 'text-foreground'],
          isWeb
        )}
        style={{
          ...(!isWeb && {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.foreground
          })
        }}
        placeholder="AI: Add my mom Mary, 68, loves gardening..."
        placeholderTextColor="#a1a1aa"
        value={aiInput}
        onChangeText={setAiInput}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={handleAddPerson}
          disabled={!aiInput.trim() || addingPerson}
          className={`flex-1 flex-row items-center justify-center rounded-full py-3 ${
            aiInput.trim() ? 'bg-primary' : 'bg-gray-200'
          }`}
        >
          {addingPerson ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <SparklesEmoji size={18} />
              <Text className="ml-2 font-medium text-white text-sm">
                AI Add
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowManualForm(true)}
          className="rounded-full bg-gray-100 px-4 py-3"
        >
          <TablerIcon name="edit" size={18} color={colors.foregroundMuted} />
        </TouchableOpacity>
      </View>

      <Text
        className={getThemeClassName(
          'mt-3 text-xs',
          ['text-foreground-secondary'],
          isWeb
        )}
        style={{
          ...(!isWeb && { color: colors.foregroundSecondary })
        }}
      >
        💡 Try: "Add my sister Sarah, 32, birthday March 15th, loves yoga and reading"
      </Text>
    </Animated.View>
  );
};