import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import WeeklyLessonsScreen from '../app/screens/WeeklyLessonsScreen';
import SleepAssessmentScreen from '../app/screens/SleepAssessment';
import ResultsScreen from '../app/screens/ResultsScreen';

const Stack = createStackNavigator();

function AppNavigator({ user }) {
  const initialRouteName = user ? 'Sleep Assessment' : 'Login';

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WeeklyLessons" component={WeeklyLessonsScreen} />
      <Stack.Screen name="ResultsScreen" component={ResultsScreen} options={{ 
        headerShown: true,
        title: 'Sleep Assessment Results' }} />
      {user && <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} options={{ headerShown: true }} />}
    </Stack.Navigator>
  );
}

export default AppNavigator;
