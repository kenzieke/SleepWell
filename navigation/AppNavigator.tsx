import React, { useEffect, useRef } from 'react';
import { Button } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import ListScreen from '../app/screens/SleepCoachScreen';
import LessonTrackingScreen from '../app/screens/LessonTrackingScreen';
import SleepAssessmentScreen from '../app/screens/SleepAssessment';
import ResultsScreen from '../app/screens/ResultsScreen';
import LessonDetailScreen from '../app/screens/LessonDetailScreen';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { RootStackParamList } from '../types/navigationTypes';  // Define the stack params in types

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  user: { uid: string } | null;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ user }) => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Function to check user document in Firebase
  const checkUserDocument = async () => {
    if (user) {
      const userDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'results', `scores_${user.uid}`);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const routeName = userData?.completedAssessment ? 'Main' : 'Sleep Assessment';
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: routeName }],
        });
      } else {
        console.log('No user document!');
        navigationRef.current?.navigate('Sleep Assessment');
      }
    } else {
      navigationRef.current?.navigate('Login');
    }
  };

  useEffect(() => {
    checkUserDocument();
  }, [user]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Conditional rendering for user-based screens */}
        {user && (
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen
              name="Sleep Assessment"
              component={SleepAssessmentScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="ResultsScreen"
              component={ResultsScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerBackTitleVisible: false,
                title: 'Sleep Assessment Results',
                headerRight: () => (
                  <Button onPress={() => navigation.navigate('Main')} title="Next" color="#52796F" />
                ),
                headerLeft: () => (
                  <Button onPress={() => navigation.navigate('Sleep Assessment')} title="Back" color="#52796F" />
                ),
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
                  <Button onPress={() => navigation.navigate('Main')} title="Back" color="#52796F" />
                ),
                headerRight: () => (
                  <Button
                    onPress={() => {
                      FIREBASE_AUTH.signOut()
                        .then(() => navigation.navigate('Login'))
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
                  <Button onPress={() => navigation.navigate('Main')} title="Back" color="#52796F" />
                ),
              })}
            />
            <Stack.Screen
              name="LessonDetailScreen"
              component={LessonDetailScreen}
              options={{ title: 'Module Detail' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
