import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Amplify } from "aws-amplify";
import { Auth } from 'aws-amplify';
import config from '../../src/aws-exports.js';
Amplify.configure(config);

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    // Implement sign-up logic with AWS Amplify Auth
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email, // optional
          // other custom attributes can be added here
          // 'custom:name': name, // if you have configured it as a custom attribute in Cognito
        }
      });
      console.log('Sign up successful!', user);
      // Here you can redirect the user to a confirmation screen, if necessary
      navigation.navigate('ConfirmSignUp', { email });
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Sign Up Error', error.message || 'An error occurred during sign up');
    }
  };

  // The SignUp button onPress handler
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
          placeholderTextColor="#BDBDBD"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
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
