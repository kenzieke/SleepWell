import create from 'zustand';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';

type RootStackParamList = {
  Main: undefined;
  'Sleep Assessment': undefined;
};

interface AuthState {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  login: (navigation: NativeStackNavigationProp<RootStackParamList>) => Promise<void>;
  checkUserAssessment: (uid: string, navigation: NativeStackNavigationProp<RootStackParamList>) => Promise<void>;
  initializeAuthListener: (navigation: NativeStackNavigationProp<RootStackParamList>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  email: '',
  password: '',
  loading: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  // Login function
  login: async (navigation) => {
    const { email, password, checkUserAssessment } = get();
    set({ loading: true });
    try {
        const auth = FIREBASE_AUTH;
        await signInWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user) {
        await checkUserAssessment(user.uid, navigation);
        }
    } catch (error) {
        // Check if error is an instance of Error
        if (error instanceof Error) {
        console.error('Login failed:', error.message);
        alert('Login failed: ' + error.message);
        } else {
        // Handle unexpected error types
        console.error('An unknown error occurred during login', error);
        alert('An unknown error occurred.');
        }
    } finally {
        set({ loading: false });
    }
    },

  // Check if the user completed the assessment
  checkUserAssessment: async (uid: string, navigation: NativeStackNavigationProp<RootStackParamList>) => {
    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', uid, 'results', `scores_${uid}`);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const routeName = userData.completedAssessment ? 'Main' : 'Sleep Assessment';
        navigation.replace(routeName);
      } else {
        navigation.replace('Sleep Assessment');
      }
    } catch (error) {
      console.error('Error checking assessment:', error);
    }
  },

  // Initialize the Firebase auth listener
  initializeAuthListener: (navigation: NativeStackNavigationProp<RootStackParamList>) => {
    const auth = FIREBASE_AUTH;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        get().checkUserAssessment(user.uid, navigation);
      }
    });
  },
}));
