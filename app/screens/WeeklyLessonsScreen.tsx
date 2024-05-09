import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

type OptionType = 'Very Poor' | 'Okay' | 'Good' | 'Outstanding' | 'Poor' | 'null';

const WeeklyLessonsScreen = ({ navigation }) => {
  const [progressData, setProgressData] = useState([
    { label: 'Sleep Tracking', value: 0 },
    { label: 'Food Tracking', value: 0 },
    { label: 'Coaching', value: 0 },
    { label: 'Sleep Efficiency', value: 0 },
    { label: 'Physical Activity', value: 0 },
    { label: 'Nutrition', value: 0 },
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
  }, [navigation]);

  const fetchData = async (userId: string) => {
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

    // Queries for weekly data
    const healthWeekQuery = query(healthCollectionRef, where('date', '>=', start), where('date', '<=', end));

    // Initialize tracking variables
    let totalPhysicalActivity = 0;
    let daysWithSleepData = 0;
    let daysWithCaffeineData = 0;
    let dietDaysCount = 0;

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

        // Count days with diet data
        if (data.rateDiet && data.rateDiet !== 'null') {
            dietDaysCount++;
        }
    });

    // Determine the diet percentage based on the count of days
    let dietPercentage = 0;
    if (dietDaysCount >= 3) {
        dietPercentage = 100;
    } else if (dietDaysCount === 2) {
        dietPercentage = 66;
    } else if (dietDaysCount === 1) {
        dietPercentage = 33;
    }

    // Calculate other percentages
    const foodTrackingPercentage = (daysWithCaffeineData / 7) * 100;
    const sleepTrackingPercentage = (daysWithSleepData / 7) * 100;
    const physicalActivityPercentage = Math.min(100, (totalPhysicalActivity / 150) * 100);

    // Update progress data
    setProgressData((prevData) => prevData.map((item) => {
        switch (item.label) {
            case 'Food Tracking':
                return { ...item, value: foodTrackingPercentage };
            case 'Physical Activity':
                return { ...item, value: physicalActivityPercentage };
            case 'Sleep Tracking':
                return { ...item, value: sleepTrackingPercentage };
            case 'Nutrition':
                return { ...item, value: dietPercentage };
            default:
                return item;
        }
    }));
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.greenHeader}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LessonTrackingScreen')}
        >
          <Text style={styles.buttonText}>Start Lessons</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Weekly Progress</Text>
      <View style={styles.progressRow}>
        {progressData.slice(0, 3).map((item, index) => (
          <ProgressCircle
            key={`first-row-${index}`}
            percentage={item.value}
            label={item.label}
          />
        ))}
      </View>
      <View style={styles.progressRow}>
        {progressData.slice(3).map((item, index) => (
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
    backgroundColor: '#52796F',
    paddingTop: 250, // TODO: This should be dynamic if possible, but it will need to be changed in final production
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#83F45C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WeeklyLessonsScreen;
