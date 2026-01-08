import { OptionType } from "../app/components/OptionButton";

// Severity mapping
export const severityMapping: { [key in OptionType]: number } = {
  'None': 1,
  'Mild': 2,
  'Moderate': 3,
  'Severe': 4,
  'Very Severe': 5,
  'Very Satisfied': 1,
  'Satisfied': 2,
  'Somewhat': 3,
  'Dissatisfied': 4,
  'Very Dissatisfied': 5,
  'Not Noticeable': 1,
  'Rarely': 2,
  'Noticeable': 4,
  'Very Noticeable': 5,
  'Never': 1,
  'Often': 4,
  'Always': 5,
  'Low': 2,
  'High': 4,
  'Very High': 5,
  'null': -1,
};

// Convert OptionType to numeric value
export const getMappedValue = (option: OptionType): number => {
  return severityMapping[option] || -1;
};

// Convert hours string to minutes
export const hoursToMinutes = (hoursString: string): number => {
  const hours = parseInt(hoursString, 10);
  return isNaN(hours) ? 0 : hours * 60;
};

// Calculate height in meters
export const calculateHeight = (height: string, heightUnit: string): number | undefined => {
  const parsedHeight = parseFloat(height);
  if (isNaN(parsedHeight)) {
    console.log('Invalid height input:', height);
    return undefined;
  }
  return heightUnit === 'in' ? parsedHeight * 0.0254 : parsedHeight / 100;
};

// Calculate BMI
export const calculateBMI = (weight: string, weightUnit: string, heightInMeters?: number): number | undefined => {
  const parsedWeight = parseFloat(weight);
  if (isNaN(parsedWeight) || !heightInMeters || heightInMeters <= 0) {
    console.error('Invalid weight or height input for BMI calculation');
    return undefined;
  }
  const weightInKg = weightUnit === 'lbs' ? parsedWeight * 0.453592 : parsedWeight;
  return Math.round(weightInKg / Math.pow(heightInMeters, 2));
};

// Calculate diet score based on beverages
export const getDiet = (caffeinatedBeverages: string, sugaryBeverages: string): number => {
  const totalDrinks = parseFloat(caffeinatedBeverages) + parseFloat(sugaryBeverages);
  if (totalDrinks > 4) return 5;
  if (totalDrinks >= 2 && totalDrinks <= 3) return 3;
  return 1;
};

// Calculate sleep efficiency percentage
export const getSleepEfficiency = (sleepMinutes: number, fallAsleepMinutes: number, awakeMinutes: number): number | undefined => {
  const totalTimeInBed = sleepMinutes + fallAsleepMinutes + awakeMinutes;
  return totalTimeInBed ? Math.round((sleepMinutes / totalTimeInBed) * 100) : undefined;
};

// Calculate stress score
export const getStress = (stressScore: number): number => {
  if (stressScore <= 1) return 1;
  if (stressScore <= 3) return 3;
  return 5;
};

// Calculate sleep apnea risk
export const getSleepApneaRisk = (snoreScore: number, tiredScore: number, stopBreathingScore: number, bmi: number | undefined): number => {
  if (stopBreathingScore !== 1) return 5;
  if ((snoreScore >= 3 && tiredScore >= 3) || ((snoreScore >= 3 || tiredScore >= 3) && bmi && bmi >= 25)) return 3;
  return 1;
};

// Calculate Insomnia Severity Index
export const getInsomniaSeverityIndex = (responses: {
  difficultyStayingAsleep: OptionType;
  difficultyFallingAsleep: OptionType;
  problemsWakingUpEarly: OptionType;
  sleepSatisfaction: OptionType;
  interferingWithSleep: OptionType;
  noticeableSleep: OptionType;
  worriedAboutSleep: OptionType;
}): number => {
  const scores = {
    difficultyStayingAsleepScore: getMappedValue(responses.difficultyStayingAsleep),
    difficultyFallingAsleepScore: getMappedValue(responses.difficultyFallingAsleep),
    problemsWakingUpEarlyScore: getMappedValue(responses.problemsWakingUpEarly),
    sleepSatisfactionScore: getMappedValue(responses.sleepSatisfaction),
    interferingWithSleepScore: getMappedValue(responses.interferingWithSleep),
    noticeableSleepScore: getMappedValue(responses.noticeableSleep),
    worriedAboutSleepScore: getMappedValue(responses.worriedAboutSleep),
  };

  let total = 0;

  Object.entries(scores).forEach(([question, score]) => {
    if (score !== -1) {
      total += score;
    } else {
      console.log(`${question} was skipped.`);
    }
  });

  return total;
};

// Physical Activity (0-50 is red; 50-100 is yellow, 100 and above is green)
export const getPhysicalActivity = (hours: string, minutes: string): number => {
  // Helper function to convert hours to minutes
  const hoursToMinutes = (hours: string): number => {
    const parsedHours = parseInt(hours, 10);
    if (isNaN(parsedHours) || parsedHours < 0) {
      throw new Error(`Invalid hours: "${hours}". It must be a non-negative number.`);
    }
    return parsedHours * 60;
  };

  // Parse and validate minutes
  const parsedMinutes = parseInt(minutes, 10);
  if (isNaN(parsedMinutes) || parsedMinutes < 0 || parsedMinutes >= 60) {
    throw new Error(`Invalid minutes: "${minutes}". It must be between 0 and 59.`);
  }

  // Calculate total physical activity in minutes
  const totalMinutes = Math.round(hoursToMinutes(hours) + parsedMinutes);

  // Determine physical activity score
  if (totalMinutes <= 50) {
    return 5; // Red zone
  } else if (totalMinutes <= 100) {
    return 3; // Yellow zone
  } else {
    return 1; // Green zone
  }
};
