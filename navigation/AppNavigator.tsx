// import * as React from 'react';
// import { Button } from 'react-native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import LoginScreen from '../app/screens/LoginScreen';
// import SignUpScreen from '../app/screens/SignUpScreen';
// import ListScreen from '../app/screens/List';
// import SleepAssessmentScreen from '../app/screens/SleepAssessment';
// import ResultsScreen from '../app/screens/ResultsScreen';
// import BottomTabNavigator from '../components/BottomTabNavigator';
// import { doc, getDoc } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
// import { useEffect } from 'react';

// const Stack = createStackNavigator();

// function AppNavigator({ user }) {
//   const navigationRef = React.useRef();

//   useEffect(() => {
//     const checkUserDocument = async () => {
//       if (user) {
//         const userDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'results', `scores_${user.uid}`);
//         const docSnap = await getDoc(userDocRef);
  
//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           // Navigate based on the user document
//           const routeName = userData.completedAssessment ? 'Main' : 'Sleep Assessment';
//           navigationRef.current?.reset({
//             index: 0,
//             routes: [{ name: routeName }],
//           });
//         } else {
//           console.log('No user document!');
//           navigationRef.current?.navigate('Sleep Assessment');
//         }
//       } else {
//         navigationRef.current?.navigate('Login');
//       }
//     };

//     checkUserDocument();
//   }, [user]);

//   return (
//     <NavigationContainer ref={navigationRef}>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
//         {user && (
//           <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
//         )}
//         {user && (
//           <Stack.Screen
//             name="Sleep Assessment"
//             component={SleepAssessmentScreen}
//             options={{ headerShown: true }}
//           />
//         )}
//         <Stack.Screen
//           name="ResultsScreen"
//           component={ResultsScreen}
//           options={({ navigation }) => ({
//             headerShown: true,
//             headerBackTitleVisible: false,
//             title: 'Sleep Assessment Results',
//             headerRight: () => (
//               <Button onPress={() => navigation.navigate('Main')} title="Next" color="#52796F" />
//             ),
//             headerLeft: () => (
//               <Button onPress={() => navigation.navigate('Sleep Assessment')} title="Back" color="#52796F" />
//             ),
//           })}
//         />
//         {user && (
//           <Stack.Screen
//             name="ListMain"
//             component={ListScreen}
//             options={({ navigation }) => ({
//               title: 'Sleep Coaches',
//               headerShown: true,
//               headerTitleAlign: 'center',
//               // Back button to navigate back to Weekly Lessons
//               headerLeft: () => (
//                 <Button
//                   onPress={() => navigation.goBack()}
//                   title="Back"
//                   color="#52796F"
//                 />
//               ),
//               // Logout button to sign out and navigate to Login
//               headerRight: () => (
//                 <Button
//                   onPress={() => {
//                     FIREBASE_AUTH.signOut()
//                       .then(() => navigation.navigate('Login'))
//                       .catch((error) => console.error('Logout error:', error));
//                   }}
//                   title="Logout"
//                   color="#52796F"
//                 />
//               ),
//             })}
//           />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default AppNavigator;

import * as React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import ListScreen from '../app/screens/List';
import LessonTrackingScreen from '../app/screens/LessonTrackingScreen'; // Ensure the path is correct
import SleepAssessmentScreen from '../app/screens/SleepAssessment';
import ResultsScreen from '../app/screens/ResultsScreen';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { useEffect } from 'react';

const Stack = createStackNavigator();

function AppNavigator({ user }) {
  const navigationRef = React.useRef();

  useEffect(() => {
    const checkUserDocument = async () => {
      if (user) {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'results', `scores_${user.uid}`);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Navigate based on user document
          const routeName = userData.completedAssessment ? 'Main' : 'Sleep Assessment';
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: routeName }],
          });
        } else {
          console.log('No user document!');
          navigationRef.current?.navigate('Sleep Assessment');
        }
      } else {
        navigationRef.current?.navigate('Login');
      }
    };

    checkUserDocument();
  }, [user]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        {user && <Stack.Screen name="Main" component={BottomTabNavigator} />}
        {user && (
          <Stack.Screen
            name="Sleep Assessment"
            component={SleepAssessmentScreen}
            options={{ headerShown: true }}
          />
        )}
        <Stack.Screen
          name="ResultsScreen"
          component={ResultsScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerBackTitleVisible: false,
            title: 'Sleep Assessment Results',
            headerRight: () => (
              <Button onPress={() => navigation.navigate('Main')} title="Next" color="#52796F" />
            ),
            headerLeft: () => (
              <Button onPress={() => navigation.navigate('Sleep Assessment')} title="Back" color="#52796F" />
            ),
          })}
        />
        {user && (
          <Stack.Screen
            name="ListMain"
            component={ListScreen}
            options={({ navigation }) => ({
              title: 'Sleep Coaches',
              headerShown: true,
              headerTitleAlign: 'center',
              headerLeft: () => (
                <Button
                  onPress={() => navigation.navigate('Main')}
                  title="Back"
                  color="#52796F"
                />
              ),
              headerRight: () => (
                <Button
                  onPress={() => {
                    FIREBASE_AUTH.signOut()
                      .then(() => navigation.navigate('Login'))
                      .catch((error) => console.error('Logout error:', error));
                  }}
                  title="Logout"
                  color="#52796F"
                />
              ),
            })}
          />
        )}
        {user && (
          <Stack.Screen
            name="LessonTrackingScreen"
            component={LessonTrackingScreen}
            options={({ navigation }) => ({
              title: 'Lessons',
              headerShown: true,
              headerTitleAlign: 'center',
              headerLeft: () => (
                <Button
                  onPress={() => navigation.navigate('Main')}
                  title="Back"
                  color="#52796F"
                />
              ),
            })}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
