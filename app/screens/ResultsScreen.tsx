import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

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

const ResultsScreen = ({ navigation }) => {
  // Handler for when a result category is clicked
  const handleCategoryPress = (category) => {
    // Navigate to the detail view for the category
    console.log(`Navigating to details of ${category}`);
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
