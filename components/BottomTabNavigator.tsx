import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons'; // Ensure correct import for Ionicons
import { TouchableOpacity } from 'react-native';

import SleepTrackerScreen from '../app/screens/SleepTracker';
import WeeklyGoals from '../app/screens/WeeklyGoals';
import ResourceLibraryScreen from '../app/screens/ResourceLibrary';
import WeeklyLessonsScreen from '../app/screens/WeeklyLessonsScreen';

type ScreenType = {
  SleepTrackerScreen: undefined;
  WeeklyGoals: undefined;
  ResourceLibraryScreen: undefined;
  WeeklyLessonsScreen: undefined;
};

const Tab = createBottomTabNavigator<ScreenType>();
const Stack = createStackNavigator();

function SleepTrackerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SleepTrackerMain" component={SleepTrackerScreen} options={{ title: 'Sleep Tracker' }} />
    </Stack.Navigator>
  );
}

function WeeklyLessonsStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeeklyLessonsMain"
        component={WeeklyLessonsScreen}
        options={{
          title: 'Improve My Sleep',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('ListMain')} style={{ marginRight: 10 }}>
              <Ionicons name="call" size={24} color="#52796F" />
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
      <Stack.Screen name="WeeklyGoalsMain" component={WeeklyGoals} options={{ title: 'Weekly Goals' }} />
    </Stack.Navigator>
  );
}

function ResourceLibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ResourceLibraryMain" component={ResourceLibraryScreen} options={{ title: 'Resource Library' }} />
    </Stack.Navigator>
  );
}

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'SleepTrackerScreen':
              iconName = focused ? 'create' : 'create-outline'; // Adjust icon names as needed
              break;
            case 'WeeklyGoals':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'WeeklyLessonsScreen':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'ResourceLibraryScreen':
              iconName = focused ? 'library' : 'library-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: true, // Ensure labels are shown under icons
        tabBarActiveTintColor: '#52796F',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="WeeklyLessonsScreen"
        component={WeeklyLessonsStack}
        options={{
          headerShown: false,  // Hide the header
          tabBarLabel: 'Modules'  // Set label to show under the icon
        }}
      />
      <Tab.Screen
        name="SleepTrackerScreen"
        component={SleepTrackerStack}
        options={{
          headerShown: false,  // Hide the header
          tabBarLabel: 'Tracker'  // Set label to show under the icon
        }}
      />
      <Tab.Screen
        name="WeeklyGoals"
        component={WeeklyGoalsStack}
        options={{
          headerShown: false,  // Hide the header
          tabBarLabel: 'Goals'  // Set label to show under the icon
        }}
      />
      <Tab.Screen
        name="ResourceLibraryScreen"
        component={ResourceLibraryStack}
        options={{
          headerShown: false,  // Hide the header
          tabBarLabel: 'Library'  // Set label to show under the icon
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
