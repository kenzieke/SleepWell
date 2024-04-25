import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

// Define the BMI calculation function
const calculateBMI = (weightObject: { unit: string; value: string; }, heightInCm: number) => {
  const weightInKg = weightObject.unit === 'lbs' ? parseFloat(weightObject.value) * 0.45359237 : parseFloat(weightObject.value);
  const heightInMeters = heightInCm / 100;
  return weightInKg / (heightInMeters ** 2);
};

const WeeklyLessonsScreen: React.FC = () => {
  const [progressData, setProgressData] = useState([
    { label: 'Sleep Duration', value: 0 },
    { label: 'Sleep Quality', value: 0 },
    { label: 'Body Composition', value: 0 },
    { label: 'Nutrition', value: 0 },
    { label: 'Physical Activity', value: 0 },
    { label: 'Stress', value: 0 },
  ]);

  const getBMIPercentage = (bmiValue: number) => {
    if (bmiValue >= 18 && bmiValue <= 25) {
      return 100;
    } else if (bmiValue > 25 && bmiValue <= 30) {
      return 66;
    } else {
      return 33;
    }
  };

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    // Define references to the healthData and results collections
    const currentDate = new Date().toISOString().split('T')[0];
    const healthDataRef = doc(FIRESTORE_DB, 'users', userId, 'healthData', currentDate);
    const resultsRef = doc(FIRESTORE_DB, 'users', userId, 'results', `scores_${userId}`);

    // Subscribe to changes in healthData and results collections
    const unsubscribeHealth = onSnapshot(healthDataRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const steps = data.steps || 0;
        const physicalActivityPercentage = Math.min(100, (steps / 10000) * 100);
        
        // Update the physical activity progress
        setProgressData(prevData => prevData.map(item => 
          item.label === 'Physical Activity' ? { ...item, value: physicalActivityPercentage } : item
        ));
      }
    });

    const unsubscribeResults = onSnapshot(resultsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log("Results data:", data); // Debug log
        const heightInCm = data.height;
        const weightObject = data.weight;

        if (heightInCm && weightObject) {
          const bmiValue = calculateBMI(weightObject, heightInCm);
          console.log("Calculated BMI Value:", bmiValue); // Debug log
          const bmiPercentage = getBMIPercentage(bmiValue);
          console.log("BMI Percentage for progress:", bmiPercentage); // Debug log

          setProgressData(prevData => prevData.map(item =>
            item.label === 'Body Composition' ? { ...item, value: bmiPercentage } : item
          ));
        }
      }
    });

    // Cleanup the subscriptions on unmount
    return () => {
      unsubscribeHealth();
      unsubscribeResults();
    };
  }, []);

  // Split the data into two rows
  const firstRowData = progressData.slice(0, 3);
  const secondRowData = progressData.slice(3);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.greenHeader}></View>
      <Text style={styles.header}>Daily Progress</Text>
      <View style={styles.progressRow}>
        {firstRowData.map((item, index) => (
          <ProgressCircle
            key={`first-row-${index}`}
            percentage={item.value}
            label={item.label}
          />
        ))}
      </View>
      <View style={styles.progressRow}>
        {secondRowData.map((item, index) => (
          <ProgressCircle
            key={`second-row-${index}`}
            percentage={item.value}
            label={item.label}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greenHeader: {
    backgroundColor: '#52796F', // Adjust the color to match your design
    paddingTop: 300, // Adjust the padding to match your design
    paddingBottom: 20, // Adjust the padding to match your design
  },
  header: {
    paddingTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000', // White text for the header
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageStyle: {
    // Set your image styling here
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 16, // Adjust as needed to fit your design
  },
});

export default WeeklyLessonsScreen;
