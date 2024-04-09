import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/screens/LoginScreen';
import List from './app/screens/List';
import SleepAssessmentScreen from './app/screens/SleepAssessment';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      {/* <Stack.Screen name="My todos" component={List} /> */}
      <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} />
    </InsideStack.Navigator>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp" screenOptions={{ headerShown: false }}>
        {user ? (
          // <Stack.Screen name="List" component={InsideLayout} options={{ headerShown: false }} />
          <Stack.Screen name="SleepAssessmentScreen" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 