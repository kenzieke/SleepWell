import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // For icons

const lessons = [
  { id: 1, title: 'Module #1: Sleep Efficiency', image: require('../../assets/sleep_study_module_1.webp') },
  { id: 2, title: 'Module #2: Sleep Schedule and Restriction', image: require('../../assets/sleep_study_module_2.png') },
  { id: 3, title: 'Module #3: Keeping Track', image: require('../../assets/sleep_study_module_3.png') },
  { id: 4, title: 'Module #4: Naps', image: require('../../assets/sleep_study_module_4.png') },
  { id: 5, title: 'Module #5: Lights and Sounds', image: require('../../assets/sleep_study_module_5.png') },
  { id: 6, title: 'Module #6: Bedtime Routines', image: require('../../assets/sleep_study_module_6.png') },
  { id: 7, title: 'Module #7: Healthy Eating', image: require('../../assets/sleep_study_module_7.png') },
  { id: 8, title: 'Module #8: Healthy Drinks', image: require('../../assets/sleep_study_module_8.png') },
  { id: 9, title: 'Module #9: Healthy Body Weight', image: require('../../assets/sleep_study_module_9.png') },
  { id: 10, title: 'Module #10: Building Physical Activity and Strength', image: require('../../assets/sleep_study_module_10.png') },
  { id: 11, title: 'Module #11: Stress', image: require('../../assets/sleep_study_module_11.png') },
  { id: 12, title: 'Module #12: Cognitive Strategies to Improve Sleep', image: require('../../assets/sleep_study_module_12.png') },
];

const LessonTrackingScreen = () => {
  const [userProgress, setUserProgress] = useState({});
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const navigation = useNavigation();
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const customGreenColor = '#52796F';

  const calculateWeekSinceSignup = (creationDate: string | number | Date) => {
    const currentDate = new Date();
    const signupDate = new Date(creationDate);
  
    const differenceInTime = currentDate - signupDate;
    const differenceInWeeks = Math.floor(differenceInTime / (1000 * 60 * 60 * 24 * 7));
  
    return differenceInWeeks + 1;
  };
  
  useEffect(() => {
    if (userId) {
      const userDocRef = doc(FIRESTORE_DB, 'users', userId);
  
      // Fetch the account creation date and progress data
      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const creationDate = userData.creationDate;
  
          // Calculate the current week based on the creationDate
          const currentWeek = calculateWeekSinceSignup(creationDate);
  
          // Update the week in the Firestore database
          updateDoc(userDocRef, {
            currentWeek: currentWeek, // Store the current week in the user's document
          });
  
          // Logic to check if all lessons are completed
          const allCompleted = Object.keys(userData.lessonProgress || {}).length === lessons.length && Object.values(userData.lessonProgress).every(status => status);
          setAllLessonsCompleted(allCompleted);
        }
      });
  
      // Listen for changes in lesson progress
      const lessonTrackingRef = doc(userDocRef, 'lessonTracking', 'progress');
      const unsubscribe = onSnapshot(lessonTrackingRef, (doc) => {
        if (doc.exists()) {
          setUserProgress(doc.data());
        } else {
          console.log("No module tracking data available.");
        }
      });
  
      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      {allLessonsCompleted && (
        <Text style={styles.completedText}>All modules completed!</Text>
      )}
      {lessons.map((lesson) => (
        <TouchableOpacity
          key={lesson.id}
          style={styles.lessonItem}
          onPress={() => navigation.navigate('LessonDetailScreen', { lesson })}
        >
          <View style={styles.lessonInfo}>
            {/* Text container that will expand and wrap */}
            <View style={styles.textWrapper}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
            </View>
            {/* Checkmark or empty circle based on lesson completion */}
            {userProgress[lesson.id] ? (
              <Ionicons name="checkmark-circle" size={24} color={customGreenColor} />
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
    flexDirection: 'row', // Place the text and icon in a row
    justifyContent: 'space-between', // Push the checkmark to the right
    alignItems: 'center', // Align items in the center vertically
  },
  textWrapper: {
    flex: 1, // This makes the text take up remaining space and wrap
    paddingRight: 10, // Add padding to prevent text from touching the checkmark
  },
  lessonTitle: {
    fontSize: 18,
    flexWrap: 'wrap', // Allows text to wrap if it's too long
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
