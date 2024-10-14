import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import LessonTrackingScreen from '../app/screens/LessonTrackingScreen';
import ListMain from '../app/screens/SleepCoachScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types/navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListMain"
        component={ListMain}
        options={{
          title: 'Sleep Coaches',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 10 }}>
              <Ionicons name="call" size={24} color="#52796F" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="LessonTrackingScreen"
        component={LessonTrackingScreen}
        options={{
          title: 'Modules',
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }}>
              <Ionicons name="checkmark" size={24} color="#52796F" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
