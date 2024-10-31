import { Firestore, doc, getDoc, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { SleepData } from "../interfaces/sleepData";

// Define interfaces for Firestore data
interface ResultsData {
    bmi: number;
    weightInKg: string;
  }

interface HealthData {
    weight: {
        value: string;
        unit: string;
    };
}

export const calculateBmiProgress = async (userId: string, firestore: Firestore) => {
    const userDocRef = doc(firestore, `users/${userId}`);
    const resultsDocRef = doc(firestore, `users/${userId}/results/scores_${userId}`);

    // Fetch initial BMI and weight data
    const resultsSnapshot = await getDoc(resultsDocRef);
    if (!resultsSnapshot.exists()) return 0;

    const resultsData = resultsSnapshot.data() as ResultsData;
    const initialBmi = resultsData.bmi;
    const initialWeightKg = parseFloat(resultsData.weightInKg);

    // Fetch the most recent weight entry
    const healthDataRef = collection(firestore, `users/${userId}/healthData`);
    const weightQuery = query(healthDataRef, orderBy('date', 'desc'), limit(1));
    const querySnapshot = await getDocs(weightQuery);

    if (querySnapshot.empty) return 0;

    const latestEntry = querySnapshot.docs[0].data() as HealthData;
    const mostRecentWeight = parseFloat(latestEntry.weight.value);
    const weightUnit = latestEntry.weight.unit;
    const mostRecentWeightKg = weightUnit === 'lbs' ? mostRecentWeight * 0.453592 : mostRecentWeight;

    const weightChangeKg = mostRecentWeightKg - initialWeightKg;

    if (initialBmi >= 25 && weightChangeKg <= 0) return 100;
    if (initialBmi >= 25 && weightChangeKg > 2.27) return 66;
    return 100;
};

// Updated calculateSleepEfficiency function
export const calculateSleepEfficiency = (data: SleepData): number => {
    const fallAsleepTime = parseInt(data.fallAsleepHours || '0') * 60 + parseInt(data.fallAsleepMinutes || '0');
    const totalTimeInBed = parseInt(data.inBedHours || '0') * 60 + parseInt(data.inBedMinutes || '0');
    const totalSleepTime = parseInt(data.timeAsleepHours || '0') * 60 + parseInt(data.timeAsleepMinutes || '0');
    const timesWokeUp = parseInt(data.timesWokeUp || '0');
  
    if (totalTimeInBed === 0) return 0;
  
    const sleepEfficiency = (totalSleepTime / (fallAsleepTime + totalSleepTime + timesWokeUp)) * 100;
    return parseFloat(sleepEfficiency.toFixed(2));
};  

// Update progress based on the week number
export const updateProgressBasedOnWeek = (creationDate: Date, lessonProgress: any): boolean => {
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - creationDate.getTime();
    const weekNumber = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000)) + 1;
    return lessonProgress[weekNumber] || false;
};

// Calculate health metrics for diet, sleep, physical activity, etc.
export const calculateHealthMetrics = async (
    firestore: Firestore,
    userId: string,
    startDate: string,
    endDate: string,
    prevStartDate: string,
    prevEndDate: string
    ) => {
    const sleepCollectionRef = collection(firestore, `users/${userId}/sleepData`);
    const healthCollectionRef = collection(firestore, `users/${userId}/healthData`);

    const sleepWeekQuery = query(sleepCollectionRef, where('date', '>=', startDate), where('date', '<=', endDate));
    const prevSleepWeekQuery = query(sleepCollectionRef, where('date', '>=', prevStartDate), where('date', '<=', prevEndDate));

    const healthWeekQuery = query(healthCollectionRef, where('date', '>=', startDate), where('date', '<=', endDate));
    const prevWeekQuery = query(healthCollectionRef, where('date', '>=', prevStartDate), where('date', '<=', prevEndDate));

    let totalPhysicalActivity = 0;
    let prevTotalPhysicalActivity = 0;
    let dietDaysCount = 0;
    let stressResponsesCount = 0;
    let totalSleepEfficiency = 0;
    let countSleepDays = 0;
    let prevTotalSleepEfficiency = 0;
    let prevCountSleepDays = 0;

    const sleepWeekSnapshot = await getDocs(sleepWeekQuery);
    sleepWeekSnapshot.forEach((doc) => {
      const data = doc.data() as SleepData; // Cast to SleepData
      const efficiency = calculateSleepEfficiency(data);
      if (!isNaN(efficiency)) {
        totalSleepEfficiency += efficiency;
        countSleepDays++;
      }
    });

    const avgSleepEfficiency = countSleepDays > 0 ? totalSleepEfficiency / countSleepDays : 0;

    const prevSleepWeekSnapshot = await getDocs(prevSleepWeekQuery);
    prevSleepWeekSnapshot.forEach((doc) => {
        const data = doc.data() as SleepData; // Cast to SleepData
        const efficiency = calculateSleepEfficiency(data);
        if (!isNaN(efficiency)) {
        prevTotalSleepEfficiency += efficiency;
        prevCountSleepDays++;
        }
    });

    const prevAvgSleepEfficiency = prevCountSleepDays > 0 ? prevTotalSleepEfficiency / prevCountSleepDays : 0;

    const prevWeekSnapshot = await getDocs(prevWeekQuery);
    prevWeekSnapshot.forEach((doc) => {
        const data = doc.data();
        prevTotalPhysicalActivity += Number(data.minPA || 0);
    });

    const healthWeekSnapshot = await getDocs(healthWeekQuery);
    healthWeekSnapshot.forEach((doc) => {
        const data = doc.data();
        totalPhysicalActivity += Number(data.minPA || 0);
        if (data.rateDiet && data.rateDiet !== 'null') dietDaysCount++;
        if (data.stressLevel && data.stressLevel !== 'null') stressResponsesCount++;
    });

    // Calculate percentage for diet, stress, physical activity
    const dietPercentage = dietDaysCount >= 3 ? 100 : dietDaysCount === 2 ? 66 : dietDaysCount === 1 ? 33 : 0;
    const stressPercentage = stressResponsesCount >= 3 ? 100 : stressResponsesCount === 2 ? 66 : stressResponsesCount === 1 ? 33 : 0;
    console.log(stressPercentage);

    let physicalActivityPercentage = 0;
    if (totalPhysicalActivity >= 150 || totalPhysicalActivity > prevTotalPhysicalActivity) {
        physicalActivityPercentage = 100;
    } else if (totalPhysicalActivity > 0) {
        physicalActivityPercentage = 50;
    }

    // Calculate sleep efficiency score
    let sleepEfficiencyScore = 0;
    if (countSleepDays === 0) sleepEfficiencyScore = 0;
    else if (avgSleepEfficiency >= 85 || avgSleepEfficiency > prevAvgSleepEfficiency) sleepEfficiencyScore = 100;
    else if (avgSleepEfficiency < 85 && avgSleepEfficiency < (prevAvgSleepEfficiency - (prevAvgSleepEfficiency * 0.05))) sleepEfficiencyScore = 66;

    return {
        dietPercentage,
        stressPercentage,
        physicalActivityPercentage,
        sleepEfficiencyScore,
        avgSleepEfficiency,
    };
};
