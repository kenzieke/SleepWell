import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/screens/LoginScreen';
import List from './app/screens/List';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <Stack.Screen name="My todos" component={List} />
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
    // <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    //   <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    // </Stack.Navigator>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp" screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="List" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 

// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AppNavigator from './navigation/AppNavigator';
// import { NavigationContainer } from "@react-navigation/native";

// export default function App() {
//   // return (
//   //   <SafeAreaProvider>
//   //     <NavigationContainer>
//   //       <BottomTabNavigator/>
//   //     </NavigationContainer>
//   //   </SafeAreaProvider>
//   // );
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         {/* <BottomTabNavigator />
//         ) : (
//           <LoginScreen /> */}
//         <AppNavigator />
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }