import * as React from 'react';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user); // This updates the `user` state on authentication state change
    });

    return unsubscribe; // Clean up the subscription on unmount
  }, []);

  return (
    <ErrorBoundary>
      <AppNavigator user={user} />
    </ErrorBoundary>
  );
}

export default App;
