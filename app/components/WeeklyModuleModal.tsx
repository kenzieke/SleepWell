import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import ScalableText from './ScalableText';

interface WeeklyModuleModalProps {
  visible: boolean;
  moduleName: string;
  onDoNow: () => void;
  onLater: () => void;
}

const WeeklyModuleModal: React.FC<WeeklyModuleModalProps> = ({ visible, moduleName, onDoNow, onLater }) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onLater}>
      <View style={styles.overlay}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalContainer}>
            <ScalableText style={styles.title} maxScale={2}>Complete your weekly module now:</ScalableText>
            <ScalableText style={styles.moduleName} maxScale={2}>{moduleName}</ScalableText>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onDoNow}>
                <ScalableText style={styles.buttonText} maxScale={2}>Do now</ScalableText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.laterButton]} onPress={onLater}>
                <ScalableText style={styles.buttonText} maxScale={2}>Later</ScalableText>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#52796F',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#52796F',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  laterButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WeeklyModuleModal;
