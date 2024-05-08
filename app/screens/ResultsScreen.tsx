import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const scaleImage = require('../../assets/scale.png');
const scale1Image = require('../../assets/0_marker.png');
const scale2Image = require('../../assets/20_marker.png');
const scale3Image = require('../../assets/50_marker.png');
const scale4Image = require('../../assets/80_marker.png');
const scale5Image = require('../../assets/100_marker.png');

const getInsomniaSeverityDescription = (score) => {
  let description = "The ISI score is a widely recognized and clinically validated screening tool used by clinicians to evaluate insomnia. Here's what the score means: ";
  if (score >= 8 && score <= 14) {
    description += `Sub-threshold insomnia - Sleep Well offers effective strategies to manage occasional sleep difficulties, enhance sleep quality, and prevent the progression into chronic insomnia.`;
  } else if (score >= 15 && score <= 21) {
    description += `Moderate insomnia - Sleep Well helps identify and modify thoughts and behaviors that contribute to sleep difficulties, introduces techniques like sleep restriction and stimulus control to help regulate sleep patterns, and offers ways to manage stress, anxiety, and negative thoughts that can interfere with sleep.`;
  } else if (score >= 22 && score <= 28) {
    description += `Severe insomnia - Sleep Well delivers a science-based, comprehensive intervention for severe insomnia, employing sleep restriction, stimulus control, relaxation techniques, and cognitive restructuring to address sleep difficulties and promote sustainable improvements in sleep duration and quality.`;
  } else {
    description += `Not clinically significant insomnia - Tailor how the app will help you.`;
  }
  return `${description}\n\n*Note: this is not meant to be a medical diagnosis of insomnia.`;
};

const getSleepApneaDescription = (score) => {
  let riskLevel;
  switch (score) {
    case 5:
      riskLevel = 'high';
      break;
    case 3:
      riskLevel = 'at';
      break;
    case 1:
      riskLevel = 'low';
      break;
    default:
      riskLevel = 'an undetermined';
      break;
  }
  return `You appear at ${riskLevel} risk for having obstructive sleep apnea. Sleep apnea has been linked to daytime sleepiness, reduced alertness, lethargy and impaired driving. It is also associated with hypertension and stroke. To determine if you have sleep apnea, it is necessary to be evaluated by a physician. 

*Note: this is not meant to be a medical diagnosis of sleep apnea.`;
};

const getBMIDescription = (score) => {
  let bmiRange;
  if (score >= 18 && score <= 25) {
    bmiRange = 'in a healthy range';
  } else if (score > 25 && score <= 30) {
    bmiRange = 'an area for some improvement';
  } else if (score > 30) {
    bmiRange = 'an area for improvement';
  } else {
    bmiRange = 'an undetermined';
  }
  return `Your body mass index is ${bmiRange}.

BMI is not a perfect measure but can help determine risk of sleep disorders and chronic diseases. If you have a BMI of 25 or more, our program includes proven strategies to promote healthy weight loss to improve sleep.`;
};

const getDietDescription = (score) => {
  let dietScore;
  switch (score) {
    case 5:
      dietScore = 'an area for improvement';
      break;
    case 3:
      dietScore = 'getting there';
      break;
    case 1:
      dietScore = 'doing great';
      break;
    default:
      dietScore = 'an undetermined';
      break;
  }
  return `Your diet is ${dietScore}.
  
A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Also pay attention to make sure you have plenty of vegetables.`;
};

const getActivityDescription = (score) => {
  let pa;
  switch (score) {
    case 5:
      pa = 'an area for improvement';
      break;
    case 3:
      pa = 'getting there';
      break;
    case 1:
      pa = 'doing great';
      break;
    default:
      pa = 'an undetermined';
      break;
  }
  return `Your physical activity is ${pa}.

A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Also pay attention to make sure you have plenty of vegetables.`
};

const getStressDescription = (score) => {
  let stressScore;
  switch (score) {
    case 5:
      stressScore = 'an area for improvement';
      break;
    case 3:
      stressScore = 'getting there';
      break;
    case 1:
      stressScore = 'doing great';
      break;
    default:
      stressScore = 'an undetermined';
      break;
  }
  return `Your stress is ${stressScore}.
  
Managing stress is a key part of sleep health. Our program provides tools to help manage stress both on and off duty.`;
};

const getCategoryDetails = (results) => ({
  'Insomnia Severity Index': {
    image: results.insomniaSeverityIndex >= 8 && results.insomniaSeverityIndex <= 12
            ? scale1Image
            : results.insomniaSeverityIndex >= 13 && results.insomniaSeverityIndex <= 17
            ? scale2Image
            : results.insomniaSeverityIndex >= 18 && results.insomniaSeverityIndex <= 22
            ? scale3Image
            : results.insomniaSeverityIndex >= 23 && results.insomniaSeverityIndex <= 26
            ? scale4Image
            : results.insomniaSeverityIndex >= 27 && results.insomniaSeverityIndex <= 28
            ? scale5Image
            : scaleImage,
    score: results.insomniaSeverityIndex || 'Not available', // Use the actual score from state
    description: results.insomniaSeverityIndex ? getInsomniaSeverityDescription(results.insomniaSeverityIndex) : 'No score available.',
  },
  'Sleep Apnea Risk': {
    image: results.sleepApneaRisk === 5
            ? scale1Image
            : results.sleepApneaRisk === 3
            ? scale3Image
            : scale5Image,
    score: results.sleepApneaRisk || 'Not available',
    description: results.sleepApneaRisk ? getSleepApneaDescription(results.sleepApneaRisk) : 'No score available.',
  },
  'Sleep Efficiency': {
    image: results.sleepEfficiency <= 20
            ? scale5Image
            : results.sleepEfficiency <= 40
            ? scale4Image
            : results.sleepEfficiency <= 60
            ? scale3Image
            : results.sleepEfficiency <= 80
            ? scale4Image
            : scale5Image,
    score: results.sleepEfficiency || 'Not available',
    description: `Your sleep efficiency is the percent of time that you spent asleep while in bed. The higher your sleep efficiency the better.\n\nMost sleep specialists consider a sleep efficiency of 85% and higher to be healthy.\n\nOur program is designed to help firefighters improve their sleep efficiency. This means, falling asleep faster and improving sleep quality and duration.`,
  },
  'Body Mass Index': {
    image: results.bmi < 18
            ? scale5Image
            : results.bmi <= 25
            ? scale2Image
            : results.bmi <= 30
            ? scale3Image
            : scale4Image,
    score: results.bmi || 'Not available',
    description: results.bmi ? getBMIDescription(results.bmi) : 'No score available.',
  },
  'Diet': {
    image: results.diet === 1
            ? scale1Image
            : results.diet === 3
            ? scale3Image
            : scale5Image,
    score: results.diet || 'Not available',
    description: results.diet ? getDietDescription(results.diet) : 'No score available.',
  },
  'Physical Activity': {
    image: results.physicalActivity <= 20
            ? scale5Image
            : results.physicalActivity <= 40
            ? scale4Image
            : results.physicalActivity <= 60
            ? scale3Image
            : results.physicalActivity <= 80
            ? scale4Image
            : scale5Image,
    score: results.physicalActivity || 'Not available',
    description: results.physicalActivity ? getActivityDescription(results.physicalActivity) : 'No score available.',
  },
  'Stress': {
    image: results.stress === 5
            ? scale1Image
            : results.stress === 3
            ? scale3Image
            : scale5Image,
    score: results.stress || 'Not available',
    description: results.stress ? getStressDescription(results.stress) : 'No score available.',
  }
});

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
  const [results, setResults] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userId = user.uid;
        const resultsDocRef = doc(FIRESTORE_DB, 'users', userId, 'results', `scores_${userId}`);
        const docSnap = await getDoc(resultsDocRef);
        if (docSnap.exists()) {
          setResults(docSnap.data());
        } else {
          console.log("No results available.");
        }
      }
    };
  
    fetchResults();
  }, []);  

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    if (!selectedCategory || !results) return null;
  
    const details = getCategoryDetails(results)[selectedCategory];
  
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
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={styles.categoryContainer}
            onPress={() => handleCategoryPress(category.name)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
            <Image
              source={getCategoryDetails(results)[category.name].image}  // Dynamically set the image source
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
