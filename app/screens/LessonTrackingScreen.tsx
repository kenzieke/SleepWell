import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLessonTrackingStore } from '../../stores/LessonTrackingStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';

type LessonTrackingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LessonTrackingScreen'>;

const LessonTrackingScreen: React.FC = () => {
  const navigation = useNavigation<LessonTrackingScreenNavigationProp>();
  const { lessons, userProgress, allLessonsCompleted, fetchUserProgress, updateLessonProgress } = useLessonTrackingStore();
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  const handleToggleExpand = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleUncheckLesson = async (lessonId: number) => {
    const completed = userProgress[lessonId];
    await updateLessonProgress(lessonId, !completed);
  };

  return (
    <ScrollView style={styles.container}>
      {allLessonsCompleted && <Text style={styles.completedText}>All modules completed!</Text>}
      
      {lessons.map((lesson) => (
        <View key={lesson.id} style={styles.lessonItem}>
          {/* Collapsible Header */}
          <TouchableOpacity style={styles.lessonHeader} onPress={() => handleToggleExpand(lesson.id)}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <View style={styles.iconWrapper}>
              {userProgress[lesson.id] ? (
                <TouchableOpacity onPress={() => handleUncheckLesson(lesson.id)}>
                  <Ionicons name="checkmark-circle" size={22} color="#52796F" />
                </TouchableOpacity>
              ) : (
                <Ionicons name="ellipse-outline" size={22} color="#52796F" />
              )}
              <Ionicons name={expandedLesson === lesson.id ? "chevron-up" : "chevron-down"} size={22} color="#52796F" />
            </View>
          </TouchableOpacity>

          {/* Expanded Content */}
          {expandedLesson === lesson.id && (
            <View style={styles.lessonOptions}>
              <TouchableOpacity onPress={() => navigation.navigate('LessonDetailScreen', { lesson })} style={styles.optionItem}>
                <Ionicons name="book-outline" size={20} color="#52796F" />
                <Text style={styles.optionText}>Read Summary (1/2 page)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate('AudioPlayerScreen', { 
                  moduleTitle: `Module ${lesson.id}`, 
                  moduleSubtitle: lesson.title.replace(/^Module #\d+: /, '') // Remove "Module #X: "
                })}
                style={styles.optionItem}
              >
                <Ionicons name="headset-outline" size={20} color="#52796F" />
                <Text style={styles.optionText}>Listen to Podcast (3 min)</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lessonItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lessonOptions: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default LessonTrackingScreen;
