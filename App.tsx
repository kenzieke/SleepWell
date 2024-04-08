import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from "./components/BottomTabNavigator";
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  // return (
  //   <SafeAreaProvider>
  //     <NavigationContainer>
  //       <BottomTabNavigator/>
  //     </NavigationContainer>
  //   </SafeAreaProvider>
  // );
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* <BottomTabNavigator />
        ) : (
          <LoginScreen /> */}
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}