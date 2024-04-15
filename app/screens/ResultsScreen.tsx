import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MarkerComponent from '../../components/MarkerComponent';
import { Dimensions } from 'react-native';

// Get the full width of the device screen
const screenWidth = Dimensions.get('window').width;

// Set a padding value if you want some space on the sides
const paddingHorizontal = 20; // Total padding for both sides

// Calculate the scale image width
const scaleImageWidth = screenWidth - (paddingHorizontal * 2);

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

const ResultsScreen = ({ navigation, route }) => {
  const { assessmentResults } = route.params;
  // Handler for when a result category is clicked
  const handleCategoryPress = (category) => {
    // Navigate to the detail view for the category
    console.log(`Navigating to details of ${category}`);
  };

  const onFinishPressed = () => {
    navigation.navigate('WeeklyLessons');
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.instructionText}>
          Click on any of the following categories to see more about your results.
        </Text>

        {/* Loop through the categories array */}
        {/* {categories.map((category) => (
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
        ))} */}
        {categories.map((category) => (
        <View key={category.name} style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{category.name}</Text>
          <View style={{ width: scaleImageWidth, height: 40, position: 'relative' }}>
            <Image
              source={category.image}
              style={[styles.scaleImage, { width: scaleImageWidth }]}
              resizeMode="contain"
            />
            {/* Render the marker with the user's score */}
            <MarkerComponent
              score={assessmentResults.insomniaSeverityIndex}
              totalScore={22} // Or whatever your total score is for that category
              scaleWidth={scaleImageWidth}
            />
          </View>
        </View>
    ))}
      </View>
      {/* <TouchableOpacity style={styles.button} onPress={onFinishPressed}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity> */}
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
});

export default ResultsScreen;
