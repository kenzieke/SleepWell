import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import ScalableText from './ScalableText';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

interface UnsavedChangesModalProps {
  visible: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  visible,
  onSave,
  onDiscard,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onDiscard}>
      <View style={styles.overlay}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalContainer}>
            <ScalableText style={styles.title} maxScale={2}>
              You have unsaved changes
            </ScalableText>
            <ScalableText style={styles.subtitle} maxScale={2}>
              Would you like to save your tracker data before leaving?
            </ScalableText>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.discardButton} onPress={onDiscard}>
                <ScalableText style={styles.buttonText} maxScale={2}>Discard</ScalableText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <ScalableText style={styles.buttonText} maxScale={2}>Save</ScalableText>
              </TouchableOpacity>
            </View>
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
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.lg,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#A0A0A0',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
});

export default UnsavedChangesModal;
