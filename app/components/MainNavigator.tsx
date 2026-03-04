import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import LessonTrackingScreen from '../screens/LessonTrackingScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen';
import ListMain from '../screens/SleepCoachScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../types/navigationTypes';

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
      <Stack.Screen
        name="LessonDetailScreen"
        component={LessonDetailScreen}
        options={{
          title: 'Module Summary',
        }}
      />
      <Stack.Screen
        name="AudioPlayerScreen"
        component={AudioPlayerScreen}
        options={{
          title: 'Listen',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
