import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

interface InfoModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
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

export default InfoModal;
