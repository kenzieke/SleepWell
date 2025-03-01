import { doc, getDoc } from 'firebase/firestore';
import create from 'zustand';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { ImageSourcePropType } from 'react-native';
import { getCategoryDetails } from '../utils/resultsHelpers';

import scaleImage from '../assets/scale.png';

interface Results {
    insomniaSeverityIndex?: number;
    sleepApneaRisk?: number;
    sleepEfficiency?: number;
    bmi?: number;
    diet?: number;
    physicalActivity?: number;
    stress?: number;
}
  
interface CategoryDetails {
    image: ImageSourcePropType;
    score: number | string;
    description: string;
}

const categories = [
    { name: 'Insomnia Severity Index', image: scaleImage },
    { name: 'Sleep Apnea Risk', image: scaleImage },
    { name: 'Sleep Efficiency', image: scaleImage },
    { name: 'Body Mass Index', image: scaleImage },
    { name: 'Diet', image: scaleImage },
    { name: 'Physical Activity', image: scaleImage },
    { name: 'Stress', image: scaleImage },
];

interface ResultsStore {
  results: Results;
  isModalVisible: boolean;
  selectedCategory: string | null;
  fetchResults: () => void;
  setModalVisible: (visible: boolean) => void;
  setSelectedCategory: (category: string | null) => void;
  getCategoryDetails: (results: Results) => Record<string, CategoryDetails>;
}

export const useResultsStore = create<ResultsStore>((set) => ({
  results: {},
  isModalVisible: false,
  selectedCategory: null,
  categories,

  fetchResults: async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userId = user.uid;
      const resultsDocRef = doc(FIRESTORE_DB, 'users', userId, 'results', `scores_${userId}`);
      const docSnap = await getDoc(resultsDocRef);
      if (docSnap.exists()) {
        set({ results: docSnap.data() as Results });
      } else {
        console.log("No results available.");
      }
    }
  },

  setModalVisible: (visible) => set({ isModalVisible: visible }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  getCategoryDetails: (results) => getCategoryDetails(results),
}));

export { CategoryDetails, Results };
