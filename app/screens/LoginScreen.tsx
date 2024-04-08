import { StatusBar } from 'expo-status-bar';
import { Link, router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';

export default function LoginScreen() {
  const onPressLogin = () => {
    // Do something about login operation, this doesn't work and the tabs navigation bar doesn't show up if you put it directly in function
    <Pressable onPress={() => router.push("/screens/WeeklyLessonsScreen")}></Pressable>
  };

  const onPressForgotPassword = () => {
    // Do something about forgot password operation
  };

  const onPressSignUp = () => {
    // Do something about signup operation
  };

  const [state, setState] = useState({
    email: '',
    password: '',
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          // onChangeText={text => setState({ email: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          // onChangeText={text => setState({ password: text })}
        />
      </View>
      <TouchableOpacity onPress={onPressForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/screens/SignUpScreen")} style={styles.signUpContainer}>
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
  },
  inputText: {
    fontWeight: 'bold',
    height: 50,
    color: '#919191',
  },
  forgotPasswordText: {
    fontWeight: 'bold',
    color: '#52796F',
    fontSize: 16,
  },
  signUpContainer: {
    position: 'absolute',
    top: 30,
    right: 40,
  },
  signUpText: {
    fontWeight: 'bold',
    color: '#52796F',
    fontSize: 16,
  },
  loginText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  loginBtn: {
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
