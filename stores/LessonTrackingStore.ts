/* eslint-disable @typescript-eslint/no-require-imports */
import create from 'zustand';
import { doc, getDoc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';

export interface Lesson {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  completed: boolean;
}

interface LessonTrackingState {
  userProgress: Record<string, boolean>;
  allLessonsCompleted: boolean;
  currentWeek: number | null;
  lessons: Lesson[];
  unsubscribe: (() => void) | null;
  fetchUserProgress: () => void;
  updateLessonProgress: (lessonId: number, completed: boolean) => Promise<void>;
  cleanup: () => void;
}

export const useLessonTrackingStore = create<LessonTrackingState>((set, get) => ({
  userProgress: {},
  allLessonsCompleted: false,
  currentWeek: null,
  unsubscribe: null,
  lessons: [
    { id: 1, title: 'Module #1: Sleep Efficiency', image: require('../assets/modules/fall_2025_ssm1.png'), completed: false },
    { id: 2, title: 'Module #2: Sleep Schedule and Restriction', image: require('../assets/modules/fall_2025_ssm2.png'), completed: false },
    { id: 3, title: 'Module #3: Keeping Track', image: require('../assets/modules/fall_2025_ssm3.png'), completed: false },
    { id: 4, title: 'Module #4: Naps', image: require('../assets/modules/fall_2025_ssm4.png'), completed: false },
    { id: 5, title: 'Module #5: Lights and Sounds', image: require('../assets/modules/fall_2025_ssm5.png'), completed: false },
    { id: 6, title: 'Module #6: Bedtime Routines', image: require('../assets/modules/fall_2025_ssm6.png'), completed: false },
    { id: 7, title: 'Module #7: Healthy Eating', image: require('../assets/modules/fall_2025_ssm7.png'), completed: false },
    { id: 8, title: 'Module #8: Healthy Drinks', image: require('../assets/modules/fall_2025_ssm8.png'), completed: false },
    { id: 9, title: 'Module #9: Healthy Body Weight', image: require('../assets/modules/fall_2025_ssm9.png'), completed: false },
    { id: 10, title: 'Module #10: Building Physical Activity and Strength', image: require('../assets/modules/fall_2025_ssm10.png'), completed: false },
    { id: 11, title: 'Module #11: Stress', image: require('../assets/modules/fall_2025_ssm11.png'), completed: false },
    { id: 12, title: 'Module #12: Cognitive Strategies to Improve Sleep', image: require('../assets/modules/fall_2025_ssm12.png'), completed: false },
  ],

  fetchUserProgress: async () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const userDocRef = doc(FIRESTORE_DB, 'users', userId);

    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const creationDate = userData.creationDate;
      const currentWeek = Math.floor((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;

      await updateDoc(userDocRef, { currentWeek });

      const lessonProgress = userData.lessonProgress || {};
      const allCompleted = Object.keys(lessonProgress).length === 12 && Object.values(lessonProgress).every(status => status);

      set({
        userProgress: lessonProgress,
        allLessonsCompleted: allCompleted,
        currentWeek,
      });
    }

    const lessonTrackingRef = doc(userDocRef, 'lessonTracking', 'progress');

    // Cleanup any existing subscription before creating a new one
    const currentUnsubscribe = get().unsubscribe;
    if (currentUnsubscribe) {
      currentUnsubscribe();
    }

    const unsubscribe = onSnapshot(lessonTrackingRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const allCompleted = Object.keys(data).length === 12 && Object.values(data).every(status => status);
        set({ userProgress: data, allLessonsCompleted: allCompleted });
      }
    });

    set({ unsubscribe });
  },

  cleanup: () => {
    const unsubscribe = get().unsubscribe;
    if (unsubscribe) {
      unsubscribe();
      set({
        unsubscribe: null,
        userProgress: {},
        allLessonsCompleted: false,
        currentWeek: null,
      });
    }
  },

  updateLessonProgress: async (lessonId: number, completed: boolean) => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
    const currentProgress = get().userProgress;
    const updatedProgress = { ...currentProgress, [lessonId]: completed };

    try {
      await setDoc(lessonTrackingRef, { [lessonId]: completed }, { merge: true });
      
      // ✅ Immediately update local state for real-time UI feedback
      const allCompleted = Object.keys(updatedProgress).length === 12 && Object.values(updatedProgress).every(status => status);

      set({
        userProgress: updatedProgress,
        allLessonsCompleted: allCompleted,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  },
}));
