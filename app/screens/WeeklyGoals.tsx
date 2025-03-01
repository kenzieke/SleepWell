/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Original image dimensions
const originalWidth = 1126;
const originalHeight = 1882;
const aspectRatio = originalWidth / originalHeight;

// Goal Content Map
const goalContentMap: { [key: string]: string } = {
  sleepDuration: 'Ensure you get at least 7-9 hours of sleep every night.',
  sleepQuality: 'Your sleep quality is measured by the percentage of time spent asleep while in bed. Our program is designed to help improve this quality.',
  bodyComposition: 'BMI is not perfect but helps gauge risk of sleep disorders. Our program includes strategies for weight management to improve sleep.',
  nutrition: 'A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Aim for balanced meals with vegetables.',
  stress: 'Managing stress is crucial for sleep health. Our program offers tools to help manage stress effectively.',
  physicalActivity: 'Regular physical activity improves sleep quality. Avoid vigorous activities right before bed.',
};

// Touchable Areas (percentage-based for better scaling)
const touchableAreas = [
  { id: 'sleepDuration', top: 0, left: 0, width: 1, height: 0.15 },
  { id: 'sleepQuality', top: 0.15, left: 0, width: 1, height: 0.16 },
  { id: 'bodyComposition', top: 0.31, left: 0, width: 1, height: 0.19 },
  { id: 'nutrition', top: 0.5, left: 0, width: 1, height: 0.193 },
  { id: 'stress', top: 0.69, left: 0, width: 1, height: 0.16 },
  { id: 'physicalActivity', top: 0.85, left: 0, width: 1, height: 0.19 },
];

// Main Component
const WeeklyGoals: React.FC = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const availableHeight = screenHeight - insets.top - insets.bottom;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');

  // Ensure full coverage: Fit by height or width
  let adjustedWidth = screenWidth;
  let adjustedHeight = screenWidth / aspectRatio;

  // Ensure the image is fully visible above the tab bar
  if (adjustedHeight > availableHeight - tabBarHeight) {
    adjustedHeight = availableHeight - tabBarHeight
    adjustedWidth = adjustedHeight * aspectRatio;
  }

  // Properly align image
  const imageLeftOffset = (screenWidth - adjustedWidth) / 2;

  // Open modal
  const openModal = (goalId: string) => {
    setSelectedGoal(goalId);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/wheel_without_header.png')}
        style={[
          styles.image,
          {
            width: adjustedWidth,
            height: adjustedHeight,
            left: imageLeftOffset,
          },
        ]}
        resizeMode="cover"
      />

      {/* Dynamically positioned touchable areas */}
      {touchableAreas.map((area) => (
        <TouchableOpacity
          key={area.id}
          style={[
            styles.touchableArea,
            {
              top: adjustedHeight * area.top,
              left: imageLeftOffset + adjustedWidth * area.left,
              width: adjustedWidth * area.width,
              height: adjustedHeight * area.height,
            },
          ]}
          onPress={() => openModal(area.id)}
        />
      ))}

      {/* Modal */}
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
    backgroundColor: '#fff',
  },
  image: {
    position: 'absolute',
  },
  touchableArea: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Invisible touch areas
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
