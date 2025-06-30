import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';
import { anthropicAI } from '../../lib/ai';
import { specialDatesQueries, peopleQueries } from '../../lib/queries';
import type { SpecialDate } from '../../lib/supabase';

interface EventsCardProps {
  upcomingDates: SpecialDate[];
  onEventAdded: () => void;
}

export const EventsCard: React.FC<EventsCardProps> = ({ upcomingDates, onEventAdded }) => {
  const { user } = useAuth();
  const [aiInput, setAiInput] = useState('');
  const [addingEvent, setAddingEvent] = useState(false);

  const handleAddEvent = async () => {
    if (!user || !aiInput.trim()) return;
    
    setAddingEvent(true);
    try {
      // Use AI to parse event details and potentially create/link people
      const eventData = await parseEventWithAI(aiInput);
      
      // Show confirmation dialog
      Alert.alert(
        '🤖 AI Parsed This Event',
        `Event: ${eventData.name}\nDate: ${eventData.date}\n${eventData.person ? `Person: ${eventData.person}\n` : ''}${eventData.category ? `Type: ${eventData.category}\n` : ''}`,
        [
          {
            text: 'Edit Manually',
            style: 'default',
            onPress: () => {
              // TODO: Open manual event form
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Looks Good!',
            style: 'default',
            onPress: () => createEvent(eventData),
          },
        ]
      );
    } catch (error) {
      console.error('Error parsing event:', error);
      Alert.alert('AI Parsing Failed', 'Would you like to add this event manually?');
    } finally {
      setAddingEvent(false);
    }
  };

  const parseEventWithAI = async (input: string) => {
    return await anthropicAI.parseEvent(input);
  };

  const createEvent = async (eventData: any) => {
    if (!user) return;

    try {
      let personId = null;

      // If a person was mentioned, try to find or create them
      if (eventData.person_name) {
        const { data: existingPeople } = await peopleQueries.getAll(user.id);
        const existingPerson = existingPeople?.find(p => 
          p.name.toLowerCase().includes(eventData.person_name.toLowerCase())
        );

        if (existingPerson) {
          personId = existingPerson.id;
        } else {
          // Ask user if they want to create the person
          Alert.alert(
            'Create New Person?',
            `"${eventData.person_name}" isn't in your people list. Would you like to add them?`,
            [
              { text: 'Skip', style: 'cancel' },
              { 
                text: 'Add Person', 
                onPress: async () => {
                  const { data: newPerson } = await peopleQueries.create({
                    user_id: user.id,
                    name: eventData.person_name,
                    ai_context: { 
                      created_from_event: aiInput,
                      auto_created: true 
                    }
                  });
                  if (newPerson) personId = newPerson.id;
                }
              },
            ]
          );
        }
      }

      // Create the event
      const { data: event, error } = await specialDatesQueries.create({
        person_id: personId,
        user_id: user.id,
        name: eventData.name,
        date: eventData.date,
        category: eventData.category || 'other',
        recurrence_type: eventData.recurrence_type || 'none',
        reminder_days_before: eventData.reminder_days_before || 14,
      });

      if (!error && event) {
        setAiInput('');
        onEventAdded();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(200)}
      className="rounded-2xl bg-background-secondary border border-border p-6 h-full"
    >
      <View className="mb-4 flex-row items-center">
        <FluentEmoji name="Calendar" size={24} />
        <Text className="ml-2 text-lg font-semibold text-foreground">
          Upcoming Events
        </Text>
      </View>

      {upcomingDates.length > 0 ? (
        <View className="flex-1 mb-4">
          <FlatList
            data={upcomingDates.slice(0, 3)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const daysUntil = getDaysUntil(item.date);
              return (
                <View className="flex-row items-center justify-between mb-3 p-2 rounded-lg bg-gray-50">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-foreground">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-foreground-tertiary">
                      {formatDate(item.date)}
                    </Text>
                  </View>
                  <View className="rounded-full bg-primary/10 px-2 py-1">
                    <Text className="text-xs font-medium text-primary">
                      {daysUntil === 0 ? 'Today' : `${daysUntil}d`}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
          />
          {upcomingDates.length > 3 && (
            <Text className="text-xs text-foreground-tertiary text-center">
              +{upcomingDates.length - 3} more events
            </Text>
          )}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center mb-4">
          <FluentEmoji name="CalendarEmpty" size={48} />
          <Text className="mt-2 text-sm text-foreground-tertiary text-center">
            No upcoming events yet
          </Text>
        </View>
      )}

      <TextInput
        className="mb-3 rounded-xl border border-border bg-background px-4 py-2 text-sm"
        placeholder="AI: Sarah's birthday March 15th..."
        placeholderTextColor="#a1a1aa"
        value={aiInput}
        onChangeText={setAiInput}
      />
      
      <TouchableOpacity
        onPress={handleAddEvent}
        disabled={!aiInput.trim() || addingEvent}
        className={`flex-row items-center justify-center rounded-full py-3 ${
          aiInput.trim() ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        {addingEvent ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <FluentEmoji name="CalendarAdd" size={18} />
            <Text className="ml-2 font-medium text-white text-sm">
              AI Add Event
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};