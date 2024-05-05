import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

type OptionType = 'Very Poor' | 'Okay' | 'Good' | 'Outstanding' | 'Poor' | 'null';

const WeeklyLessonsScreen = ({ navigation }) => {
  const [progressData, setProgressData] = useState([
    { label: 'Sleep Tracking', value: 0 },
    { label: 'Food Tracking', value: 0 },
    { label: 'Coaching', value: 0 },
    { label: 'Sleep Efficiency', value: 0 },
    { label: 'Physical Activity', value: 0 },
    { label: 'Diet', value: 0 },
  ]);

  const dietPercentageMapping: { [key in OptionType]: number } = {
    'Very Poor': 20,
    'Poor': 40,
    'Okay': 60,
    'Good': 80,
    'Outstanding': 100,
    'null': 0, // If not set, consider 0%
  };

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
    // Calculate the start and end dates of the current week
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek); // Previous Sunday
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Following Saturday
  
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
  
    // Firestore references
    const healthCollectionRef = collection(FIRESTORE_DB, 'users', userId, 'healthData');
    const sleepCollectionRef = collection(FIRESTORE_DB, 'users', userId, 'sleepData');
  
    // Queries for weekly data
    const healthWeekQuery = query(healthCollectionRef, where('date', '>=', start), where('date', '<=', end));
    const sleepWeekQuery = query(sleepCollectionRef, where('date', '>=', start), where('date', '<=', end));
  
    // Query for today's data specifically (for diet)
    const todayDocRef = doc(healthCollectionRef, today.toISOString().split('T')[0]);
  
    // Initialize tracking variables
    let totalPhysicalActivity = 0;
    let daysWithSleepData = 0;
    let daysWithCaffeineData = 0;
    let dietPercentage = 0;
  
    // Process health data over the week
    const healthWeekSnapshot = await getDocs(healthWeekQuery);
    healthWeekSnapshot.forEach((doc) => {
      const data = doc.data();
  
      // Check for caffeine data
      if (data.caffeine && data.caffeine !== '') {
        daysWithCaffeineData++;
      }
  
      // Aggregate physical activity
      totalPhysicalActivity += Number(data.minPA || 0);
    });
  
    // Process sleep data over the week
    const sleepWeekSnapshot = await getDocs(sleepWeekQuery);
    sleepWeekSnapshot.forEach((doc) => {
      const data = doc.data();
  
      // Check for valid sleep data
      const totalSleepTimeHours = parseInt(data.timeAsleepHours) || 0;
      const totalSleepTimeMinutes = parseInt(data.timeAsleepMinutes) || 0;
      if (totalSleepTimeHours > 0 || totalSleepTimeMinutes > 0) {
        daysWithSleepData++;
      }
    });
  
    // Retrieve diet data for today
    const todaySnapshot = await getDoc(todayDocRef);
    if (todaySnapshot.exists()) {
      const data = todaySnapshot.data();
      const dietPercentageMapping = {
        'Very Poor': 20,
        'Poor': 40,
        'Okay': 60,
        'Good': 80,
        'Outstanding': 100,
        'null': 0,
      };
  
      dietPercentage = dietPercentageMapping[data.rateDiet] || 0;
    }
  
    // Calculate percentages
    const foodTrackingPercentage = (daysWithCaffeineData / 7) * 100;
    const sleepTrackingPercentage = (daysWithSleepData / 7) * 100;
    const physicalActivityPercentage = Math.min(100, (totalPhysicalActivity / 150) * 100);
  
    // Update progress data
    setProgressData(prevData => prevData.map(item => {
      switch (item.label) {
        case 'Food Tracking':
          return { ...item, value: foodTrackingPercentage };
        case 'Physical Activity':
          return { ...item, value: physicalActivityPercentage };
        case 'Sleep Tracking':
          return { ...item, value: sleepTrackingPercentage };
        case 'Diet':
          return { ...item, value: dietPercentage };
        default:
          return item;
      }
    }));
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
