import * as React from 'react';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import AppNavigator from './navigation/AppNavigator';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user); // This updates the `user` state on authentication state change
    });
    
    return unsubscribe; // Clean up the subscription on unmount
  }, []);

  return (
    <AppNavigator user={user} />
  );
}

export default App;
