import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import ListScreen from '../app/screens/SleepCoachScreen';
import LessonTrackingScreen from '../app/screens/LessonTrackingScreen';
import SleepAssessmentScreen from '../app/screens/SleepAssessmentScreen';
import ResultsScreen from '../app/screens/ResultsScreen';
import LessonDetailScreen from '../app/screens/LessonDetailScreen';
import AudioPlayerScreen from '../app/screens/AudioPlayerScreen';
import BottomTabNavigator from '../app/components/BottomTabNavigator';
import WeeklyModuleModal from '../app/components/WeeklyModuleModal';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { RootStackParamList } from '../types/navigationTypes';
import { useLessonTrackingStore } from '../stores/LessonTrackingStore';
import { useLessonStore } from '../stores/LessonStore';

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  user: { uid: string } | null;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ user }) => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Access Zustand store values
  const { userProgress, currentWeek, fetchUserProgress, lessons } = useLessonTrackingStore();
  const { setLesson } = useLessonStore();

  useEffect(() => {
    if (user) {
      fetchUserProgress(); // Fetch user progress when user logs in
    }
  }, [user]);

  // Check if the user needs to complete this week's module
  useEffect(() => {
    if (currentWeek !== null && userProgress) {
      const isCompleted = userProgress[currentWeek] ?? true; // Default to true if undefined
      console.log(`Current week: ${currentWeek}, Completed: ${isCompleted}`);
  
      if (!isCompleted) {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    }
  }, [currentWeek, userProgress]);  

  const handleDoNow = () => {
    setModalVisible(false);
    const lesson = lessons.find((l) => l.id === currentWeek);
    if (lesson) {
      setLesson(lesson); // Store lesson in Zustand for navigation
      navigationRef.current?.navigate('LessonDetailScreen', { lesson });
    }
  };

  const handleLater = () => {
    setModalVisible(false);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <WeeklyModuleModal
        visible={modalVisible}
        moduleName={lessons.find((l) => l.id === currentWeek)?.title || 'Module'}
        onDoNow={handleDoNow}
        onLater={handleLater}
      />
  <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Conditional rendering for user-based screens */}
        {user && (
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen
              name="SleepAssessmentScreen"
              component={SleepAssessmentScreen}
              options={{
                headerShown: true,
                title: 'Sleep Assessment',
                headerTitleAlign: 'center',
                headerLeft: () => null, // Disable back button during initial assessment
              }}
            />

            <Stack.Screen
              name="ResultsScreen"
              component={ResultsScreen}
              options={({ navigation, route }) => ({
                headerShown: true,
                title: 'Sleep Assessment Results',
                headerBackTitleVisible: false,
                headerRight: () => {
                  // Only show "Next" button if not coming from tracker (initial assessment flow)
                  const fromTracker = route.params?.fromTracker;
                  if (fromTracker) {
                    return null;
                  }
                  return (
                    <Button onPress={() => navigation.replace('Main')} title="Next" color="#52796F" />
                  );
                },
                headerLeft: () => {
                  // Only show "Back" button if coming from tracker
                  // During initial assessment, prevent going back to assessment/signup
                  const fromTracker = route.params?.fromTracker;
                  if (fromTracker) {
                    return <Button onPress={() => navigation.goBack()} title="Back" color="#52796F" />;
                  }
                  return null;
                },
              })}
            />

            <Stack.Screen
              name="ListMain"
              component={ListScreen}
              options={({ navigation }) => ({
                title: 'Sleep Coaches',
                headerShown: true,
                headerTitleAlign: 'center',
                headerLeft: () => (
                  // Pop back to the previous screen instead of navigating to 'Main' again
                  <Button onPress={() => navigation.goBack()} title="Back" color="#52796F" />
                ),
                headerRight: () => (
                  <Button
                    onPress={() => {
                      FIREBASE_AUTH.signOut()
                        .then(() =>
                          navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                          })
                        )
                        .catch((error) => console.error('Logout error:', error));
                    }}
                    title="Logout"
                    color="#52796F"
                  />
                ),
              })}
            />

            <Stack.Screen
              name="LessonTrackingScreen"
              component={LessonTrackingScreen}
              options={({ navigation }) => ({
                title: 'Modules',
                headerShown: true,
                headerTitleAlign: 'center',
                headerLeft: () => (
                  // Use goBack to avoid stacking 'Main' repeatedly
                  <Button onPress={() => navigation.goBack()} title="Back" color="#52796F" />
                ),
              })}
            />

            <Stack.Screen
              name="LessonDetailScreen"
              component={LessonDetailScreen}
              options={{ title: 'Module Detail' }}
            />

            <Stack.Screen
              name="AudioPlayerScreen"
              component={AudioPlayerScreen}
              options={({ navigation }) => ({
                headerShown: true,
                title: 'Audio Player',
                headerTitleAlign: 'center',
                headerLeft: () => (
                  // Pop back to the previous screen instead of navigating to 'Main'
                  <Button onPress={() => navigation.goBack()} title="Back" color="#52796F" />
                ),
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
