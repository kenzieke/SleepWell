import React from 'react';
import { Image, StyleSheet, View, Dimensions, TouchableOpacity, Modal, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // If not already installed, install react-native-safe-area-context

// Get the screen's width
const screenWidth = Dimensions.get('window').width;

// Original dimensions of the image
const originalWidth = 1126;
const originalHeight = 1882;

// Calculate the height with the aspect ratio of the image
const calculatedHeight = (originalHeight / originalWidth) * screenWidth;

// Define the positions and sizes of the touchable areas based on the above measurements
const touchableAreas = [
  { id: 'sleepDuration', top: -5, left: 21, width: 44, height: 8 },
  { id: 'sleepQuality', top: 9, left: 43, width: 36, height: 10 },
  { id: 'bodyComposition', top: 28, left: 53, width: 45, height: 9 },
  { id: 'nutrition', top: 44, left: 53, width: 34, height: 15 },
  { id: 'stress', top: 65, left: 45, width: 43, height: 10 },
  { id: 'physicalActivity', top: 80, left: 23, width: 75, height: 11 },
];

const WeeklyGoals: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Calculate available height by subtracting top and bottom insets
  const screenHeight = Dimensions.get('window').height;
  const topBarHeight = -60; // Adjust this based on your actual top bar height
  const bottomBarHeight = 148; // Adjust this based on your actual bottom bar height

  // Calculate the top offset to position the image right below the top bar
  const imageTopOffset = insets.top + topBarHeight;

  // Adjust image height to leave space for bottom bar, maintaining aspect ratio
  const adjustedHeight = screenHeight - imageTopOffset - insets.bottom - bottomBarHeight;
  const adjustedWidth = adjustedHeight * (originalWidth / originalHeight);

  // Adjust the top position of each touchable area based on the image's actual position
  const adjustedTouchableAreas = touchableAreas.map((area) => ({
    ...area,
    top: insets.top + (calculatedHeight * area.top) / 100, // Calculate the top position based on the image height and safe area
  }));

  // State to control the visibility of the modal
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState('');

  // Function to open the modal with the selected goal
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
            top: imageTopOffset, // Position image below the top bar
            height: adjustedHeight, // Adjust height based on available space
            width: adjustedWidth, // Maintain aspect ratio
          },
        ]}
        resizeMode="contain"
      />
      {adjustedTouchableAreas.map((area) => (
        <TouchableOpacity
          key={area.id}
          style={[
            styles.touchableArea,
            {
              top: area.top, // Use the adjusted top position
              left: (screenWidth * area.left) / 100, // Calculate left position based on screen width
              width: (screenWidth * area.width) / 100, // Calculate width based on screen width
              height: (calculatedHeight * area.height) / 100, // Calculate height based on image height
            },
          ]}
          onPress={() => openModal(area.id)}
        />
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {/* Modal content here */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{`Content for ${selectedGoal}`}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Use relative for the parent to use absolute positioning for children
  },
  image: {
    position: 'absolute', // Position the image absolutely to control its exact location
    left: 0, // Align image to the left edge of the container
    right: 0, // Align image to the right edge of the container
  },
  touchableArea: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)', // Temporary background color to see the areas
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#52796F",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default WeeklyGoals;
