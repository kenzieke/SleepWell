import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert(
        'Success',
        'Password reset email sent! Please check your spam folder.',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.description}>
            Enter your email address to be sent a link to reset your password.
          </Text>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              autoCapitalize="none"
              placeholderTextColor="#BDBDBD"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            onPress={handleSendResetEmail}
            style={styles.sendBtn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>Send</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#000',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  inputView: {
    width: '100%',
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
  sendBtn: {
    width: '100%',
    backgroundColor: '#52796F',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sendBtnText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  cancelBtn: {
    marginTop: 10,
  },
  cancelBtnText: {
    fontWeight: 'bold',
    color: '#52796F',
    fontSize: 16,
  },
});

export default ForgotPasswordModal;
