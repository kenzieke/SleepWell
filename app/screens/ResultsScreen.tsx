import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { CategoryDetails, useResultsStore } from '../../stores/resultsStore';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../types/navigationTypes';
import { useNavigation } from '@react-navigation/native';

type WeeklyLessonsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResultsScreen'>;

const ResultsScreen = () => {
  const navigation = useNavigation<WeeklyLessonsScreenNavigationProp>();
  const {
    results,
    isModalVisible,
    selectedCategory,
    fetchResults,
    setModalVisible,
    setSelectedCategory,
    getCategoryDetails,
  } = useResultsStore();

  useEffect(() => {
    fetchResults();
  }, []);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    if (!selectedCategory) return null;

    const details: CategoryDetails = getCategoryDetails(results)[selectedCategory];

    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalHeaderText}>Your {selectedCategory} score is:</Text>
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
        {Object.keys(getCategoryDetails(results)).map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryContainer}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
            <Image
              source={getCategoryDetails(results)[category].image}
              style={styles.scaleImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          {renderModalContent()}
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
