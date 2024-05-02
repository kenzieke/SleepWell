import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

const WeeklyLessonsScreen = ({ navigation }) => {
  const [progressData, setProgressData] = useState([
    { label: 'Sleep Tracking', value: 0 },
    { label: 'Food Tracking', value: 0 },
    { label: 'Coaching', value: 0 },
    { label: 'Sleep Efficiency', value: 0 },
    { label: 'Physical Activity', value: 0 },
    { label: 'Diet', value: 0 },
  ]);

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      console.log('User is not logged in.');
      return;
    }
  
    // Function to check if today is Sunday and fetch data if it is
    const checkAndFetchOnNewWeek = () => {
      const today = new Date();
      if (today.getDay() === 0) { // 0 is Sunday
        fetchData(userId);
      }
    };
  
    // Subscribe to navigation focus to refresh data when the screen is focused
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData(userId);
    });
  
    // Initial data fetch
    fetchData(userId);
  
    // Set an interval to check daily if it's a new week (Sunday)
    const intervalId = setInterval(checkAndFetchOnNewWeek, 86400000); // 86400000 ms = 24 hours
  
    // Cleanup function to unsubscribe and clear interval when the component unmounts
    return () => {
      unsubscribeFocus();
      clearInterval(intervalId);
    };
  }, [navigation]); // Dependency on navigation to ensure correct setup and cleanup on navigation changes   

  const fetchData = async (userId: string) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek); // Adjust to the previous Sunday
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Set to the next Saturday
  
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
  
    const healthCollectionRef = collection(FIRESTORE_DB, 'users', userId, 'healthData');
    const q = query(healthCollectionRef, where('date', '>=', start), where('date', '<=', end));
  
    const querySnapshot = await getDocs(q);
    let totalPhysicalActivity = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalPhysicalActivity += Number(data.minPA || 0);
    });
  
    const physicalActivityPercentage = Math.min(100, (totalPhysicalActivity / 150) * 100); // Correctly assuming 150 minutes per week
  
    setProgressData(prevData => prevData.map(item => 
      item.label === 'Physical Activity' ? { ...item, value: physicalActivityPercentage } : item
    ));
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
