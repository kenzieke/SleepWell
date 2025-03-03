import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

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
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Complete your weekly module now:</Text>
          <Text style={styles.moduleName}>{moduleName}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onDoNow}>
              <Text style={styles.buttonText}>Do now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.laterButton]} onPress={onLater}>
              <Text style={styles.buttonText}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
