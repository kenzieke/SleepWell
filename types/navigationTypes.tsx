import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lesson } from '../stores/LessonTrackingStore';

// Modify the existing RootStackParamList to include your new screens
export type RootStackParamList = {
  Main: undefined;
  'Sleep Assessment': undefined;
  ResultsScreen: undefined;
  SignUp: undefined;
  Login: undefined;
  LessonTrackingScreen: undefined;
  LessonDetailScreen: { lesson: Lesson };
  ListMain: undefined;
  WeeklyLessonsScreen: undefined;
};

// Existing RootStackNavigationProp
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define the props for LessonTrackingScreen
export type LessonTrackingScreenProps = NativeStackScreenProps<RootStackParamList, 'LessonTrackingScreen'>;

// Define the props for WeeklyLessonsScreen
export type WeeklyLessonsScreenProps = NativeStackScreenProps<RootStackParamList, 'WeeklyLessonsScreen'>;
