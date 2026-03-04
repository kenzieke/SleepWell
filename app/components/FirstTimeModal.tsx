import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';
import ScalableText from './ScalableText';

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
      <View style={styles.overlay}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalView}>
            <ScalableText style={styles.modalText} maxScale={2}>{message}</ScalableText>
            <TouchableOpacity onPress={handleClose} style={styles.closeButtonContainer}>
              <ScalableText style={styles.closeButtonText} maxScale={2}>Got it!</ScalableText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalView: {
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
  closeButtonContainer: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  closeButtonText: {
    color: colors.textWhite,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});

export default FirstTimeModal;
