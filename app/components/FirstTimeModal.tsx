import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

interface FirstTimeModalProps {
  storageKey: string;
  message: string;
}

const FirstTimeModal: React.FC<FirstTimeModalProps> = ({ storageKey, message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasSeenModal = await AsyncStorage.getItem(storageKey);
      if (!hasSeenModal) {
        setVisible(true);
      }
    } catch (error) {
      console.error('Error checking first time modal:', error);
    }
  };

  const handleClose = async () => {
    try {
      await AsyncStorage.setItem(storageKey, 'true');
      setVisible(false);
    } catch (error) {
      console.error('Error saving first time modal state:', error);
      setVisible(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeButton}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: spacing.xl,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: borderRadius.xxl,
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    color: colors.textWhite,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
    overflow: 'hidden',
  },
});

export default FirstTimeModal;
