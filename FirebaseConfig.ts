// FirebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDM5SJuWMkljiihn6sRQ1KO4Mxk-myFCtM',
  authDomain: 'restq-6bf41.firebaseapp.com',
  projectId: 'restq-6bf41',
  storageBucket: 'restq-6bf41.appspot.com',
  messagingSenderId: '601167941853',
  appId: '1:601167941853:web:d270b26ce20f5ace278b34',
};

// Initialize Firebase App
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Try to use RN persistence; if not resolvable, fall back gracefully
let options: Parameters<typeof initializeAuth>[1] | undefined = undefined;

try {
  // Use runtime require so Metro can resolve at runtime if available.
  // We intentionally suppress TS here—this path can be missing in some setups.
  // @ts-ignore - dynamic import of RN subpath
  const { getReactNativePersistence } = require('firebase/auth/react-native');

  if (typeof getReactNativePersistence === 'function') {
    options = { persistence: getReactNativePersistence(AsyncStorage) };
  }
} catch {
  // No-op: fallback to default (in-memory) persistence
}

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, options);

// Firestore
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
