// BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/build/Ionicons';

import SleepTrackerScreen from '../app/screens/SleepTracker';
import HealthTrackerScreen from '../app/screens/HealthTracker';
import WeeklyGoals from '../app/screens/WeeklyGoals';
import ResourceLibraryScreen from '../app/screens/ResourceLibrary';
import WeeklyLessonsScreen from '../app/screens/WeeklyLessonsScreen';
import List from '../app/screens/List';
import { TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';

type screenType={
  SleepTrackerScreen:undefined,
  HealthTrackerScreen:undefined,
  WeeklyGoals:undefined,
  ResourceLibraryScreen:undefined,
  WeeklyLessonsScreen:undefined,
}

const Tab = createBottomTabNavigator<screenType>();
const Stack = createStackNavigator();

function SleepTrackerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SleepTrackerMain"
        component={SleepTrackerScreen}
        options={{ title: 'Sleep Tracker' }}
      />
    </Stack.Navigator>
  );
}

function HealthTrackerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthTrackerMain"
        component={HealthTrackerScreen}
        options={{ title: 'Health Tracker' }}
      />
    </Stack.Navigator>
  );
}

// function ListStack({ navigation }) {
//   const handleLogout = () => {
//     FIREBASE_AUTH.signOut()
//       .then(() => {
//         navigation.navigate('Login'); // Navigate back to the login screen after logging out
//       })
//       .catch((error) => {
//         console.error('Logout error:', error);
//       });
//   };

//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="ListMain"
//         component={List}
//         options={{
//           title: 'Sleep Coaches',
//           headerLeft: () => (
//             <TouchableOpacity
//               onPress={handleLogout} // Trigger the logout function
//               style={{ marginLeft: 10 }}
//             >
//               <Ionicons name="ios-log-out" size={24} color="#52796F" />
//             </TouchableOpacity>
//           ),
//           headerTitleAlign: 'center', // Center the header title
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

// function WeeklyLessonsStack({ navigation }) {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="WeeklyLessonsMain"
//         component={WeeklyLessonsScreen}
//         options={{
//           title: 'Improve My Sleep',
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => navigation.navigate('ListMain')} // Navigate to your List screen
//               style={{ marginRight: 10 }}
//             >
//               <Ionicons name="ios-settings" size={24} color="#52796F" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

{/* <Stack.Navigator>
      <Stack.Screen
        name="WeeklyLessonsMain"
        component={WeeklyLessonsScreen}
        options={{
          title: 'Improve My Sleep',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ListMain')} // Navigate to the List screen
              style={{ marginRight: 10 }}
            >
    //           <Ionicons name="ios-call" size={24} color="#52796F" /> {/* Changed to phone icon */}
    //         </TouchableOpacity>
    //       ),
    //     }}
    //   />
    // </Stack.Navigator> */}

function WeeklyLessonsStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeeklyLessonsMain"
        component={WeeklyLessonsScreen}
        options={{
          title: 'Improve My Sleep',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ListMain')} // Now uses the main stack navigator
              style={{ marginRight: 10 }}
            >
              <Ionicons name="ios-call" size={24} color="#52796F" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function WeeklyGoalsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeeklyGoalsMain"
        component={WeeklyGoals}
        options={{ title: 'Weekly Goals' }}
      />
    </Stack.Navigator>
  );
}

function ResourceLibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ResourceLibraryMain"
        component={ResourceLibraryScreen}
        options={{ title: 'Resource Library' }}
      />
    </Stack.Navigator>
  );
}

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            height: 60,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
          tabBarShowLabel:false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'SleepTrackerScreen') {
              iconName = focused
                ? 'ios-ellipse' : 'ios-ellipse';
            } else if (route.name === 'HealthTrackerScreen') {
              iconName = focused ? 'ios-ellipse' : 'ios-ellipse';
            } else if (route.name === 'WeeklyGoals') {
              iconName = focused ? 'ios-ellipse' : 'ios-ellipse';
            } else if (route.name === 'WeeklyLessonsScreen') {
              iconName = focused ? 'ios-ellipse' : 'ios-ellipse';
            } else if (route.name === 'ResourceLibraryScreen') {
              iconName = focused ? 'ios-ellipse' : 'ios-ellipse';
            }

            // Modify this to return custom icons
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#52796F',
          tabBarInactiveTintColor: 'gray',
        })}
      >
      <Tab.Screen
        name="SleepTrackerScreen"
        component={SleepTrackerStack}
        options={{ 
          headerShown: true,
          tabBarLabel: 'Sleep Tracker' }}
      />
      <Tab.Screen
        name="HealthTrackerScreen"
        component={HealthTrackerStack}
        options={{ 
          headerShown: true,
          title: 'Health Tracker' }}
      />
      <Tab.Screen
        name="WeeklyLessonsScreen"
        component={WeeklyLessonsStack}
        options={{ title: 'Weekly Lessons' }}
      />
      <Tab.Screen
        name="WeeklyGoals"
        component={WeeklyGoalsStack}
        options={{ title: 'Weekly Goals' }}
      />
      <Tab.Screen
        name="ResourceLibraryScreen"
        component={ResourceLibraryStack}
        options={{ title: 'Resource Library' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
