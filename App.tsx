// import * as React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './app/screens/LoginScreen';
// import List from './app/screens/List';
// import SleepAssessmentScreen from './app/screens/SleepAssessment';
// import { NavigationContainer } from '@react-navigation/native';
// import { useEffect, useState } from 'react';
// import { User, onAuthStateChanged } from 'firebase/auth';
// import { FIREBASE_AUTH } from './FirebaseConfig';
// import AppNavigator from './navigation/AppNavigator';

// const Stack = createStackNavigator();
// const InsideStack = createStackNavigator();

// function InsideLayout() {
//   return (
//     <InsideStack.Navigator>
//       {/* <Stack.Screen name="My todos" component={List} /> */}
//       <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} />
//     </InsideStack.Navigator>
//   );
// }

// function App() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     onAuthStateChanged(FIREBASE_AUTH, (user) => {
//       console.log('user', user);
//       setUser(user);
//     });
//   }, [])

//   return (
//     // <NavigationContainer>
//     //   <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//     //     {user ? (
//     //       // <Stack.Screen name="List" component={InsideLayout} options={{ headerShown: false }} />
//     //       <Stack.Screen name="SleepAssessmentScreen" component={InsideLayout} options={{ headerShown: false }} />
//     //     ) : (
//     //       <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//     //     )}
//     //   </Stack.Navigator>
//     // </NavigationContainer>
//     <NavigationContainer>
//       <AppNavigator user={user}/>
//     </NavigationContainer>
//   );
// }

// export default App; 

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import AppNavigator from './navigation/AppNavigator';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
    
    // Clean up the subscription on unmount
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator user={user} />
    </NavigationContainer>
  );
}

export default App;
