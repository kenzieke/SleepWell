import create from 'zustand';

type OptionType = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe' |
                  'Very Poor' | 'Okay' | 'Good' | 'Outstanding' | 'Poor' |
                  'null';

interface HealthTrackerState {
  date: Date;
  caffeine: string;
  vegetables: string;
  sugaryDrinks: string;
  fastFood: string;
  minPA: string;
  goals: string;
  dailyWeight: string;
  weightUnit: string;
  rateDiet: OptionType;
  stressLevel: OptionType;
  isLoading: boolean;
  setInput: (field: string, value: any) => void;
  clearForm: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useHealthTrackerStore = create<HealthTrackerState>((set) => ({
  date: new Date(),
  caffeine: '',
  vegetables: '',
  sugaryDrinks: '',
  fastFood: '',
  minPA: '',
  goals: '',
  dailyWeight: '',
  weightUnit: 'kgs',
  rateDiet: 'null',
  stressLevel: 'null',
  isLoading: false,
  setInput: (field, value) => set({ [field]: value }),
  clearForm: () =>
    set({
      caffeine: '',
      vegetables: '',
      sugaryDrinks: '',
      fastFood: '',
      minPA: '',
      goals: '',
      dailyWeight: '',
      weightUnit: 'kgs',
      rateDiet: 'null',
      stressLevel: 'null',
    }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
