import create from 'zustand';
import { FIREBASE_AUTH } from '../FirebaseConfig';

// Define the Lesson type
type Lesson = {
  id: number; // Update the type to match your actual data
  title: string;
  image: any;
};

interface LessonState {
  lesson: Lesson; // Include the lesson field in the state
  userId: string | undefined;
  setLesson: (lesson: Lesson) => void; // Use the Lesson type for setLesson
  setUserId: () => void;
}

// Create the Zustand store with the correct types
export const useLessonStore = create<LessonState>((set) => ({
  lesson: { id: 0, title: '', image: '' }, // Default values for the lesson
  userId: undefined,
  setLesson: (lesson) => set({ lesson }), // Use the Lesson type for the setter
  setUserId: () => set({ userId: FIREBASE_AUTH.currentUser?.uid }), // Set userId based on current Firebase user
}));
