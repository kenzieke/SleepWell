import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import List from '../app/screens/List';
import LessonTrackingScreen from '../app/screens/LessonTrackingScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const MainStack = createStackNavigator();

const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      <MainStack.Screen
        name="ListMain"
        component={List}
        options={{
          title: 'Sleep Coaches',
          headerShown: true,
          headerLeft: ({ navigation }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('MainTabs')}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#52796F" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      />
      <MainStack.Screen
        name="LessonTrackingScreen"
        component={LessonTrackingScreen}
        options={({ navigation }) => ({
          title: 'Lessons',
          headerShown: true,
          headerLeft: ({ navigation }) => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#52796F" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Function to mark lesson complete or handle what happens when "Done" is pressed
              }}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="checkmark" size={24} color="#52796F" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        })}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
