import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FluentEmoji, HeartEmoji, SparklesEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';
import { peopleQueries, specialDatesQueries, bookmarkQueries } from '../../lib/queries';
import type { Person, SpecialDate, Bookmark } from '../../lib/supabase';
import { ProductCard } from '../features/ProductCard';
import { anthropicAI } from '../../lib/ai';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;
  const [people, setPeople] = useState<Person[]>([]);
  const [upcomingDates, setUpcomingDates] = useState<SpecialDate[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [addingPerson, setAddingPerson] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load people
      const { data: peopleData } = await peopleQueries.getAll(user.id);
      if (peopleData) setPeople(peopleData);

      // Load upcoming special dates
      const { data: datesData } = await specialDatesQueries.getUpcoming(user.id, 60);
      if (datesData) setUpcomingDates(datesData);

      // Load bookmarks
      const { data: bookmarksData } = await bookmarkQueries.getByUser(user.id);
      if (bookmarksData) setBookmarks(bookmarksData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = async () => {
    if (!user || !aiInput.trim()) return;
    
    setAddingPerson(true);
    try {
      // Use AI to parse the person details
      const parsedPerson = await anthropicAI.parsePerson(aiInput);
      
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
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error adding person:', error);
      // Fallback: create basic person if AI fails
      const { error: fallbackError } = await peopleQueries.create({
        user_id: user.id,
        name: aiInput.trim(),
        ai_context: { raw_input: aiInput, ai_failed: true },
      });
      
      if (!fallbackError) {
        setAiInput('');
        loadDashboardData();
      }
    } finally {
      setAddingPerson(false);
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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: isMobile ? insets.top : 0 }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-4xl px-6 pb-32">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} className="mb-8 mt-4">
            <Text className="text-3xl font-bold text-foreground">
              Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
            </Text>
            <Text className="mt-2 text-foreground-tertiary">
              Let's make gift giving magical ✨
            </Text>
          </Animated.View>

          {/* Add Person Section */}
          <Animated.View entering={FadeInDown.delay(200)} className="mb-8">
            <View className="rounded-2xl bg-white p-6" style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}>
              <View className="mb-4 flex-row items-center">
                <FluentEmoji name="PersonAdd" size={24} />
                <Text className="ml-2 text-lg font-semibold text-foreground">
                  Add someone special
                </Text>
              </View>
              
              <TextInput
                className="mb-3 rounded-xl border border-border bg-background px-4 py-3 text-base"
                placeholder="Example: Add my mom, Mary, 68 yrs on June 5, an artist and educator who likes to travel..."
                placeholderTextColor="#a1a1aa"
                value={aiInput}
                onChangeText={setAiInput}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <Text className="mb-4 text-xs text-foreground-tertiary">
                💡 Adding an address only helps us remind you where to send your gift. 
                We never share your data, and it's completely optional.
              </Text>
              
              <TouchableOpacity
                onPress={handleAddPerson}
                disabled={!aiInput.trim() || addingPerson}
                className={`flex-row items-center justify-center rounded-full py-3 ${
                  aiInput.trim() ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                {addingPerson ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <FluentEmoji name="Sparkles" size={20} />
                    <Text className="ml-2 font-medium text-white">
                      Add with AI
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Your People */}
          {people.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300)} className="mb-8">
              <Text className="mb-4 text-xl font-bold text-foreground">Your People</Text>
              <View className="flex-row flex-wrap gap-3">
                {people.map((person) => (
                  <TouchableOpacity
                    key={person.id}
                    className="flex-row items-center rounded-full bg-white px-4 py-2"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <FluentEmoji name="Person" size={20} />
                    <Text className="ml-2 text-sm font-medium text-foreground">
                      {person.name}
                    </Text>
                    {person.relationship && (
                      <Text className="ml-1 text-xs text-foreground-tertiary">
                        ({person.relationship})
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Upcoming Dates */}
          {upcomingDates.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400)} className="mb-8">
              <Text className="mb-4 text-xl font-bold text-foreground">Upcoming Dates</Text>
              <View className="space-y-3">
                {upcomingDates.slice(0, 5).map((date: any) => {
                  const daysUntil = getDaysUntil(date.date);
                  return (
                    <View
                      key={date.id}
                      className="flex-row items-center justify-between rounded-xl bg-white p-4"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      }}
                    >
                      <View className="flex-row items-center">
                        <FluentEmoji name="Calendar" size={24} />
                        <View className="ml-3">
                          <Text className="text-sm font-semibold text-foreground">
                            {date.name} - {date.person?.name}
                          </Text>
                          <Text className="text-xs text-foreground-tertiary">
                            {formatDate(date.date)}
                          </Text>
                        </View>
                      </View>
                      <View className="rounded-full bg-primary/10 px-3 py-1">
                        <Text className="text-xs font-medium text-primary">
                          {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {/* Bookmarked Products */}
          {bookmarks.length > 0 && (
            <Animated.View entering={FadeInDown.delay(500)} className="mb-8">
              <Text className="mb-4 text-xl font-bold text-foreground">Your Bookmarks</Text>
              <FlatList
                horizontal
                data={bookmarks}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={{ width: 280, marginRight: 16 }}>
                    {item.product && (
                      <ProductCard
                        product={item.product}
                        isHorizontal={false}
                      />
                    )}
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </Animated.View>
          )}

          {/* Empty States */}
          {people.length === 0 && (
            <Animated.View entering={FadeInUp.delay(300)} className="mb-8 items-center py-8">
              <SparklesEmoji size={60} />
              <Text className="mt-4 text-center text-lg font-semibold text-foreground">
                Add your first person
              </Text>
              <Text className="mt-2 text-center text-foreground-tertiary">
                Start by adding someone special above
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};