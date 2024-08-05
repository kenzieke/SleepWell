import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const lessons = [
  {
    id: 1,
    title: 'Module #1: Sleep Efficiency',
    image: require('../../assets/sleep_study_module_1.png'),
  },
  {
    id: 2,
    title: 'Module #2: Sleep Schedule and Restriction',
    image: require('../../assets/sleep_study_module_2.png'),
  },
  {
    id: 3,
    title: 'Module #3: Keeping Track',
    image: require('../../assets/sleep_study_module_3.png'),
  },
  {
    id: 4,
    title: 'Module #4: Naps',
    image: require('../../assets/sleep_study_module_4.png'),
  },
  {
    id: 5,
    title: 'Module #5: Lights and Sounds',
    image: require('../../assets/sleep_study_module_5.png'),
  },
  {
    id: 6,
    title: 'Module #6: Bedtime Routines',
    image: require('../../assets/sleep_study_module_6.png'),
  },
  {
    id: 7,
    title: 'Module #7: Healthy Eating',
    image: require('../../assets/sleep_study_module_7.png'),
  },
  {
    id: 8,
    title: 'Module #8: Healthy Drinks',
    image: require('../../assets/sleep_study_module_8.png'),
  },
  {
    id: 9,
    title: 'Module #9: Healthy Body Weight',
    image: require('../../assets/sleep_study_module_9.png'),
  },
  {
    id: 10,
    title: 'Module #10: Building Physical Activity and Strength',
    image: require('../../assets/sleep_study_module_10.png'),
  },
  {
    id: 11,
    title: 'Module #11: Stress',
    image: require('../../assets/sleep_study_module_11.png'),
  },
  {
    id: 12,
    title: 'Module #12: Cognitive Strategies to Improve Sleep',
    image: require('../../assets/sleep_study_module_12.png'),
  },
];

const LessonTrackingScreen = () => {
  const [userProgress, setUserProgress] = useState({});
  const [accountCreationDate, setAccountCreationDate] = useState(null);
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const navigation = useNavigation();
  const userId = FIREBASE_AUTH.currentUser?.uid;

    const getCurrentWeek = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1); // Assuming the week starts from Jan 1
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
    const currentWeek = Math.ceil(days / 7);
    return currentWeek;
  };  

  useEffect(() => {
    if (userId) {
        const userDocRef = doc(FIRESTORE_DB, 'users', userId);

        // Fetch the account creation date
        getDoc(userDocRef).then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setAccountCreationDate(userData.creationDate);
                const allCompleted = Object.keys(userData.lessonProgress || {}).length === lessons.length && Object.values(userData.lessonProgress).every(status => status);
                setAllLessonsCompleted(allCompleted);
            }
        });

        // Listen for changes in lesson progress
        const lessonTrackingRef = doc(userDocRef, 'lessonTracking', 'progress');
        const unsubscribe = onSnapshot(lessonTrackingRef, (doc) => {
            if (doc.exists()) {
                setUserProgress(doc.data()); // Assuming doc.data() returns the progress directly
                console.log("Updated User Progress:", doc.data());
            } else {
                console.log("No module tracking data available.");
            }
        });

        return () => unsubscribe(); // This is correctly returning the unsubscribe function
    }
}, [userId]);

  return (
    <ScrollView style={styles.container}>
      {allLessonsCompleted && (
        <Text style={styles.completedText}>All modules completed!</Text>
      )}
      {lessons.map((lesson, index) => (
        <TouchableOpacity
          key={lesson.id}
          style={styles.lessonItem}
          onPress={() => navigation.navigate('LessonDetailScreen', { lesson })}
        >
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          {index + 1 === getCurrentWeek() && userProgress[lesson.id] && (
            <Text style={styles.weeklyProgressText}>This Week's Progress: 100%</Text>
          )}
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
