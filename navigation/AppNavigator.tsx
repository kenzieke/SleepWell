// import * as React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../app/screens/LoginScreen';
// import SignUpScreen from '../app/screens/SignUpScreen';
// import WeeklyLessonsScreen from '../app/screens/WeeklyLessonsScreen';

// const Stack = createStackNavigator();

// function AppNavigator() {
//   return (
//     <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="WeeklyLessons" component={WeeklyLessonsScreen} />
//     </Stack.Navigator>
//   );
// }

// export default AppNavigator; 

import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import WeeklyLessonsScreen from '../app/screens/WeeklyLessonsScreen';
import SleepAssessmentScreen from '../app/screens/SleepAssessment';

const Stack = createStackNavigator();

function AppNavigator({ user }) {
  const initialRouteName = user ? 'Sleep Assessment' : 'Login';

  return (
    // <Stack.Navigator initialRouteName={user ? "SleepAssessment" : "Login"} screenOptions={{ headerShown: false }}>
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WeeklyLessons" component={WeeklyLessonsScreen} />
      {/* Make sure the user can't go back to the assessment screen without authentication */}
      {/* {user && (
        <Stack.Screen name="SleepAssessment" component={SleepAssessmentScreen} />
      )} */}
      {user && <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} options={{ headerShown: true }} />}
    </Stack.Navigator>
  );
}

export default AppNavigator;
