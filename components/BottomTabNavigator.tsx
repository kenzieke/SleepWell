// BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/build/Ionicons';

import SleepTrackerScreen from '../app/screens/SleepTracker';
import HealthTrackerScreen from '../app/screens/HealthTracker';
import WeeklyGoalsScreen from '../app/screens/WeeklyGoalsScreen';
import ResourceLibraryScreen from '../app/screens/ResourceLibrary';
import WeeklyLessonsScreen from '../app/screens/WeeklyLessonsScreen';

type screenType={
  SleepTrackerScreen:undefined,
  HealthTrackerScreen:undefined,
  WeeklyGoalsScreen:undefined,
  ResourceLibraryScreen:undefined,
  WeeklyLessonsScreen:undefined,
}

const Tab = createBottomTabNavigator<screenType>();
const Stack = createStackNavigator();

function SleepTrackerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SleepTrackerStackScreen"
        component={SleepTrackerScreen}
        options={{ title: 'Sleep Tracker' }}
      />
      {/* other screens specific to this stack */}
    </Stack.Navigator>
  );
}

function HealthTrackerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthTrackerStackScreen"
        component={HealthTrackerScreen}
        options={{ title: 'Health Tracker' }}
      />
      {/* other screens specific to this stack */}
    </Stack.Navigator>
  );
}

function WeeklyGoalsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeeklyGoalsStackScreen"
        component={WeeklyGoalsScreen}
        options={{ title: 'Weekly Goals' }}
      />
      {/* other screens specific to this stack */}
    </Stack.Navigator>
  );
}

function WeeklyLessonsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeeklyLessonsStackScreen"
        component={WeeklyLessonsScreen}
        options={{ title: 'Improve My Screen' }}
      />
      {/* other screens specific to this stack */}
    </Stack.Navigator>
  );
}

function ResourceLibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ResourceLibraryStackScreen"
        component={ResourceLibraryScreen}
        options={{ title: 'Resource Library' }}
      />
      {/* other screens specific to this stack */}
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
            } else if (route.name === 'WeeklyGoalsScreen') {
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
        name="SleepTrackerScreen" // Unique name for the tab screen
        component={SleepTrackerStack}
        options={{ tabBarLabel: 'Sleep Tracker' }}
      />
      <Tab.Screen
        name="HealthTrackerScreen"
        component={HealthTrackerStack}
        options={{ title: 'Health Tracker' }}
      />
      <Tab.Screen
        name="WeeklyLessonsScreen"
        component={WeeklyLessonsStack}
        options={{ title: 'Weekly Lessons' }}
      />
      <Tab.Screen
        name="WeeklyGoalsScreen"
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
// export default { SleepTrackerStack, HealthTrackerStack, BottomTabNavigator };