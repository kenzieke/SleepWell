// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { FIREBASE_AUTH } from '../../FirebaseConfig';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onPressSignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = response.user;

      // Set the document in Firestore
      const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
      await setDoc(userDocRef, {
        name: name,
        email: email,
        creationDate: new Date().toISOString() // Store the creation date
      });

      Alert.alert('Account created successfully, now you can login!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

// export default function SignUpScreen({ navigation }: any) { // probably shouldn't do this
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;

//   const onPressSignUp = async () => {
//     setLoading(true);
//     try {
//       const response = await createUserWithEmailAndPassword(auth, email, password);
//       console.log(response);
//       alert('Account created successfully, now you can login!');
//     } catch (error: any) {
//       console.log(error);
//       alert('Sign in failed: ' + error.message)
//     } finally {
//       setLoading(false);
//     }
//   };

  const onPressLogin = () => {
    navigation.navigate('Login'); // Use navigate with the name of the screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginContainer}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.inputView}
          placeholder="Name"
          placeholderTextColor="#BDBDBD"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="#BDBDBD"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor="#BDBDBD"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      <TouchableOpacity style={styles.signUpBtn} onPress={onPressSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#000',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    fontWeight: 'bold',
    color: '#919191',
  },
  inputText: {
    fontWeight: 'bold',
    height: 50,
    color: '#919191',
  },
  button: {
    backgroundColor: '#52796F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  signUpText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  loginContainer: {
    position: 'absolute',
    top: 60,
    right: 40,
  },
  loginText: {
    fontWeight: 'bold',
    color: '#52796F',
    fontSize: 16,
  },
  signUpBtn: {
    fontWeight: 'bold',
    color: 'white',
    width: '80%',
    backgroundColor: '#52796F',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
});
