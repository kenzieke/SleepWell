import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import List from '../app/screens/List';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const MainStack = createStackNavigator();

const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={BottomTabNavigator} />
      <MainStack.Screen
        name="ListMain"
        component={List}
        options={{
          title: 'Sleep Coaches',
          headerShown: true,
          headerLeft: ({ navigation }) => (
            <TouchableOpacity
              onPress={() => {
                FIREBASE_AUTH.signOut().then(() => navigation.navigate('Login')).catch((error) => console.error('Logout error:', error));
              }}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="ios-log-out" size={24} color="#52796F" />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
