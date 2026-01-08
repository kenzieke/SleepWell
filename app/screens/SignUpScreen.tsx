import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../types/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
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
      Alert.alert('Sign up failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

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
          placeholderTextColor={colors.borderMedium}
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor={colors.borderMedium}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor={colors.borderMedium}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      <TouchableOpacity style={styles.signUpBtn} onPress={onPressSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.signUpText}>Sign Up</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: fontWeights.bold,
    fontSize: 50,
    color: colors.textPrimary,
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#E8E8E8',
    borderRadius: borderRadius.xxl,
    height: 50,
    marginBottom: spacing.xl,
    justifyContent: 'center',
    padding: spacing.xl,
    fontWeight: fontWeights.bold,
    color: '#919191',
  },
  inputText: {
    fontWeight: fontWeights.bold,
    height: 50,
    color: '#919191',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xl,
  },
  signUpText: {
    fontWeight: fontWeights.bold,
    color: colors.textWhite,
    fontSize: fontSizes.md,
  },
  loginContainer: {
    position: 'absolute',
    top: 60,
    right: 40,
  },
  loginText: {
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontSize: fontSizes.md,
  },
  signUpBtn: {
    width: '80%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xxl,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: spacing.md,
  },
});

export default SignUpScreen;
