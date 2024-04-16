import * as React from 'react';
import { Button } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import WeeklyLessonsScreen from '../app/screens/WeeklyLessonsScreen';
import SleepAssessmentScreen from '../app/screens/SleepAssessment';
import WeeklyGoals from '../app/screens/WeeklyGoals';
import ResultsScreen from '../app/screens/ResultsScreen';

// const Stack = createStackNavigator();

// function AppNavigator({ user }) {
//   const initialRouteName = user ? 'Sleep Assessment' : 'Login';

//   return (
//     <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="WeeklyGoals" component={WeeklyGoals} />
//       <Stack.Screen
//         name="ResultsScreen"
//         component={ResultsScreen}
//         options={({ navigation }) => ({
//           headerShown: true,
//           headerBackTitleVisible: false, // iOS specific option to not show the back title
//           title: 'Sleep Assessment Results',
//           headerRight: () => (
//             <Button
//               onPress={() => navigation.navigate('WeeklyGoals')}
//               title="Next"
//               color='#52796F'
//             />
//           ),
//             headerLeft: () => (
//               <Button
//                 onPress={() => navigation.navigate('Sleep Assessment')}
//                 title="Back"
//                 color='#52796F'
//               />
//           ),
//         })}
//       />
//       {user && <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} options={{ headerShown: true }} />}
//     </Stack.Navigator>
//   );
// }

// export default AppNavigator;

//... other imports
import BottomTabNavigator from '../components/BottomTabNavigator';

const Stack = createStackNavigator();

// function AppNavigator({ user }) {
//   const initialRouteName = user ? 'Main' : 'Login';

//   return (
//     <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
//       {user && <Stack.Screen name="Main" component={BottomTabNavigator} />}
//       <Stack.Screen name="WeeklyGoals" component={WeeklyGoals} />
//     <Stack.Screen
//         name="ResultsScreen"
//         component={ResultsScreen}
//         options={({ navigation }) => ({
//           headerShown: true,
//           headerBackTitleVisible: false, // iOS specific option to not show the back title
//           title: 'Sleep Assessment Results',
//           headerRight: () => (
//             <Button
//               onPress={() => navigation.navigate('WeeklyGoals')}
//               title="Next"
//               color='#52796F'
//             />
//           ),
//             headerLeft: () => (
//               <Button
//                 onPress={() => navigation.navigate('Sleep Assessment')}
//                 title="Back"
//                 color='#52796F'
//               />
//           ),
//         })}
//       />
//       {user && <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} options={{ headerShown: true }} />}
//     </Stack.Navigator>
//   );
// }

function AppNavigator({ user }) {
  const initialRouteName = user ? 'Main' : 'Login';

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      {user && <Stack.Screen name="Main" component={BottomTabNavigator} />}
      {/* Remove the WeeklyGoals Stack.Screen here */}
      <Stack.Screen
        name="ResultsScreen"
        component={ResultsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false, // iOS specific option to not show the back title
          title: 'Sleep Assessment Results',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Main')}
              title="Next"
              color='#52796F'
            />
          ),
            headerLeft: () => (
              <Button
                onPress={() => navigation.navigate('Sleep Assessment')}
                title="Back"
                color='#52796F'
              />
          ),
        })}
      />
      {user && <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} options={{ headerShown: true }} />}
    </Stack.Navigator>
  );
}


export default AppNavigator;
