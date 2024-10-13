import create from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { calculateBmiProgress, calculateHealthMetrics, updateProgressBasedOnWeek } from '../utils/calculations';

interface ProgressDataItem {
  label: string;
  value?: number;
  score?: number;
  avgEfficiency?: number;
}

interface WeeklyLessonsState {
  progressData: ProgressDataItem[];
  fetchData: (userId: string) => Promise<void>;
}

export const useWeeklyLessonsStore = create<WeeklyLessonsState>((set) => ({
  progressData: [
    { label: 'Sleep Efficiency', score: 0, avgEfficiency: 0 },
    { label: 'Body Comp', value: 0 },
    { label: 'Nutrition', value: 0 },
    { label: 'Physical Activity', value: 0 },
    { label: 'Stress', value: 0 },
    { label: 'Weekly Module', value: 0 },
  ],

  fetchData: async (userId: string) => {
    // Fetch user document
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) return;

    const userData = userDocSnapshot.data();
    const creationDate = new Date(userData?.creationDate);

    // Fetch lesson tracking progress
    const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
    const lessonTrackingSnapshot = await getDoc(lessonTrackingRef);

    let lessonProgress = {};
    if (lessonTrackingSnapshot.exists()) {
      lessonProgress = lessonTrackingSnapshot.data();
    }

    const currentWeekLessonCompleted = updateProgressBasedOnWeek(creationDate, lessonProgress);

    // Calculate BMI progress
    const bmiProgress = await calculateBmiProgress(userId, FIRESTORE_DB);

    // Set the date range (current week and previous week)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek); // Previous Sunday
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Following Saturday

    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(startDate.getDate() - 7); // Previous week's Sunday
    const prevEndDate = new Date(endDate);
    prevEndDate.setDate(endDate.getDate() - 7); // Previous week's Saturday

    // Calculate health metrics (sleep, physical activity, nutrition, etc.)
    const metrics = await calculateHealthMetrics(
      FIRESTORE_DB,
      userId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      prevStartDate.toISOString().split('T')[0],
      prevEndDate.toISOString().split('T')[0]
    );

    // Update the progress data state
    set((state) => ({
      progressData: state.progressData.map((item) => {
        switch (item.label) {
          case 'Body Comp':
            return { ...item, value: bmiProgress };
          case 'Physical Activity':
            return { ...item, value: metrics.physicalActivityPercentage };
          case 'Nutrition':
            return { ...item, value: metrics.dietPercentage };
          case 'Stress':
            return { ...item, value: metrics.stressPercentage };
          case 'Sleep Efficiency':
            return { ...item, value: metrics.sleepEfficiencyScore, avgEfficiency: metrics.avgSleepEfficiency };
          case 'Weekly Module':
            return { ...item, value: currentWeekLessonCompleted ? 100 : 0 };
          default:
            return item;
        }
      }),
    }));
  },
}));
