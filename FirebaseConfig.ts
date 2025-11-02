// FirebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDM5SJuWMkljiihn6sRQ1KO4Mxk-myFCtM',
  authDomain: 'restq-6bf41.firebaseapp.com',
  projectId: 'restq-6bf41',
  storageBucket: 'restq-6bf41.appspot.com',
  messagingSenderId: '601167941853',
  appId: '1:601167941853:web:d270b26ce20f5ace278b34',
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH =
  Platform.OS === 'web'
    ? getAuth(FIREBASE_APP)
    : initializeAuth(FIREBASE_APP, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
