import * as React from 'react';
import { Button } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../app/screens/LoginScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import SleepAssessmentScreen from '../app/screens/SleepAssessment';
import ResultsScreen from '../app/screens/ResultsScreen';
import { doc, getDoc } from 'firebase/firestore';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

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
          // Navigate based on the user document
          const routeName = userData.completedAssessment ? 'Main' : 'Sleep Assessment';
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: routeName }],
          });
        } else {
          console.log("No user document!");
          navigationRef.current?.navigate('Sleep Assessment');
        }
      } else {
        navigationRef.current?.navigate('Login');
      }
    };

    checkUserDocument();
  }, [user]); // [user, navigationRef]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} ref={navigationRef}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      {user && <Stack.Screen name="Main" component={BottomTabNavigator} />}
      <Stack.Screen
        name="ResultsScreen"
        component={ResultsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Sleep Assessment Results',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Main')}
              title="Next"
              color='#52796F'
            />
          ),
          headerLeft: () => (
            <Button
              onPress={() => navigation.navigate('Sleep Assessment')}
              title="Back"
              color='#52796F'
            />
          ),
        })}
      />
      {user && <Stack.Screen name="Sleep Assessment" component={SleepAssessmentScreen} options={{ headerShown: true }} />}
    </Stack.Navigator>
  );
}

export default AppNavigator;