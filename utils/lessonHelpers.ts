import { doc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes';
import { useLessonStore } from '../stores/LessonStore';

export const markLessonComplete = async (
  userId: string,
  lessonId: string,
  lessonTitle: string,
  navigation: NativeStackNavigationProp<RootStackParamList, 'LessonDetailScreen'>
) => {
  if (userId) {
    const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
    const updatedProgress = { [lessonId]: true };
    try {
      await setDoc(lessonTrackingRef, updatedProgress, { merge: true });
      console.log(`Marking ${lessonTitle} as complete`);

      // ✅ Update Zustand store for UI reactivity
      useLessonStore.getState().markLessonAsComplete();

      navigation.goBack();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  } else {
    console.error('User ID is undefined.');
  }
};
