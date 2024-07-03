import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Button, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

type OptionType = 'Very Poor' | 'Okay' | 'Good' | 'Outstanding' | 'Poor' | 'null';

const WeeklyLessonsScreen = ({ navigation }) => {
  interface ProgressDataItem {
    label: string;
    value?: number;
    score?: number;
    avgEfficiency?: number;
  }

  const [progressData, setProgressData] = useState<ProgressDataItem[]>([
    { label: 'Sleep Efficiency', score: 0, avgEfficiency: 0 },
    { label: 'Body Comp', value: 0 },
    { label: 'Nutrition', value: 0 },
    { label: 'Physical Activity', value: 0 },
    { label: 'Stress', value: 0 },
    { label: 'Weekly Lesson', value: 0 },
  ]);

  // State to handle modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Function to handle opening modal
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const [userProgress, setUserProgress] = useState({});

  const updateProgressBasedOnWeek = (creationDate, lessonProgress) => {
    const currentDate = new Date();
    const timeDiff = currentDate - creationDate;
    const weekNumber = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000)) + 1;
    console.log("Week Number: ", weekNumber);
  
    return lessonProgress[weekNumber] || false;
  };

  const calculateSleepEfficiency = (data: {
    fallAsleepHours: string,
    fallAsleepMinutes: string,
    inBedHours: string,
    inBedMinutes: string,
    timeAsleepHours: string,
    timeAsleepMinutes: string,
    timesWokeUp: string
  }): number => {
    const fallAsleepTime = parseInt(data.fallAsleepHours || '0') * 60 + parseInt(data.fallAsleepMinutes || '0');
    const totalTimeInBed = parseInt(data.inBedHours || '0') * 60 + parseInt(data.inBedMinutes || '0');
    const totalSleepTime = parseInt(data.timeAsleepHours || '0') * 60 + parseInt(data.timeAsleepMinutes || '0');
    const timesWokeUp = parseInt(data.timesWokeUp || '0');
  
    // Directly return 0 if no time was spent in bed
    if (totalTimeInBed === 0) {
      return 0;
    }
  
    // Calculate sleep efficiency if there's valid data
    const sleepEfficiency = totalSleepTime / (fallAsleepTime + totalSleepTime + timesWokeUp) * 100;
    return parseFloat(sleepEfficiency.toFixed(2));
  };

  const calculateBmiProgress = async (userId) => {
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    const resultsDocRef = doc(userDocRef, 'results', `scores_${userId}`);
  
    // Fetch initial BMI and weight data
    const resultsSnapshot = await getDoc(resultsDocRef);
    if (!resultsSnapshot.exists()) {
      console.log("No initial BMI and weight data available.");
      return 0;  // Handle case where there is no initial data
    }
  
    const resultsData = resultsSnapshot.data();
    const initialBmi = resultsData.bmi;
    const initialWeightKg = parseFloat(resultsData.weightInKg); // Assume initial weight is always in kg

    // Fetch the most recent weight entry
    const healthDataRef = collection(userDocRef, 'healthData');
    const weightQuery = query(healthDataRef, orderBy('date', 'desc'), limit(1));
    const querySnapshot = await getDocs(weightQuery);
    if (querySnapshot.empty) {
      console.log("No weight data tracked after the initial entry.");
      return 0; // No weight data tracked after the initial entry
    }
  
    const latestEntry = querySnapshot.docs[0].data();
    const mostRecentWeight = parseFloat(latestEntry.weight.value);
    const weightUnit = latestEntry.weight.unit; // 'lbs' or 'kgs'
    
    // Check the unit of the weight and convert if necessary
    const mostRecentWeightKg = weightUnit === 'lbs' ? mostRecentWeight * 0.453592 : mostRecentWeight;
  
    // Calculate weight change in kg
    const weightChangeKg = mostRecentWeightKg - initialWeightKg;

    if (initialBmi >= 25) {
      if (weightChangeKg <= 0) {
        console.log("Weight maintained or lost from initial.");
        return 100;  // Return 100% if weight is maintained or lost
      } else if (weightChangeKg > 2.27) {  // More than 5 pounds (2.27 kg) gained
        console.log("Gained more than 5 pounds from initial weight.");
        return 66;  // Return 66% if more than 5 pounds are gained
      }
    }

    // TODO: Ask about this
    if (initialBmi <= 24) {
      console.log("BMI was less than 25, automatically 100%?");
      return 100;
    }
  
    console.log("Conditions for BMI progress not met.");
    return 0;
  };  
  
  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      console.log('User is not logged in.');
      return;
    }

    if (userId) {
      fetchData(userId);
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

  // useEffect(() => {
  //   const userId = FIREBASE_AUTH.currentUser?.uid;
  //   if (!userId) {
  //     console.log('User is not logged in.');
  //     return;
  //   }
  
  //   fetchData(userId);
  // }, [userProgress]);

  // useEffect(() => {
  //   console.log("Current User Progress State:", userProgress);
  // }, [userProgress]);

  const fetchData = async (userId: string) => {
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log("User Data:", userData);

        const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
        const lessonTrackingSnapshot = await getDoc(lessonTrackingRef);

        if (lessonTrackingSnapshot.exists()) {
            const lessonProgress = lessonTrackingSnapshot.data();
            setUserProgress(lessonProgress);  // This assumes that the structure directly mirrors the progressData array

            // Calculate current week completion status immediately after setting state
            const creationDate = new Date(userData.creationDate);
            const currentWeekLessonCompleted = updateProgressBasedOnWeek(creationDate, lessonProgress);
            console.log("Current Week Lesson Completed:", currentWeekLessonCompleted);

            // Update the progressData state
            setProgressData(prevData => prevData.map(item => {
                if (item.label === 'Weekly Lesson') {
                    return {
                        ...item,
                        value: currentWeekLessonCompleted ? 100 : 0,
                    };
                }
                return item;
            }));
        } else {
            console.log("No lesson tracking data available.");
        }
    } else {
        console.log("User document does not exist.");
    }

    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek); // Previous Sunday
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Following Saturday

    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(startDate.getDate() - 7);
    const prevEndDate = new Date(endDate);
    prevEndDate.setDate(endDate.getDate() - 7);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const prevStart = prevStartDate.toISOString().split('T')[0];
    const prevEnd = prevEndDate.toISOString().split('T')[0];

    const resultsDocRef = doc(FIRESTORE_DB, 'users', userId, 'results', `scores_${userId}`);

    // Get the latest results for baseline data
    const resultsSnapshot = await getDoc(resultsDocRef);
    let baselineBmi = 0;
    let baselineWeight = 0;
    if (resultsSnapshot.exists()) {
      const resultsData = resultsSnapshot.data();
      baselineBmi = resultsData.bmi;
      baselineWeight = resultsData.weightInKg;
    }

    // Attempt to fetch the latest weight entry from the health tracker
    const healthDataRef = collection(userDocRef, 'healthData');
    const querySnapshot = await getDocs(query(healthDataRef, orderBy('date', 'desc'), limit(1)));
    let lastWeightEntry = baselineWeight; // Default to baseline weight
    querySnapshot.forEach((doc) => {
      const healthData = doc.data();
      if (healthData.weightInKg) {
        lastWeightEntry = healthData.weightInKg;
      }
    });

    const bmiProgress = await calculateBmiProgress(userId, baselineWeight, baselineBmi);
    console.log("BMI Progress Calculated:", bmiProgress);

    // Firestore references
    const sleepCollectionRef = collection(FIRESTORE_DB, 'users', userId, 'sleepData');
    const healthCollectionRef = collection(FIRESTORE_DB, 'users', userId, 'healthData');

    // Queries for weekly sleep data
    const sleepWeekQuery = query(sleepCollectionRef, where('date', '>=', start), where('date', '<=', end));
    const prevSleepWeekQuery = query(sleepCollectionRef, where('date', '>=', prevStart), where('date', '<=', prevEnd));

    // Queries for current and previous weekly data
    const healthWeekQuery = query(healthCollectionRef, where('date', '>=', start), where('date', '<=', end));
    const prevWeekQuery = query(healthCollectionRef, where('date', '>=', prevStart), where('date', '<=', prevEnd));

    // Initialize tracking variables
    let totalPhysicalActivity = 0;
    let prevTotalPhysicalActivity = 0;
    let daysWithSleepData = 0;
    let daysWithCaffeineData = 0;
    let dietDaysCount = 0;
    let stressResponsesCount = 0;
    let prevTotalSleepEfficiency = 0;
    let prevCountSleepDays = 0;
    let totalSleepEfficiency = 0;
    let countSleepDays = 0;

    const sleepWeekSnapshot = await getDocs(sleepWeekQuery);
    sleepWeekSnapshot.forEach((doc) => {
      const data = doc.data();
      const efficiency = calculateSleepEfficiency(data);
      if (!isNaN(efficiency)) {
        totalSleepEfficiency += efficiency;
        countSleepDays++;
      }
    });

    // useEffect(() => {
    //   const userId = FIREBASE_AUTH.currentUser?.uid;
    //   if (userId) {
    //       fetchData(userId);
    //   }
    // }, [userId]);

    const avgSleepEfficiency = countSleepDays > 0 ? totalSleepEfficiency / countSleepDays : 0;

    // Process previous week sleep data
    const prevSleepWeekSnapshot = await getDocs(prevSleepWeekQuery);
    prevSleepWeekSnapshot.forEach((doc) => {
        const data = doc.data();
        const efficiency = calculateSleepEfficiency(data);
        if (!isNaN(efficiency)) {
            prevTotalSleepEfficiency += efficiency;
            prevCountSleepDays++;
        }
    });

    // Calculate average efficiencies
    const prevAvgSleepEfficiency = prevCountSleepDays > 0 ? prevTotalSleepEfficiency / prevCountSleepDays : 0;

    // Process health data from the previous week
    const prevWeekSnapshot = await getDocs(prevWeekQuery);
    prevWeekSnapshot.forEach((doc) => {
        const data = doc.data();
        prevTotalPhysicalActivity += Number(data.minPA || 0);
    });

    // Process health data over the current week
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

      // Count days with stress data
      if (data.stressLevel && data.stressLevel !== 'null') {
          stressResponsesCount++;
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

    let stressPercentage = 0;
    if (stressResponsesCount >= 3) {
        stressPercentage = 100;
    } else if (stressResponsesCount === 2) {
        stressPercentage = 66;
    } else if (stressResponsesCount === 1) {
        stressPercentage = 33;
    }

    // Calculate the physical activity percentage based on new criteria
    let physicalActivityPercentage = 0;
    if (totalPhysicalActivity >= 150 || totalPhysicalActivity > prevTotalPhysicalActivity) {
        physicalActivityPercentage = 100;
    } else if (totalPhysicalActivity > 0 && (totalPhysicalActivity <= (prevTotalPhysicalActivity * 0.95) || totalPhysicalActivity < 150)) {
        physicalActivityPercentage = 50;
    }

    // Check if there's any valid sleep data
    const validSleepData = countSleepDays > 0 && totalSleepEfficiency > 0;

    // Logging the sleep efficiency scores for debugging
    console.log(`Previous Week's Average Sleep Efficiency: ${prevAvgSleepEfficiency}`);
    console.log(`This Week's Average Sleep Efficiency: ${avgSleepEfficiency}`);

    // Determine sleep efficiency score
    let sleepEfficiencyScore = 0;
    if (countSleepDays === 0) {
      sleepEfficiencyScore = 0;  // No valid data
    } else if (avgSleepEfficiency >= 85 || (avgSleepEfficiency > prevAvgSleepEfficiency)) {
      sleepEfficiencyScore = 100;  // Sleep quality/efficiency increased or is 85% or greater
    } else if (avgSleepEfficiency < 85 && avgSleepEfficiency < (prevAvgSleepEfficiency - (prevAvgSleepEfficiency * 0.05))) {
      sleepEfficiencyScore = 66;  // Sleep was tracked but decreased by 5% or more and was lower than 85%
    } else {
      sleepEfficiencyScore = 0;  // Default to 0 if none of the above conditions are met
    }

    // Update progress data with sleep efficiency
    setProgressData((prevData) => prevData.map((item) => {
      switch (item.label) {
        case 'Body Comp':
          return { ...item, value: bmiProgress };
        case 'Physical Activity':
          return { ...item, value: physicalActivityPercentage };
        case 'Nutrition':
          return { ...item, value: dietPercentage };
        case 'Stress':
          return { ...item, value: stressPercentage };
        case 'Sleep Efficiency':
          return { ...item, value: sleepEfficiencyScore, avgEfficiency: avgSleepEfficiency };
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
          <TouchableOpacity key={index} onPress={() => handleOpenModal(item)}>
            <ProgressCircle
              key={`first-row-${index}`}
              percentage={item.value}
              label={item.label}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.progressRow}>
        {progressData.slice(3).map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleOpenModal(item)}>
            <ProgressCircle
              key={`second-row-${index}`}
              percentage={item.value}
              label={item.label}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedItem && selectedItem.label === 'Sleep Efficiency' && (
              <>
                <Text style={styles.modalText}>
                  Sleep Efficiency: {selectedItem.avgEfficiency.toFixed(2)}% -
                  {selectedItem.avgEfficiency >= 85 && " Doing Great"}
                  {selectedItem.avgEfficiency < 85 && selectedItem.avgEfficiency >= 50 && " On your way"}
                  {selectedItem.avgEfficiency < 50 && " Reminder to track your sleep every day"}
                </Text>
              </>
            )}
            {selectedItem && selectedItem.label === 'Nutrition' && (
              <>
                <Text style={styles.modalText}>
                  {selectedItem.value === 100 && "Great job tracking your diet this week!"}
                  {selectedItem.value === 66 && "Getting there…reminder to track your eating every day for best results."}
                  {selectedItem.value < 66 && selectedItem.value > 0 && "! - Reminder to track your eating every day for best results."}
                  {selectedItem.value === 0 && "! - No diet data tracked this week."}
                </Text>
              </>
            )}
            {selectedItem && selectedItem.label === 'Stress' && (
              <Text style={styles.modalText}>
                {selectedItem.value === 100 && "Great job tracking your stress this week. Try different tools until you find the ones that work best for you to reduce stress."}
                {selectedItem.value === 66 && "Try to track your stress level every day and different tools until you find the ones that work best for you to reduce stress."}
                {selectedItem.value < 66 && "! - Reminder to track your stress levels every day and try different tools until you find the ones that work best for you to reduce stress."}
              </Text>
            )}
            {selectedItem && selectedItem.label === 'Body Comp' && (
              <Text style={styles.modalText}>
                {selectedItem.value === 100 && "Great job this week!"}
                {selectedItem.value === 66 && "Keep working to meet yor goals."}
                {selectedItem.value < 66 && "! - Reminder to track your body weight every day."}
              </Text>
            )}
            {selectedItem && selectedItem.label === 'Physical Activity' && (
              <Text style={styles.modalText}>
                {selectedItem.value === 100 && "Great job this week!"}
                {selectedItem.value === 50 && "Keep working to meet yor goals."}
                {selectedItem.value < 50 && "! - Reminder to track your physical activity every day."}
              </Text>
            )}
            {selectedItem && selectedItem.label === 'Weekly Lesson' && (
              <Text style={styles.modalText}>
                {selectedItem.value === 100 && "Great job this week!"}
                {selectedItem.value === 0 && "! - Reminder to do your lesson every week."}
              </Text>
            )}
            <Button
              title="Close"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default WeeklyLessonsScreen;