import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const lessons = [
  {
    id: 1,
    title: 'Lesson #1: Sleep Efficiency',
    image: require('../../assets/sleep_study_module_1.png'),
  },
  {
    id: 2,
    title: 'Lesson #2: Sleep Schedule and Restriction',
    image: require('../../assets/sleep_study_module_2.png'),
  },
  {
    id: 3,
    title: 'Lesson #3: Keeping Track',
    image: require('../../assets/sleep_study_module_3.png'),
  },
  {
    id: 4,
    title: 'Lesson #4: Naps',
    image: require('../../assets/sleep_study_module_4.png'),
  },
  {
    id: 5,
    title: 'Lesson #5: Lights and Sounds',
    image: require('../../assets/sleep_study_module_5.png'),
  },
  {
    id: 6,
    title: 'Lesson #6: Bedtime Routines',
    image: require('../../assets/sleep_study_module_6.png'),
  },
  {
    id: 7,
    title: 'Lesson #7: Healthy Eating',
    image: require('../../assets/sleep_study_module_7.png'),
  },
  {
    id: 8,
    title: 'Lesson #8: Healthy Drinks',
    image: require('../../assets/sleep_study_module_8.png'),
  },
  {
    id: 9,
    title: 'Lesson #9: Healthy Body Weight',
    image: require('../../assets/sleep_study_module_9.png'),
  },
  {
    id: 10,
    title: 'Lesson #10: Building Physical Activity and Strength',
    image: require('../../assets/sleep_study_module_10.png'),
  },
  {
    id: 11,
    title: 'Lesson #11: Stress',
    image: require('../../assets/sleep_study_module_11.png'),
  },
  {
    id: 12,
    title: 'Lesson #12: Cognitive Strategies to Improve Sleep',
    image: require('../../assets/sleep_study_module_12.png'),
  },
];

const LessonTrackingScreen = () => {
  const [userProgress, setUserProgress] = useState({});
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const navigation = useNavigation();
  const userId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
      
      // Setting up the Firestore listener
      const unsubscribe = onSnapshot(lessonTrackingRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserProgress(data);
          const allCompleted = Object.keys(data).length === lessons.length && Object.values(data).every(status => status);
          setAllLessonsCompleted(allCompleted);
        } else {
          // Set initial false for each lesson if no progress document exists
          const initialProgress = lessons.reduce((acc, lesson) => ({ ...acc, [lesson.id]: false }), {});
          setUserProgress(initialProgress);
          setAllLessonsCompleted(false);
        }
      });

      // Cleanup function to unsubscribe from the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      {allLessonsCompleted && (
        <Text style={styles.completedText}>All lessons completed!</Text>
      )}
      {lessons.map((lesson) => (
        <TouchableOpacity
          key={lesson.id}
          style={styles.lessonItem}
          onPress={() => navigation.navigate('LessonDetailScreen', { lesson })}
        >
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
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
  lessonTitle: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,  // added margin bottom for better spacing
  },
});

export default LessonTrackingScreen;
