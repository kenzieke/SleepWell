import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lesson } from '../stores/LessonTrackingStore';

// Modify the existing RootStackParamList to include your new screens
export type RootStackParamList = {
  Main: undefined;
  ResultsScreen: undefined;
  SignUp: undefined;
  Login: undefined;
  LessonTrackingScreen: undefined;
  LessonDetailScreen: { lesson: Lesson };
  ListMain: undefined;
  WeeklyLessonsScreen: undefined;
  SleepAssessmentScreen: undefined;
  SleepTrackerScreen: undefined;
  AudioPlayerScreen: { moduleTitle: string; moduleSubtitle: string };
};

// Existing RootStackNavigationProp
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type LessonTrackingScreenProps = NativeStackScreenProps<RootStackParamList, 'LessonTrackingScreen'>;

export type WeeklyLessonsScreenProps = NativeStackScreenProps<RootStackParamList, 'WeeklyLessonsScreen'>;

export type ResultsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'ResultsScreen'>;

export type SignUpScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export type SleepAssessmentScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SleepAssessmentScreen'>;

export type LoginScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Login'>;

export type SleepTrackerScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SleepTrackerScreen'>;

export type AudioPlayerScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'AudioPlayerScreen'>;
