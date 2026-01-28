import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import ScalableText from '../components/ScalableText';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInviteCode = async (code: string): Promise<boolean> => {
    try {
      const codeRef = doc(FIRESTORE_DB, 'inviteCodes', code.toUpperCase());
      const codeDoc = await getDoc(codeRef);

      if (!codeDoc.exists()) {
        Alert.alert('Invalid Code', 'The invite code you entered does not exist.');
        return false;
      }

      const codeData = codeDoc.data();
      if (codeData.usedBy) {
        Alert.alert('Code Already Used', 'This invite code has already been used.');
        return false;
      }

      if (!codeData.active) {
        Alert.alert('Invalid Code', 'This invite code is no longer active.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating invite code:', error);
      Alert.alert('Error', 'Could not validate invite code. Please try again.');
      return false;
    }
  };

  const markCodeAsUsed = async (code: string, userEmail: string) => {
    try {
      const codeRef = doc(FIRESTORE_DB, 'inviteCodes', code.toUpperCase());
      await updateDoc(codeRef, {
        usedBy: userEmail,
        usedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking code as used:', error);
      // Non-critical error - account was still created
    }
  };

  const onPressSignUp = async () => {
    // Validate fields
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Missing Information', 'Please enter a password.');
      return;
    }
    if (!inviteCode.trim()) {
      Alert.alert('Missing Information', 'Please enter your invite code.');
      return;
    }

    setLoading(true);
    try {
      // Validate invite code first
      const isValidCode = await validateInviteCode(inviteCode);
      if (!isValidCode) {
        setLoading(false);
        return;
      }

      // Create the user account
      const trimmedEmail = email.trim();
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, trimmedEmail, password);
      const user = response.user;

      // Set the document in Firestore
      const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
      await setDoc(userDocRef, {
        name: name.trim(),
        email: trimmedEmail,
        creationDate: new Date().toISOString(),
        inviteCode: inviteCode.toUpperCase()
      });

      // Mark the invite code as used
      await markCodeAsUsed(inviteCode, trimmedEmail);

      Alert.alert('Account created successfully, now you can login!');
      navigation.replace('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Sign up failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onPressLogin = () => {
    navigation.replace('Login'); // Replace to prevent stack buildup
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPressLogin} style={styles.loginContainer}>
          <ScalableText style={styles.loginText}>Login</ScalableText>
        </TouchableOpacity>
        <ScalableText style={styles.title}>Sign Up</ScalableText>
        <TextInput
          style={styles.inputView}
          placeholder="Name"
          placeholderTextColor={colors.borderMedium}
          onChangeText={(text) => setName(text)}
          value={name}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor={colors.borderMedium}
          onChangeText={(text) => setEmail(text)}
          value={email}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor={colors.borderMedium}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
        />
        <TextInput
          style={styles.inputView}
          placeholder="Invite Code"
          autoCapitalize="characters"
          placeholderTextColor={colors.borderMedium}
          onChangeText={(text) => setInviteCode(text.toUpperCase())}
          value={inviteCode}
          maxLength={6}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
        />
        <TouchableOpacity style={styles.signUpBtn} onPress={onPressSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.primary} /> : <ScalableText style={styles.signUpText}>Sign Up</ScalableText>}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
    minHeight: 50,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  inputText: {
    fontWeight: fontWeights.bold,
    minHeight: 50,
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
    minHeight: 50,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: spacing.md,
  },
});

export default SignUpScreen;
