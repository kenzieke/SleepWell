import create from 'zustand';
import { OptionType } from '../components/OptionButton';

interface SleepAssessmentState {
  isDeployed: boolean;
  isOnDuty: boolean;
  difficultyFallingAsleep: { text: OptionType; value: number };
  difficultyStayingAsleep: { text: OptionType; value: number };
  problemsWakingUpEarly: { text: OptionType; value: number };
  sleepSatisfaction: { text: OptionType; value: number };
  noticeableSleep: { text: OptionType; value: number };
  worriedAboutSleep: { text: OptionType; value: number };
  interferingWithSleep: { text: OptionType; value: number };
  snoreLoudly: { text: OptionType; value: number };
  feelTired: { text: OptionType; value: number };
  stopBreathing: { text: OptionType; value: number };
  stressLevel: { text: OptionType; value: number };
  caffeinatedBeverages: string;
  sugaryBeverages: string;
  timesWakeUp: string;
  sleepHours: string;
  sleepMinutes: string;
  fallAsleepHours: string;
  fallAsleepMinutes: string;
  timeAwakeHours: string;
  timeAwakeMinutes: string;
  hours: string;
  minutes: string;
  fastFood: string;
  servings: string;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;

  setIsDeployed: (status: boolean) => void;
  setIsOnDuty: (status: boolean) => void;
  setOption: (key: keyof SleepAssessmentState['options'], option: { text: OptionType; value: number }) => void;
  setField: (key: keyof SleepAssessmentState, value: string) => void;
  setHeightUnit: (unit: string) => void;
  setWeightUnit: (unit: string) => void;
}

export const useSleepAssessmentStore = create<SleepAssessmentState>((set) => ({
  isDeployed: false,
  isOnDuty: false,
  difficultyFallingAsleep: { text: 'null', value: -1 },
  difficultyStayingAsleep: { text: 'null', value: -1 },
  problemsWakingUpEarly: { text: 'null', value: -1 },
  sleepSatisfaction: { text: 'null', value: -1 },
  noticeableSleep: { text: 'null', value: -1 },
  worriedAboutSleep: { text: 'null', value: -1 },
  interferingWithSleep: { text: 'null', value: -1 },
  snoreLoudly: { text: 'null', value: -1 },
  feelTired: { text: 'null', value: -1 },
  stopBreathing: { text: 'null', value: -1 },
  stressLevel: { text: 'null', value: -1 },
  caffeinatedBeverages: '',
  sugaryBeverages: '',
  timesWakeUp: '',
  sleepHours: '0',
  sleepMinutes: '0',
  fallAsleepHours: '0',
  fallAsleepMinutes: '0',
  timeAwakeHours: '0',
  timeAwakeMinutes: '0',
  hours: '0',
  minutes: '0',
  fastFood: '',
  servings: '',
  height: '',
  heightUnit: 'cm',
  weight: '',
  weightUnit: 'kgs',

  setIsDeployed: (status) => set({ isDeployed: status }),
  setIsOnDuty: (status) => set({ isOnDuty: status }),
  setOption: (key, option) => set({ [key]: option }),
  setField: (key, value) => set({ [key]: value }),
  setHeightUnit: (unit) => set({ heightUnit: unit }),
  setWeightUnit: (unit) => set({ weightUnit: unit }),

  setOption: (key: keyof SleepAssessmentState['options'], option: { text: OptionType; value: number }) =>
    set((state) => ({
      options: {
        ...state.options,
        [key]: option,
      },
    })),  
}));
