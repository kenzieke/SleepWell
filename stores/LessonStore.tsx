import create from 'zustand';
import { FIREBASE_AUTH } from '../FirebaseConfig';

interface LessonState {
  lesson: { id: string; title: string; image: any };
  userId: string | undefined;
  setLesson: (lesson: { id: string; title: string; image: any }) => void;
  setUserId: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  lesson: { id: '', title: '', image: '' },
  userId: undefined,
  setLesson: (lesson) => set({ lesson }),
  setUserId: () => set({ userId: FIREBASE_AUTH.currentUser?.uid }),
}));
