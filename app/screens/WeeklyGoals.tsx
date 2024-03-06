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
  { id: 'sleepDuration', top: 4, left: 21, width: 44, height: 8 },
  { id: 'sleepQuality', top: 18, left: 43, width: 36, height: 10 },
  { id: 'bodyComposition', top: 36, left: 53, width: 45, height: 9 },
  { id: 'nutrition', top: 52, left: 53, width: 34, height: 15 },
  { id: 'stress', top: 72, left: 45, width: 43, height: 10 },
  { id: 'physicalActivity', top: 87, left: 22, width: 75, height: 11 },
];


const WeeklyGoals: React.FC = () => {
  // To center the image at the top of the screen and not in the middle of the screen
  const insets = useSafeAreaInsets(); // Hook to get safe area insets

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
    <View style={styles.container}>
      <Image
        source={require('../../assets/wheel_without_header.png')}
        style={[styles.image, { height: calculatedHeight, marginTop: insets.top }]} // Add marginTop to account for status bar height
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
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    // height will be set dynamically
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
