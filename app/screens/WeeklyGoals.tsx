/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

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
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
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
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
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
    backgroundColor: '#B3D584',
  },
  image: {
    position: 'absolute',
  },
  touchableArea: {
    position: 'absolute',
    backgroundColor: colors.transparent,
  },
  centeredView: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  },
});

export default WeeklyGoals;
