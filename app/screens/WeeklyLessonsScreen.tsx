import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, onSnapshot } from 'firebase/firestore';

// Define the BMI calculation function
const calculateBMI = (weightObject: { unit: string; value: string; }, heightInCm: number) => {
  const weightInKg = weightObject.unit === 'lbs' ? parseFloat(weightObject.value) * 0.45359237 : parseFloat(weightObject.value);
  const heightInMeters = heightInCm / 100;
  return weightInKg / (heightInMeters ** 2);
};

const WeeklyLessonsScreen = ({ navigation }) => {
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
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // Triggering the data fetch when the screen comes into focus
      fetchData();
    });
  
    // Initial fetch when the component mounts
    fetchData();
  
    return () => {
      // Clean up both the focus listener and the data fetch subscription
      unsubscribeFocus();
    };
  }, [navigation]);

  const fetchData = () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;
  
    const currentDate = new Date().toISOString().split('T')[0];
    const healthDataRef = doc(FIRESTORE_DB, 'users', userId, 'healthData', currentDate);
    const resultsRef = doc(FIRESTORE_DB, 'users', userId, 'results', `scores_${userId}`);
  
    // Subscribe to changes in the healthData collection for the current date
    const unsubscribeHealth = onSnapshot(healthDataRef, (healthDoc) => {
      if (healthDoc.exists()) {
        const healthData = healthDoc.data();
        const weightObject = healthData.weight; // This should now be defined

        const steps = healthData.steps || 0;
        const physicalActivityPercentage = Math.min(100, (steps / 10000) * 100);
        
        // Update the physical activity progress
        setProgressData(prevData => prevData.map(item => 
          item.label === 'Physical Activity' ? { ...item, value: physicalActivityPercentage } : item
        ));
  
        if (weightObject) {
          // Now, retrieve the height from the results collection
          const unsubscribeResults = onSnapshot(resultsRef, (resultsDoc) => {
            if (resultsDoc.exists()) {
              const resultsData = resultsDoc.data();
              const heightInMeters = resultsData.heightInMeters;
              
              // Check if both height and weight are available
              if (heightInMeters) {
                // Perform the BMI calculation
                const bmiValue = calculateBMI(weightObject, heightInMeters * 100);
                const bmiPercentage = getBMIPercentage(bmiValue);
                
                setProgressData(prevData => prevData.map(item =>
                  item.label === 'Body Composition' ? { ...item, value: bmiPercentage } : item
                ));
              }
            } else {
              console.log("Results document does not exist.");
            }
          });
  
          // Don't forget to handle unsubscribing for results as well
        } else {
          console.log("Weight object is undefined.");
        }
      } else {
        console.log("Health data document does not exist for the current date.");
      }
    });
  
    // Remember to handle unsubscribing for healthData as well
  };   

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
