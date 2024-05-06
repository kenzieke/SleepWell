import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import FullWidthPicture from '../../components/FullWidthPicture';

const lessons = [
  {
    id: 1,
    // title: 'Lesson #1: Sleep Efficiency',
    image: require('../../assets/lesson1.png'),
  },
  {
    id: 2,
    // title: 'Lesson #2: Sleep Quality',
    image: require('../../assets/lesson1.png'),
  },
  // Add more lessons as needed
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
        const nextLesson = lessons.find(lesson => !data[lesson.id]);
        setCurrentLesson(nextLesson);
      }
    };

    fetchUserProgress();
  }, [userId]);

  const markLessonComplete = async (lessonId) => {
    if (userId) {
      const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
      const newProgress = { ...userProgress, [lessonId]: true };
      await setDoc(lessonTrackingRef, newProgress);
      setUserProgress(newProgress);

      const nextLesson = lessons.find(lesson => !newProgress[lesson.id]);
      setCurrentLesson(nextLesson);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {currentLesson ? (
        <>
          <Text style={styles.title}>{currentLesson.title}</Text>
          <FullWidthPicture uri={Image.resolveAssetSource(currentLesson.image).uri} />
          <View style={styles.buttons}>
            {/* <Button title="Done" onPress={() => markLessonComplete(currentLesson.id)} /> */}
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
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LessonTrackingScreen;
