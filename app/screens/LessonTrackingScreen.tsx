import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLessonTrackingStore } from '../../stores/LessonTrackingStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';

type LessonTrackingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LessonTrackingScreen'>;

const LessonTrackingScreen: React.FC = () => {
  const navigation = useNavigation<LessonTrackingScreenNavigationProp>();

  // Access Zustand store
  const { lessons, userProgress, allLessonsCompleted, fetchUserProgress, updateLessonProgress } = useLessonTrackingStore();
  
  const customGreenColor = '#52796F';

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  const handleUncheckLesson = async (lessonId: number) => {
    const completed = userProgress[lessonId];
    await updateLessonProgress(lessonId, !completed); // Toggle completion status
  };

  return (
    <ScrollView style={styles.container}>
      {allLessonsCompleted && (
        <Text style={styles.completedText}>All modules completed!</Text>
      )}
      {lessons.map((lesson) => (
        <TouchableOpacity
          key={lesson.id}
          style={styles.lessonItem}
          onPress={() => navigation.navigate('LessonDetailScreen', { lesson })} // Type-safe navigation
        >
          <View style={styles.lessonInfo}>
            <View style={styles.textWrapper}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
            </View>
            {userProgress[lesson.id] ? (
              <TouchableOpacity onPress={() => handleUncheckLesson(lesson.id)}>
                <Ionicons name="checkmark-circle" size={24} color={customGreenColor} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="ellipse-outline" size={24} color={customGreenColor} />
            )}
          </View>
        </TouchableOpacity>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  lessonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  lessonTitle: {
    fontSize: 18,
    flexWrap: 'wrap',
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default LessonTrackingScreen;
