import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';

const scaleImage = require('../../assets/scale.png');

// Define the categories as an array of objects
const categories = [
  { name: 'Insomnia Severity Index', image: scaleImage },
  { name: 'Sleep Apnea Risk', image: scaleImage },
  { name: 'Sleep Efficiency', image: scaleImage },
  { name: 'Body Mass Index', image: scaleImage },
  { name: 'Diet', image: scaleImage },
  { name: 'Physical Activity', image: scaleImage },
  { name: 'Stress', image: scaleImage },
];

// Define the categories as an array of objects with additional description and score
const categoryDetails = {
  'Insomnia Severity Index': {
    image: scaleImage,
    score: 'XX', // Replace 'XX' with the actual score from your state or props
    description: 'The ISI score is a widely recognized and clinically validated screening tool used by clinicians to evaluate insomnia. Here\'s what the score means: *Note: this is not meant to be a medical diagnosis of insomnia.',
  },
  'Sleep Apnea Risk': {
    image: scaleImage,
    score: 'XX', // Replace 'XX' with the actual score from your state or props
    description: 'You appear at (High, low, or just say risk) risk for having obstructive sleep apnea.  Sleep apnea has been linked to daytime sleepiness, reduced alertness, lethargy and impaired driving. It is also associated with hypertension and stroke.  To determine if you have sleep apnea, it is necessary to be evaluated by a physician. *Note: this is not meant to be a medical diagnosis of sleep apnea.',
  },
  'Sleep Efficiency': {
    image: scaleImage,
    score: 'XX', // Replace 'XX' with the actual score from your state or props
    description: 'Your sleep efficiency is the percent of time that you spent asleep while in bed. The higher your sleep efficiency the better. Most sleep specialists consider a sleep efficiency of 85% and higher to be healthy. Our program is designed to help firefighters improve their sleep efficiency.  This means, falling asleep faster and improving sleep quality and duration.',
  },
  'Body Mass Index': {
    image: scaleImage,
    score: 'XX', // Replace 'XX' with the actual score from your state or props
    description: 'BMI is not a perfect measure but can help determine risk of sleep disorders and chronic diseases.  If you have a BMI of 25 or more, our program includes proven strategies to promote healthy weight loss to improve sleep.'
  },
  'Diet': {
    image: scaleImage,
    score: 'XX',
    description: 'A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Also pay attention to make sure you have plenty of vegetables.',
  },
};

const ResultsScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  // // Function to render the modal content
  // const renderModalContent = () => (
  //   <View style={styles.modalContent}>
  //     <Text style={styles.modalText}>Details of {selectedCategory}</Text>
  //     {/* Add more content or buttons as needed */}
  //     <TouchableOpacity
  //       onPress={() => setModalVisible(false)}
  //       style={styles.button}>
  //       <Text style={styles.buttonText}>Close</Text>
  //     </TouchableOpacity>
  //   </View>
  // );

    // Function to render the modal content
    const renderModalContent = () => {
      // Get the details for the selected category
      const details = categoryDetails[selectedCategory];
      
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalHeaderText}>
            Your {selectedCategory} score is:
          </Text>
          <Text style={styles.modalScoreText}>{details.score}</Text>
          <Text style={styles.modalDescriptionText}>{details.description}</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      );
    };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.instructionText}>
          Click on any of the following categories to see more about your results.
        </Text>

        {/* Loop through the categories array */}
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={styles.categoryContainer}
            onPress={() => handleCategoryPress(category.name)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
            <Image
              source={category.image}
              style={styles.scaleImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Modal component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          {selectedCategory && renderModalContent()}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#52796F',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
  },
  scaleImage: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#52796F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 24,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalScoreText: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescriptionText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
});

export default ResultsScreen;
