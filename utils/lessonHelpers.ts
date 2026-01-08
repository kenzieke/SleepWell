import { doc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes';
import { useLessonStore } from '../stores/LessonStore';
import type { Lesson } from '../stores/LessonTrackingStore';

/**
 * Find a lesson by matching the subtitle within its title.
 * Useful when you have the extracted subtitle (e.g., "Sleep Efficiency")
 * and need to find the full lesson object.
 */
export const findLessonBySubtitle = (
  lessons: Lesson[],
  subtitle: string
): Lesson | undefined => {
  return lessons.find((lesson) => lesson.title.includes(subtitle));
};

/**
 * Find a lesson by its week/id number.
 */
export const findLessonByWeek = (
  lessons: Lesson[],
  week: number | null
): Lesson | undefined => {
  if (week === null) return undefined;
  return lessons.find((lesson) => lesson.id === week);
};

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
