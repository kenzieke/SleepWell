import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import ScalableText from '../components/ScalableText';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../types/navigationTypes';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const auth = FIREBASE_AUTH;

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigate directly
        checkUserAssessment(user.uid);
      }
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  const checkUserAssessment = async (uid: string) => {
    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', uid, 'results', `scores_${uid}`);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const routeName = userData.completedAssessment ? 'Main' : 'SleepAssessmentScreen';
        navigation.replace(routeName);
      } else {
        navigation.replace('SleepAssessmentScreen');
      }
    } catch (error) {
      console.error('Error checking assessment:', error);
    }
  };

  const onPressLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        checkUserAssessment(user.uid);
      }
    } catch (error) {
      console.error(error);
      alert('Login failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onPressForgotPassword = async () => {
    setForgotPasswordModalVisible(true);
  };

  const onPressSignUp = async () => {
    navigation.replace('SignUp'); // Replace to prevent stack buildup
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScalableText style={styles.title}>Login</ScalableText>
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
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor={colors.borderMedium}
          onChangeText={(text) => setPassword(text)}
          value={password}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
        />

        <TouchableOpacity onPress={onPressForgotPassword}>
          <ScalableText style={styles.forgotPasswordText}>Forgot your password?</ScalableText>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.primary} /> : <ScalableText style={styles.loginText}>Login</ScalableText>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressSignUp} style={styles.signUpContainer}>
          <ScalableText style={styles.signUpText}>Sign Up</ScalableText>
        </TouchableOpacity>

        <ForgotPasswordModal
          visible={forgotPasswordModalVisible}
          onClose={() => setForgotPasswordModalVisible(false)}
        />

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
  forgotPasswordText: {
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontSize: fontSizes.md,
  },
  signUpContainer: {
    position: 'absolute',
    top: 60,
    right: 40,
  },
  signUpText: {
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontSize: fontSizes.md,
  },
  loginText: {
    fontWeight: fontWeights.bold,
    color: colors.textWhite,
    fontSize: fontSizes.md,
  },
  loginBtn: {
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

export default LoginScreen;
