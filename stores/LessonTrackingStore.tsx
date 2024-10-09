import create from 'zustand';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';

export interface Lesson {
  id: number;
  title: string;
  image: any;
}

interface LessonTrackingState {
  userProgress: Record<string, boolean>;
  allLessonsCompleted: boolean;
  currentWeek: number | null;
  lessons: Lesson[];
  fetchUserProgress: () => void;
  updateLessonProgress: (lessonId: number, completed: boolean) => Promise<void>;
}

export const useLessonTrackingStore = create<LessonTrackingState>((set) => ({
  userProgress: {},
  allLessonsCompleted: false,
  currentWeek: null,
  lessons: [
    { id: 1, title: 'Module #1: Sleep Efficiency', image: require('../assets/sleep_study_module_1.webp') },
    { id: 2, title: 'Module #2: Sleep Schedule and Restriction', image: require('../assets/sleep_study_module_2.png') },
    { id: 3, title: 'Module #3: Keeping Track', image: require('../assets/sleep_study_module_3.png') },
    { id: 4, title: 'Module #4: Naps', image: require('../assets/sleep_study_module_4.png') },
    { id: 5, title: 'Module #5: Lights and Sounds', image: require('../assets/sleep_study_module_5.png') },
    { id: 6, title: 'Module #6: Bedtime Routines', image: require('../assets/sleep_study_module_6.png') },
    { id: 7, title: 'Module #7: Healthy Eating', image: require('../assets/sleep_study_module_7.png') },
    { id: 8, title: 'Module #8: Healthy Drinks', image: require('../assets/sleep_study_module_8.png') },
    { id: 9, title: 'Module #9: Healthy Body Weight', image: require('../assets/sleep_study_module_9.png') },
    { id: 10, title: 'Module #10: Building Physical Activity and Strength', image: require('../assets/sleep_study_module_10.png') },
    { id: 11, title: 'Module #11: Stress', image: require('../assets/sleep_study_module_11.png') },
    { id: 12, title: 'Module #12: Cognitive Strategies to Improve Sleep', image: require('../assets/sleep_study_module_12.png') },
  ],
  fetchUserProgress: async () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const userDocRef = doc(FIRESTORE_DB, 'users', userId);

    // Fetch user progress and account creation date
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const creationDate = userData.creationDate;
      const currentWeek = Math.floor((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;

      // Update current week in Firestore
      await updateDoc(userDocRef, { currentWeek });

      const lessonProgress = userData.lessonProgress || {};
      const allCompleted = Object.keys(lessonProgress).length === 12 && Object.values(lessonProgress).every(status => status);

      set({
        userProgress: lessonProgress,
        allLessonsCompleted: allCompleted,
        currentWeek,
      });
    }

    // Listen for changes in lesson progress
    const lessonTrackingRef = doc(userDocRef, 'lessonTracking', 'progress');
    const unsubscribe = onSnapshot(lessonTrackingRef, (doc) => {
      if (doc.exists()) {
        set({ userProgress: doc.data() });
      }
    });

    return () => unsubscribe();
  },
  updateLessonProgress: async (lessonId: number, completed: boolean) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
    const updatedProgress = { [lessonId]: completed };

    try {
      await updateDoc(lessonTrackingRef, updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  },
}));
