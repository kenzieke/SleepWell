import React, { useState } from 'react';
import { Link, router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  // const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Implement sign-up logic here
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/screens/LoginScreen")} style={styles.loginContainer}>
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
    top: 30,
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

export default SignUpScreen;
