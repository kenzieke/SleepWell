import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, Text } from 'react-native';

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

import SleepTrackerScreen from '../screens/SleepTracker';
import WeeklyGoals from '../screens/WeeklyGoals';
import ResourceLibraryScreen from '../screens/ResourceLibrary';
import WeeklyLessonsScreen from '../screens/WeeklyLessonsScreen';
import InfoModal from './InfoModal';

// Info messages for each screen
const INFO_MESSAGES = {
  home: "Here you can see your weekly progress, access your weekly modules, and access your sleep coach's contact information.",
  tracker: "Track your sleep and health information here daily.",
  goals: "Tap any of the descriptions to get more information about what each goal entails.",
  library: "This is a list of links and resources you can access to better help you with your sleep and wellness goals.",
};

type ScreenType = {
  SleepTrackerScreen: undefined;
  WeeklyGoals: undefined;
  ResourceLibraryScreen: undefined;
  WeeklyLessonsScreen: undefined;
  ListMain: undefined;
};

const Tab = createBottomTabNavigator<ScreenType>();
const Stack = createStackNavigator();

// Helper component for info button
const InfoButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
    <Ionicons name="information-circle-outline" size={24} color="#52796F" />
  </TouchableOpacity>
);

// Helper component for settings button
const SettingsButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
    <Ionicons name="settings-outline" size={24} color="#52796F" />
  </TouchableOpacity>
);

function SleepTrackerStack() {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
      <InfoModal
        visible={infoVisible}
        message={INFO_MESSAGES.tracker}
        onClose={() => setInfoVisible(false)}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="SleepTrackerMain"
          component={SleepTrackerScreen}
          options={{
            headerTitle: () => <HeaderTitle>Sleep Tracker</HeaderTitle>,
            headerRight: () => (
              <InfoButton onPress={() => setInfoVisible(true)} />
            ),
          }}
        />
      </Stack.Navigator>
    </>
  );
}

function WeeklyLessonsStack() {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
      <InfoModal
        visible={infoVisible}
        message={INFO_MESSAGES.home}
        onClose={() => setInfoVisible(false)}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="WeeklyLessonsMain"
          component={WeeklyLessonsScreen}
          options={({ navigation }) => ({
            headerTitle: () => <HeaderTitle>Improve My Sleep</HeaderTitle>,
            headerLeft: () => (
              <SettingsButton
                onPress={() => {
                  // Navigate up through: Screen -> Stack -> Tab -> Root
                  const tabNav = navigation.getParent();
                  const rootNav = tabNav?.getParent?.();
                  if (rootNav) {
                    rootNav.navigate('SettingsScreen');
                  } else {
                    console.log('Could not find root navigator');
                  }
                }}
              />
            ),
            headerRight: () => (
              <InfoButton onPress={() => setInfoVisible(true)} />
            ),
          })}
        />
      </Stack.Navigator>
    </>
  );
}

function WeeklyGoalsStack() {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
      <InfoModal
        visible={infoVisible}
        message={INFO_MESSAGES.goals}
        onClose={() => setInfoVisible(false)}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="WeeklyGoalsMain"
          component={WeeklyGoals}
          options={{
            headerTitle: () => <HeaderTitle>Weekly Goals</HeaderTitle>,
            headerRight: () => (
              <InfoButton onPress={() => setInfoVisible(true)} />
            ),
          }}
        />
      </Stack.Navigator>
    </>
  );
}

function ResourceLibraryStack() {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
      <InfoModal
        visible={infoVisible}
        message={INFO_MESSAGES.library}
        onClose={() => setInfoVisible(false)}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="ResourceLibraryMain"
          component={ResourceLibraryScreen}
          options={{
            headerTitle: () => <HeaderTitle>Resource Library</HeaderTitle>,
            headerRight: () => (
              <InfoButton onPress={() => setInfoVisible(true)} />
            ),
          }}
        />
      </Stack.Navigator>
    </>
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
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ResourceLibraryScreen':
              iconName = focused ? 'library' : 'library-outline';
              break;
          }
          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
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
          headerShown: false,
          tabBarLabel: 'Home'
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
