import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const lessons = [
  {
    id: 1,
    title: 'Lesson #1: Sleep Efficiency',
    image: require('../../assets/lesson1.png'),
  },
  {
    id: 2,
    title: 'Lesson #2: Sleep Quality',
    image: require('../../assets/lesson1.png'), // Adjust path as needed
  },
  // Add more lessons if needed
];

const LessonTrackingScreen = ({ navigation }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const userId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (userId) {
        const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
        const progressDoc = await getDoc(lessonTrackingRef);
        let data = {};

        if (progressDoc.exists()) {
          data = progressDoc.data();
        }

        setUserProgress(data);

        // Find the next lesson that hasn't been completed yet
        const nextLesson = lessons.find((lesson) => !data[lesson.id]);
        setCurrentLesson(nextLesson);
      }
    };

    fetchUserProgress();
  }, [userId]);

  const markLessonComplete = async (lessonId) => {
    if (userId) {
      const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
      const newProgress = { ...userProgress, [lessonId]: true };
      setUserProgress(newProgress);

      // Update Firestore document
      await setDoc(lessonTrackingRef, newProgress);

      // Move to the next lesson
      const nextLesson = lessons.find((lesson) => !newProgress[lesson.id]);
      setCurrentLesson(nextLesson);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {currentLesson ? (
        <>
          <Text style={styles.title}>{currentLesson.title}</Text>
          <Image source={currentLesson.image} style={styles.lessonImage} />
          <View style={styles.buttons}>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <Button
              title="Done"
              onPress={() => markLessonComplete(currentLesson.id)}
            />
          </View>
        </>
      ) : (
        <Text>All lessons completed!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow ScrollView to take the whole screen
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20, // Margin only around the title
  },
  lessonImage: {
    width: '100%',
    height: 600, // Adjust height as needed, or use a dynamic value
    resizeMode: 'cover', // Cover or contain based on preference
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default LessonTrackingScreen;
