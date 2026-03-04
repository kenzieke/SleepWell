import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// Custom header title component with controlled font scaling
const HeaderTitle: React.FC<{ children: string }> = ({ children }) => (
  <Text
    allowFontScaling={true}
    maxFontSizeMultiplier={1.3}
    style={{ fontSize: 17, fontWeight: '600', color: '#000' }}
  >
    {children}
  </Text>
);
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import ListScreen from '../app/screens/SleepCoachScreen';
import LessonTrackingScreen from '../app/screens/LessonTrackingScreen';
import SleepAssessmentScreen from '../app/screens/SleepAssessmentScreen';
import ResultsScreen from '../app/screens/ResultsScreen';
import LessonDetailScreen from '../app/screens/LessonDetailScreen';
import AudioPlayerScreen from '../app/screens/AudioPlayerScreen';
import SettingsScreen from '../app/screens/SettingsScreen';
import BottomTabNavigator from '../app/components/BottomTabNavigator';
import WeeklyModuleModal from '../app/components/WeeklyModuleModal';
import { RootStackParamList } from '../types/navigationTypes';
import { useLessonTrackingStore } from '../stores/LessonTrackingStore';
import { useLessonStore } from '../stores/LessonStore';
import { findLessonByWeek } from '../utils/lessonHelpers';

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
    const lesson = findLessonByWeek(lessons, currentWeek);
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
        moduleName={findLessonByWeek(lessons, currentWeek)?.title || 'Module'}
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
                headerTitle: () => <HeaderTitle>Sleep Assessment</HeaderTitle>,
                headerTitleAlign: 'center',
                headerLeft: () => null, // Disable back button during initial assessment
                headerLeftContainerStyle: { width: 0 }, // Remove left space to center title properly
              }}
            />

            <Stack.Screen
              name="ResultsScreen"
              component={ResultsScreen}
              options={({ navigation, route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderTitle>Sleep Assessment Results</HeaderTitle>,
                headerBackTitleVisible: false,
                headerRight: () => {
                  // Only show "Next" button if not coming from tracker (initial assessment flow)
                  const fromTracker = route.params?.fromTracker;
                  if (fromTracker) {
                    return null;
                  }
                  return (
                    <TouchableOpacity
                      onPress={() => navigation.replace('Main')}
                      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    >
                      <Text
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1.3}
                        style={{ color: '#52796F', fontSize: 17 }}
                      >
                        Next
                      </Text>
                    </TouchableOpacity>
                  );
                },
                headerLeft: () => {
                  // Only show "Back" button if coming from tracker
                  // During initial assessment, prevent going back to assessment/signup
                  const fromTracker = route.params?.fromTracker;
                  if (fromTracker) {
                    return (
                      <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                      >
                        <Text
                          allowFontScaling={true}
                          maxFontSizeMultiplier={1.3}
                          style={{ color: '#52796F', fontSize: 17 }}
                        >
                          Back
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                },
              })}
            />

            <Stack.Screen
              name="ListMain"
              component={ListScreen}
              options={({ navigation }) => ({
                headerTitle: () => <HeaderTitle>Sleep Coach</HeaderTitle>,
                headerShown: true,
                headerTitleAlign: 'center',
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                  >
                    <Text
                      allowFontScaling={true}
                      maxFontSizeMultiplier={1.3}
                      style={{ color: '#52796F', fontSize: 17 }}
                    >
                      Back
                    </Text>
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="LessonTrackingScreen"
              component={LessonTrackingScreen}
              options={({ navigation }) => ({
                headerTitle: () => <HeaderTitle>Modules</HeaderTitle>,
                headerShown: true,
                headerTitleAlign: 'center',
                headerLeft: () => (
                  // Use goBack to avoid stacking 'Main' repeatedly
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                  >
                    <Text
                      allowFontScaling={true}
                      maxFontSizeMultiplier={1.3}
                      style={{ color: '#52796F', fontSize: 17 }}
                    >
                      Back
                    </Text>
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="LessonDetailScreen"
              component={LessonDetailScreen}
              options={{ headerTitle: () => <HeaderTitle>Module Detail</HeaderTitle> }}
            />

            <Stack.Screen
              name="AudioPlayerScreen"
              component={AudioPlayerScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => <HeaderTitle>Audio Player</HeaderTitle>,
                headerTitleAlign: 'center',
                headerLeft: () => (
                  // Pop back to the previous screen instead of navigating to 'Main'
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                  >
                    <Text
                      allowFontScaling={true}
                      maxFontSizeMultiplier={1.3}
                      style={{ color: '#52796F', fontSize: 17 }}
                    >
                      Back
                    </Text>
                  </TouchableOpacity>
                ),
              })}
            />

            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => <HeaderTitle>Settings</HeaderTitle>,
                headerTitleAlign: 'center',
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                  >
                    <Text
                      allowFontScaling={true}
                      maxFontSizeMultiplier={1.3}
                      style={{ color: '#52796F', fontSize: 17 }}
                    >
                      Back
                    </Text>
                  </TouchableOpacity>
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
