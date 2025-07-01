import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, TextInput, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { TablerIcon } from '../icons/TablerIcon';
import { FluentEmoji } from '../icons/FluentEmojiReal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { anthropicService } from '../../lib/ai/anthropic';
import { peopleQueries, specialDatesQueries, listQueries } from '../../lib/queries';
import type { PersonInsert, SpecialDateInsert, ListInsert } from '../../lib/supabase';

type EntityType = 'person' | 'event' | 'list';
type CreationMode = 'ai' | 'manual';

interface UnifiedCreationModalProps {
  visible: boolean;
  onClose: () => void;
  defaultType?: EntityType;
  defaultMode?: CreationMode;
  onEntityCreated?: (entity: any, type: EntityType) => void;
}

interface ParsedEntity {
  type: EntityType;
  data: any;
  confidence: number;
}

export const UnifiedCreationModal: React.FC<UnifiedCreationModalProps> = ({
  visible,
  onClose,
  defaultType = 'person',
  defaultMode = 'ai',
  onEntityCreated,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<EntityType>(defaultType);
  const [selectedMode, setSelectedMode] = useState<CreationMode>(defaultMode);
  const [aiInput, setAiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedEntities, setParsedEntities] = useState<ParsedEntity[]>([]);
  const [showResults, setShowResults] = useState(false);

  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.95);
  const modalOpacity = useSharedValue(0);

  const isWeb = Platform.OS === 'web';

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

  const entityTypes = [
    { id: 'person' as EntityType, label: 'Person', icon: 'User', description: 'Add family, friends, colleagues' },
    { id: 'event' as EntityType, label: 'Event', icon: 'Calendar', description: 'Birthdays, anniversaries, occasions' },
    { id: 'list' as EntityType, label: 'List', icon: 'List', description: 'Gift lists, wishlists, collections' },
  ];

  const getPlaceholderText = () => {
    switch (selectedType) {
      case 'person':
        return "Add my sister Sarah, 25, loves photography and hiking...";
      case 'event':
        return "Sarah's birthday December 15th, she loves photography...";
      case 'list':
        return "Create holiday gift list for family members under $100...";
      default:
        return "Describe what you'd like to create...";
    }
  };

  const handleAISubmit = async () => {
    if (!aiInput.trim() || !user) return;

    setIsProcessing(true);
    try {
      // Parse the input with AI
      const result = await anthropicService.parseEntityCreation(aiInput, selectedType);
      
      if (result && result.entities && result.entities.length > 0) {
        setParsedEntities(result.entities);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to parse entity:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEntityConfirm = async (entity: ParsedEntity) => {
    if (!user) return;

    try {
      let createdEntity = null;

      switch (entity.type) {
        case 'person': {
          const personData: PersonInsert = {
            user_id: user.id,
            name: entity.data.name,
            relationship: entity.data.relationship,
            age: entity.data.age,
            birthday: entity.data.birthday,
            interests: entity.data.interests,
            address: entity.data.address,
            notes: entity.data.notes,
            ai_context: {
              raw_input: aiInput,
              parsed_data: entity.data,
              confidence: entity.confidence
            }
          };
          const { data, error } = await peopleQueries.create(personData);
          if (error) throw error;
          createdEntity = data;
          break;
        }

        case 'event': {
          const eventData: SpecialDateInsert = {
            user_id: user.id,
            person_id: null, // We'll need to resolve this if person is mentioned
            name: entity.data.title,
            date: entity.data.date,
            category: entity.data.type,
            recurrence_type: entity.data.recurring ? 'annual' : 'once',
            reminder_days_before: entity.data.reminder_days || 14,
            notes: entity.data.notes
          };
          const { data, error } = await specialDatesQueries.create(eventData);
          if (error) throw error;
          createdEntity = data;
          break;
        }

        case 'list': {
          const listData: ListInsert = {
            user_id: user.id,
            name: entity.data.name,
            description: entity.data.description,
            category: entity.data.category || 'general',
            criteria: entity.data.criteria,
            is_public: false
          };
          const { data, error } = await listQueries.create(listData);
          if (error) throw error;
          createdEntity = data;
          break;
        }
      }

      onEntityCreated?.(createdEntity, entity.type);
      onClose();
    } catch (error) {
      console.error('Failed to create entity:', error);
      // TODO: Show error message to user
    }
  };

  const renderAIMode = () => (
    <View className="flex-1">
      {!showResults ? (
        <>
          {/* AI Input Section */}
          <View className="mb-6">
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
              Describe what you'd like to create
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
                minHeight: 80,
                textAlignVertical: 'top',
              }}
              placeholder={getPlaceholderText()}
              placeholderTextColor={colors.foregroundMuted}
              value={aiInput}
              onChangeText={setAiInput}
              multiline
              autoFocus
            />
          </View>

          {/* AI Tips */}
          <View style={{ backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <View className="flex-row items-center mb-2">
              <FluentEmoji name="Sparkles" size={20} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginLeft: 8 }}>
                AI Tips
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: colors.foregroundSecondary, lineHeight: 20 }}>
              Be descriptive! Include names, dates, interests, relationships, and any relevant details. 
              The more context you provide, the better I can help you create organized entries.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleAISubmit}
            disabled={!aiInput.trim() || isProcessing}
            style={{
              backgroundColor: !aiInput.trim() || isProcessing ? colors.foregroundMuted : colors.accent,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: !aiInput.trim() || isProcessing ? colors.background : colors.accentForeground,
            }}>
              {isProcessing ? 'Processing...' : `Create ${selectedType}`}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        // AI Results
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
              Review & Confirm
            </Text>
            <TouchableOpacity onPress={() => setShowResults(false)}>
              <TablerIcon name="edit" size={20} color={colors.foregroundSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {parsedEntities.map((entity, index) => (
              <View key={index} style={{
                backgroundColor: colors.backgroundSecondary,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <FluentEmoji name={
                      entity.type === 'person' ? 'User' : 
                      entity.type === 'event' ? 'Calendar' : 'List'
                    } size={24} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginLeft: 8 }}>
                      {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: entity.confidence > 0.8 ? '#10b981' : entity.confidence > 0.6 ? '#f59e0b' : '#ef4444',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                      {Math.round(entity.confidence * 100)}%
                    </Text>
                  </View>
                </View>

                {/* Entity Preview */}
                <View className="mb-4">
                  {entity.type === 'person' && (
                    <>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.foreground, marginBottom: 4 }}>
                        {entity.data.name}
                      </Text>
                      {entity.data.age && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary, marginBottom: 2 }}>
                          Age: {entity.data.age}
                        </Text>
                      )}
                      {entity.data.relationship && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary, marginBottom: 2 }}>
                          Relationship: {entity.data.relationship}
                        </Text>
                      )}
                      {entity.data.interests && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary }}>
                          Interests: {entity.data.interests.join(', ')}
                        </Text>
                      )}
                    </>
                  )}
                  
                  {entity.type === 'event' && (
                    <>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.foreground, marginBottom: 4 }}>
                        {entity.data.title}
                      </Text>
                      {entity.data.date && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary, marginBottom: 2 }}>
                          Date: {entity.data.date}
                        </Text>
                      )}
                      {entity.data.person && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary, marginBottom: 2 }}>
                          For: {entity.data.person}
                        </Text>
                      )}
                      {entity.data.type && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary }}>
                          Type: {entity.data.type}
                        </Text>
                      )}
                    </>
                  )}

                  {entity.type === 'list' && (
                    <>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.foreground, marginBottom: 4 }}>
                        {entity.data.name}
                      </Text>
                      {entity.data.description && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary, marginBottom: 2 }}>
                          {entity.data.description}
                        </Text>
                      )}
                      {entity.data.criteria && (
                        <Text style={{ fontSize: 14, color: colors.foregroundSecondary }}>
                          Criteria: {entity.data.criteria}
                        </Text>
                      )}
                    </>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleEntityConfirm(entity)}
                  style={{
                    backgroundColor: colors.accent,
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accentForeground }}>
                    Create {entity.type}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderManualMode = () => (
    <View className="flex-1">
      <Text style={{ fontSize: 16, color: colors.foregroundSecondary, textAlign: 'center' }}>
        Manual forms coming soon...
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[backdropAnimatedStyle, {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      }]}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View style={[modalAnimatedStyle, {
          backgroundColor: colors.background,
          borderRadius: 24,
          padding: 24,
          width: '100%',
          maxWidth: 600,
          maxHeight: '90%',
          borderWidth: 1,
          borderColor: colors.border,
        }]}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground }}>
              Create New
            </Text>
            <TouchableOpacity onPress={onClose}>
              <TablerIcon name="x" size={24} color={colors.foregroundSecondary} />
            </TouchableOpacity>
          </View>

          {/* Entity Type Selector */}
          <View className="mb-6">
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
              What would you like to create?
            </Text>
            <View className="flex-row gap-3">
              {entityTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    borderWidth: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    alignItems: 'center',
                    borderColor: selectedType === type.id ? colors.accent : colors.border,
                    backgroundColor: selectedType === type.id ? colors.backgroundSecondary : colors.background,
                  }}>
                  <TablerIcon 
                    name={type.icon as any} 
                    size={24} 
                    color={selectedType === type.id ? colors.accent : colors.foregroundSecondary}
                  />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: selectedType === type.id ? colors.accent : colors.foregroundSecondary,
                    marginTop: 4,
                    textAlign: 'center',
                  }}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mode Selector */}
          <View className="mb-6">
            <View className="flex-row rounded-xl border border-border overflow-hidden">
              <TouchableOpacity
                onPress={() => setSelectedMode('ai')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  alignItems: 'center',
                  backgroundColor: selectedMode === 'ai' ? colors.accent : colors.background,
                }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: selectedMode === 'ai' ? colors.accentForeground : colors.foregroundSecondary,
                }}>
                  ✨ AI Powered
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedMode('manual')}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  alignItems: 'center',
                  backgroundColor: selectedMode === 'manual' ? colors.accent : colors.background,
                }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: selectedMode === 'manual' ? colors.accentForeground : colors.foregroundSecondary,
                }}>
                  📝 Manual
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          {selectedMode === 'ai' ? renderAIMode() : renderManualMode()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};