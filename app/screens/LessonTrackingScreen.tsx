// import React, { useEffect, useState } from 'react';
// import { ScrollView, View, Text, Button, StyleSheet, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import FullWidthPicture from '../../components/FullWidthPicture';

// const lessons = [
//   {
//     id: 1,
//     image: require('../../assets/lesson1.png'),
//   },
//   {
//     id: 2,
//     image: require('../../assets/lesson1.png'),
//   },
//   // Add more lessons as needed
// ];

// const LessonTrackingScreen = () => {
//   const [currentLesson, setCurrentLesson] = useState(null);
//   const [userProgress, setUserProgress] = useState({});
//   const navigation = useNavigation();
//   const userId = FIREBASE_AUTH.currentUser?.uid;

//   useEffect(() => {
//     const fetchUserProgress = async () => {
//       if (userId) {
//         const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
//         const progressDoc = await getDoc(lessonTrackingRef);
//         let data = {};

//         if (progressDoc.exists()) {
//           data = progressDoc.data();
//         } else {
//           // Initialize progress if it doesn't exist
//           const initialProgress = lessons.reduce((acc, lesson) => {
//             acc[lesson.id] = false; // Set all lessons to incomplete
//             return acc;
//           }, {});
//           await setDoc(lessonTrackingRef, initialProgress);
//           data = initialProgress;
//         }

//         setUserProgress(data);
//         // Find the first incomplete lesson
//         const nextLesson = lessons.find(lesson => !data[lesson.id]);
//         setCurrentLesson(nextLesson);
//       }
//     };

//     fetchUserProgress();

//     navigation.setOptions({
//       headerRight: () => (
//         currentLesson ? (
//           <Button
//             onPress={() => markLessonComplete(currentLesson.id)}
//             title="Done"
//             color="#000"  // Set your preferred color
//           />
//         ) : null
//       )
//     });
//   }, [userId, currentLesson, navigation]);

//   const markLessonComplete = async (lessonId) => {
//     if (userId) {
//       const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
//       const newProgress = { ...userProgress, [lessonId]: true };
//       await setDoc(lessonTrackingRef, newProgress);
//       setUserProgress(newProgress);

//       const nextLesson = lessons.find(lesson => !newProgress[lesson.id]);
//       setCurrentLesson(nextLesson);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {currentLesson ? (
//         <>
//           <FullWidthPicture uri={Image.resolveAssetSource(currentLesson.image).uri} />
//         </>
//       ) : (
//         <Text style={styles.completedText}>All lessons completed!</Text>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff', // Ensures the background is white
//     paddingTop: 0 // Ensures content is flush to the top
//   },
//   completedText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 20
//   }
// });

// export default LessonTrackingScreen;

import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const lessons = [
  {
    id: 1,
    title: 'Lesson #1: Sleep Efficiency',
    image: require('../../assets/lesson1.png'),
  },
  {
    id: 2,
    title: 'Lesson #2: Sleep Quality',
    image: require('../../assets/lesson1.png'),
  },
  // Add more lessons as needed
];

const LessonTrackingScreen = () => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const navigation = useNavigation();
  const userId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    fetchUserProgress();
  }, [userId]);

  const fetchUserProgress = async () => {
    if (userId) {
      const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
      const progressDoc = await getDoc(lessonTrackingRef);
      let data = {};

      if (progressDoc.exists()) {
        data = progressDoc.data();
      } else {
        const initialProgress = lessons.reduce((acc, lesson) => ({ ...acc, [lesson.id]: false }), {});
        await setDoc(lessonTrackingRef, initialProgress);
        data = initialProgress;
      }

      setUserProgress(data);
      checkLessonsCompletion(data);
    }
  };

  const checkLessonsCompletion = (data) => {
    const allDone = Object.values(data).every(status => status);
    setAllLessonsCompleted(allDone);
    if (!allDone) {
      const nextLesson = lessons.find(lesson => !data[lesson.id]);
      setCurrentLesson(nextLesson);
    }
  };

  const markLessonComplete = async (lessonId) => {
    if (userId) {
      const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
      const newProgress = { ...userProgress, [lessonId]: true };
      await setDoc(lessonTrackingRef, newProgress);
      setUserProgress(newProgress);
      checkLessonsCompletion(newProgress);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {allLessonsCompleted ? (
        <View>
          {lessons.map((lesson) => (
            <TouchableOpacity key={lesson.id} style={styles.lessonItem} onPress={() => setCurrentLesson(lesson)}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : currentLesson ? (
        <View>
          <Text style={styles.title}>{currentLesson.title}</Text>
          <Button title="Mark as Done" onPress={() => markLessonComplete(currentLesson.id)} />
        </View>
      ) : (
        <Text style={styles.completedText}>Loading lessons...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  lessonItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  lessonTitle: {
    fontSize: 18,
  },
});

export default LessonTrackingScreen;
