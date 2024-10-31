import React, { useState } from 'react';
import { Image, StyleSheet, View, Dimensions, TouchableOpacity, Modal, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Constants
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const originalWidth = 1126;
const originalHeight = 1882;

// Aspect Ratio Calculations
const aspectRatio = originalHeight / originalWidth;
const calculatedHeight = screenWidth * aspectRatio;

// Goal Content Map
const goalContentMap: { [key: string]: string } = {
  sleepDuration: 'Ensure you get at least 7-9 hours of sleep every night.',
  sleepQuality: 'Your sleep quality is measured by the percentage of time spent asleep while in bed. Our program is designed to help improve this quality.',
  bodyComposition: 'BMI is not perfect but helps gauge risk of sleep disorders. Our program includes strategies for weight management to improve sleep.',
  nutrition: 'A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Aim for balanced meals with vegetables.',
  stress: 'Managing stress is crucial for sleep health. Our program offers tools to help manage stress effectively.',
  physicalActivity: 'Regular physical activity improves sleep quality. Avoid vigorous activities right before bed.',
};

// Touchable Areas
const touchableAreas = [
  { id: 'sleepDuration', top: -5, left: 21, width: 44, height: 8 },
  { id: 'sleepQuality', top: 9, left: 43, width: 36, height: 10 },
  { id: 'bodyComposition', top: 28, left: 53, width: 45, height: 9 },
  { id: 'nutrition', top: 44, left: 53, width: 34, height: 15 },
  { id: 'stress', top: 65, left: 45, width: 43, height: 10 },
  { id: 'physicalActivity', top: 80, left: 23, width: 75, height: 11 },
];

// Main Component
const WeeklyGoals: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');

  // Calculations
  const topBarHeight = -60; // Adjust according to your design
  const bottomBarHeight = 148; // Adjust according to your design
  const imageTopOffset = insets.top + topBarHeight;
  const adjustedHeight = screenHeight - imageTopOffset - insets.bottom - bottomBarHeight;
  const adjustedWidth = adjustedHeight / aspectRatio;

  // Open modal with specific goal
  const openModal = (goalId: string) => {
    setSelectedGoal(goalId);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Image
        source={require('../../assets/wheel_without_header.png')}
        style={[
          styles.image,
          {
            top: imageTopOffset,
            height: adjustedHeight,
            width: adjustedWidth,
          },
        ]}
        resizeMode="contain"
      />
      
      {touchableAreas.map((area) => (
        <TouchableOpacity
          key={area.id}
          style={[
            styles.touchableArea,
            {
              top: imageTopOffset + (calculatedHeight * area.top) / 100,
              left: (screenWidth * area.left) / 100,
              width: (screenWidth * area.width) / 100,
              height: (calculatedHeight * area.height) / 100,
            },
          ]}
          onPress={() => openModal(area.id)}
        />
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {goalContentMap[selectedGoal] || 'Content not available'}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  touchableArea: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0)', // Transparent to make touchable areas invisible
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adds overlay for modal
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#52796F',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WeeklyGoals;
