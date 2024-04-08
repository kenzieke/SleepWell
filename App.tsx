import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from "./components/BottomTabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from 'react';
import { Auth } from 'aws-amplify'; // Import Auth from AWS Amplify
import AppNavigator from './navigation/AppNavigator'; // Import the AuthStack you created

import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleLogin() {
    try {
      await Auth.signIn(email, password);
      setIsAuthenticated(true); // Set authenticated to true upon successful login
      // User logged in successfully, navigate to the next screen
      // You can use navigation library like React Navigation to navigate to the next screen
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <BottomTabNavigator />
        ) : (
          <AppNavigator />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
