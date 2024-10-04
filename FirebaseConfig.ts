import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // No need for both AsyncStorage imports
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDM5SJuWMkljiihn6sRQ1KO4Mxk-myFCtM",
    authDomain: "restq-6bf41.firebaseapp.com",
    projectId: "restq-6bf41",
    storageBucket: "restq-6bf41.appspot.com",
    messagingSenderId: "601167941853",
    appId: "1:601167941853:web:d270b26ce20f5ace278b34"
};

// Initialize Firebase App
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence (remove getAuth)
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
