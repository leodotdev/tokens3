import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { peopleQueries, specialDatesQueries, bookmarkQueries } from '../../lib/queries';
import type { Person, SpecialDate, Bookmark } from '../../lib/supabase';
import { AIChatCard } from '../features/AIChatCard';
import { EventsCard } from '../features/EventsCard';
import { PlaceholderCard } from '../features/PlaceholderCard';
import { AITest } from '../debug/AITest';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width <= 500;
  const isTablet = width > 500 && width <= 960;
  const isDesktop = width > 960;
  const [people, setPeople] = useState<Person[]>([]);
  const [upcomingDates, setUpcomingDates] = useState<SpecialDate[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDataUpdate = () => {
    loadDashboardData();
  };

  // Grid layout configuration
  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3; // Desktop: 3x3 grid
  };

  const getCardHeight = () => {
    if (isMobile) return 280;
    if (isTablet) return 320;
    return 360; // Desktop cards are taller
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <TablerIcon name="clock" size={48} color={colors.foregroundMuted} />
        <Text className="mt-4" style={{ color: colors.foregroundSecondary }}>Loading your dashboard...</Text>
      </View>
    );
  }


  return (
    <View className="flex-1" style={{ backgroundColor: colors.background, paddingTop: isMobile ? insets.top : 0 }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-7xl px-6 pb-32">
          <View className="flex-col gap-8">
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(100)} className="flex-col gap-6 pt-6">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-col gap-2">
                    <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>
                      Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
                    </Text>
                    <Text style={{ color: colors.foregroundSecondary }}>
                      Your AI-powered gift giving dashboard ✨
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Dashboard Grid */}
            <View className="flex-col gap-6">
            {/* Row 1 */}
            <View className={`flex-row gap-6 ${isMobile ? 'flex-col' : ''}`}>
              <Animated.View 
                entering={FadeInDown.delay(100)} 
                className="flex-1"
                style={{ height: getCardHeight() }}
              >
                <AIChatCard onDataUpdate={handleDataUpdate} />
              </Animated.View>
              {!isMobile && (
                <>
                  <Animated.View 
                    entering={FadeInDown.delay(150)} 
                    className="flex-1"
                    style={{ height: getCardHeight() }}
                  >
                    <AITest />
                  </Animated.View>
                  <Animated.View 
                    entering={FadeInDown.delay(200)} 
                    className="flex-1"
                    style={{ height: getCardHeight() }}
                  >
                    <EventsCard upcomingDates={upcomingDates} onEventAdded={handleDataUpdate} />
                  </Animated.View>
                </>
              )}
            </View>

            {/* Row 2 - Mobile shows events card here */}
            {isMobile ? (
              <Animated.View 
                entering={FadeInDown.delay(150)} 
                style={{ height: getCardHeight() }}
              >
                <EventsCard upcomingDates={upcomingDates} onEventAdded={handleDataUpdate} />
              </Animated.View>
            ) : (
              <View className="flex-row gap-6">
                <Animated.View 
                  entering={FadeInDown.delay(250)} 
                  className="flex-1"
                  style={{ height: getCardHeight() }}
                >
                  <PlaceholderCard title="Gift Ideas" icon="Gift" />
                </Animated.View>
                <Animated.View 
                  entering={FadeInDown.delay(300)} 
                  className="flex-1"
                  style={{ height: getCardHeight() }}
                >
                  <PlaceholderCard title="Bookmarks" icon="Bookmark" />
                </Animated.View>
                <Animated.View 
                  entering={FadeInDown.delay(350)} 
                  className="flex-1"
                  style={{ height: getCardHeight() }}
                >
                  <PlaceholderCard title="Analytics" icon="ChartUpward" />
                </Animated.View>
              </View>
            )}

            {/* Row 3 - Desktop only */}
            {isDesktop && (
              <View className="flex-row gap-6">
                <Animated.View 
                  entering={FadeInDown.delay(400)} 
                  className="flex-1"
                  style={{ height: getCardHeight() }}
                >
                  <PlaceholderCard title="Settings" icon="Settings" />
                </Animated.View>
                <Animated.View 
                  entering={FadeInDown.delay(450)} 
                  className="flex-1"
                  style={{ height: getCardHeight() }}
                >
                  <PlaceholderCard title="Help" icon="QuestionCircle" />
                </Animated.View>
                <Animated.View 
                  entering={FadeInDown.delay(500)} 
                  className="flex-1"
                  style={{ height: getCardHeight() }}
                >
                  <PlaceholderCard title="Export" icon="Download" />
                </Animated.View>
              </View>
            )}

            {/* Mobile AI Debug Card */}
            {isMobile && (
              <Animated.View 
                entering={FadeInDown.delay(200)} 
                style={{ height: getCardHeight() }}
              >
                <AITest />
              </Animated.View>
            )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};