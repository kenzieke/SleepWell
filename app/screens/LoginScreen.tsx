import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
  
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  // const onPressLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await signInWithEmailAndPassword(auth, email, password);
  //     console.log(response);
  //   } catch (error: any) {
  //     console.log(error);
  //     alert('Login failed: ' + error.message)
  //   } finally {
  //     setLoading(false);
  //   }
  //   // navigation.navigate('WeeklyGoals');
  // };

  const onPressLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      // Assuming navigation is correctly passed to your LoginScreen component
      navigation.replace('Sleep Assessment');
    } catch (error: any) {
      console.error(error);
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onPressForgotPassword = async () => {
    // Do something about forgot password operation
  };

  const onPressSignUp = async () => {
    navigation.navigate('SignUp'); // Use navigate with the name of the screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="#BDBDBD"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor="#BDBDBD"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity onPress={onPressForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressSignUp} style={styles.signUpContainer}>
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
    top: 60,
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
