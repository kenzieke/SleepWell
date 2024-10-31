import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lesson } from '../stores/LessonTrackingStore';

// Modify the existing RootStackParamList to include your new screens
export type RootStackParamList = {
  Main: undefined;
  'Sleep Assessment': undefined;
  ResultsScreen: undefined;
  SignUpScreen: undefined;
  LoginScreen: undefined;
  LessonTrackingScreen: undefined;
  LessonDetailScreen: { lesson: Lesson };
  ListMain: undefined;
  WeeklyLessonsScreen: undefined;
  SleepAssessmentScreen: undefined;
  SleepTrackerScreen: undefined,
};

// Existing RootStackNavigationProp
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define the props for LessonTrackingScreen
export type LessonTrackingScreenProps = NativeStackScreenProps<RootStackParamList, 'LessonTrackingScreen'>;

// Define the props for WeeklyLessonsScreen
export type WeeklyLessonsScreenProps = NativeStackScreenProps<RootStackParamList, 'WeeklyLessonsScreen'>;

// Define the props for ResultsScreen
export type ResultsScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'ResultsScreen'>;

// Define the props for SignUpScreen
export type SignUpScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SignUpScreen'>;

export type SleepAssessmentScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SleepAssessmentScreen'>;

export type LoginScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

export type SleepTrackerScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SleepTrackerScreen'>;
