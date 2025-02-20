import create from 'zustand';
import { FIREBASE_AUTH } from '../FirebaseConfig';

type Lesson = {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  completed: boolean;
};

interface LessonState {
  lesson: Lesson;
  userId: string | undefined;
  setLesson: (lesson: Lesson) => void;
  setUserId: () => void;
  markLessonAsComplete: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  lesson: { id: 0, title: '', image: '', completed: false },
  userId: undefined,
  setLesson: (lesson) => set({ lesson }),
  setUserId: () => set({ userId: FIREBASE_AUTH.currentUser?.uid }),

  markLessonAsComplete: () =>
    set((state) => ({
      lesson: { ...state.lesson, completed: true },
    })),
}));
