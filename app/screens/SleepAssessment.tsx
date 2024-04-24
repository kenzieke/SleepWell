import { doc, setDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';

type OptionType = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe' |
                  'Very Satisfied' | 'Satisfied' | 'Somewhat' | 'Dissatisfied' | 'Very Dissatisfied' |
                  'Not Noticeable' | 'Rarely' | 'Noticeable' | 'Very Noticeable' |
                  'Never' | 'Often' | 'Always' |
                  'Low' | 'High' | 'Very High' | 'null';

const OptionButton: React.FC<{
    label: string;
    onPress: () => void;
    isSelected: boolean;
  }> = ({ label, onPress, isSelected }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionButton,
        isSelected && styles.optionButtonSelected,
      ]}>
      <Text
        style={[
          styles.optionText,
          isSelected && styles.optionTextSelected,
        ]}
        numberOfLines={2} // Allow text to wrap to a new line
        adjustsFontSizeToFit // Adjust the font size to ensure the text fits
        minimumFontScale={0.5} // Minimum scale factor for text size
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // TODO: Make all of the functions return the score so that you can store the values when you calculate the results

const SleepAssessmentScreen: React.FC = ({ navigation }) => {
  const [isDeployed, setIsDeployed] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [difficultyFallingAsleep, setDifficultyFallingAsleep] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [difficultyStayingAsleep, setDifficultyStayingAsleep] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [problemsWakingUpEarly, setProblemsWakingUpEarly] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [sleepSatisfaction, setSleepSatisfaction] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [noticeableSleep, setNoticeableSleep] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [worriedAboutSleep, setWorriedAboutSleep] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [interferingWithSleep, setInterferingWithSleep] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [snoreLoudly, setSnoreLoudly] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [feelTired, setFeelTired] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [stopBreathing, setStopBreathing] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });
  const [stressLevel, setStressLevel] = useState<{ text: OptionType, value: number }>({ text: 'null', value: -1 });

  const [caffeinatedBeverages, setCaffeinatedBeverages] = useState<string>('');
  const [sugaryBeverages, setSugaryBeverages] = useState<string>('');
  const [timesWakeUp, setTimesWakeUp] = useState<string>('');
  const [sleepHours, setSleepHours] = useState<string>('0');
  const [sleepMinutes, setSleepMinutes] = useState<string>('0');
  const [fallAsleepHours, setFallAsleepHours] = useState<string>('0');
  const [fallAsleepMinutes, setFallAsleepMinutes] = useState<string>('0');
  const [timeAwakeHours, setTimeAwakeHours] = useState<string>('0');
  const [timeAwakeMinutes, setTimeAwakeMinutes] = useState<string>('0');
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [fastFood, setFastFood] = useState<string>('');
  const [servings, setServings] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<string>('cm');
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<string>('kgs');

  // Define a mapping
  const severityMapping: { [key in OptionType]: number } = {
    'None': 1,
    'Mild': 2,
    'Moderate': 3,
    'Severe': 4,
    'Very Severe': 5,
    'Very Satisfied': 1, // Very satisfied assumes minimal problems with sleep
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

  const getMappedValue = (option: OptionType): number => {
    return severityMapping[option] || -1; // Return -1 as default if the option is not found
  };

  const hoursToMinutes = (hoursString: string): number => {
    const hours = parseInt(hoursString, 10); // Convert string to integer base 10
    if (!isNaN(hours)) {
      return hours * 60; // Convert hours to minutes
    } else {
      console.log('Invalid input for hours:', hoursString);
      return 0; // Return 0 or some error value if the input is not a number
    }
  };  

  // This will return a numerical score, which will need to be mapped to the result image
  // TODO: replace console returns with a mapping to an image displayed on the results screen
  // TODO: implement error checking to ensure function calls attention to user if they skip a question, otherwise results won't be accurate
  const getInsomniaSeverityIndex = () => {
    console.log('Function getInsomniaSeverityIndex started'); // For debugging
  
    const scores = {
      difficultyStayingAsleepScore: getMappedValue(difficultyStayingAsleep.text),
      difficultyFallingAsleepScore: getMappedValue(difficultyFallingAsleep.text),
      problemsWakingUpEarlyScore: getMappedValue(problemsWakingUpEarly.text),
      sleepSatisfactionScore: getMappedValue(sleepSatisfaction.text),
      interferingWithSleepScore: getMappedValue(interferingWithSleep.text),
      noticeableSleepScore: getMappedValue(noticeableSleep.text),
      worriedAboutSleepScore: getMappedValue(worriedAboutSleep.text),
    };
    
    let total = 0;
  
    // Go through each score, add to total if not -1, otherwise log it was skipped
    Object.entries(scores).forEach(([question, score]) => {
      if (score !== -1) {
        total += score;
      } else {
        console.log(`${question} was skipped.`);
      }
    });
  
    console.log('Total ISI Score:', total);
  
    if (total >= 0 && total <= 7) {
      console.log('No clinically significant insomnia, score:', total);
    } else if (total >= 8 && total <= 14) {
      console.log('Subthreshold insomnia, score:', total);
    } else if (total >= 15 && total <= 21) {
      console.log('Clinical insomnia (moderate severity), score:', total);
    } else if (total >= 22) {
      console.log('Clinical insomnia (severe), score:', total);
    }
    return total;
  };

  const calculateBMI = () => {
    let weightInKg;
    let heightInMeters;
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight)) {
      console.log('Invalid weight input:', weight);
      return;
    }
    weightInKg = weightUnit === 'lbs' ? parsedWeight * 0.45359237 : parsedWeight;
    const parsedHeight = parseFloat(height);
    if (isNaN(parsedHeight)) {
      console.log('Invalid height input:', height);
      return;
    }
    heightInMeters = heightUnit === 'in' ? parsedHeight * 0.0254 : parsedHeight / 100;
    // BMI = weight in kg / (height in meters)^2
    const bmi = weightInKg / Math.pow(heightInMeters, 2);
    console.log('Your BMI is:', bmi);
    return Math.round(bmi);
  };  

  const getSleepApneaRisk = () => {
    console.log('Function getSleepApneaRisk started'); // For debugging

    const scores = {
      snoreLoudlyScore: getMappedValue(snoreLoudly.text),
      feelTiredScore: getMappedValue(feelTired.text),
      stopBreathingScore: getMappedValue(stopBreathing.text),
      bmi: calculateBMI(),
    };

    let risk = 0;

    // if stopBreathingScore != 1 regardless of all answers, then high risk -> console.log('You're at a high risk')
    // if (snoreLoudlyScore >= 3 and feelTiredScore >= 3) OR ((snoreLoudlyScore >= 3 or feelTiredScore >= 3) and bmiScore >= 25), then at risk -> console.log('You're at risk')
    // else low risk -> console.log('You're at a low risk')

    if (scores.stopBreathingScore !== 1) {
      console.log("You're at a high risk of sleep apnea.");
      risk = 5;
    } else if ((scores.snoreLoudlyScore >= 3 && scores.feelTiredScore >= 3) || ((scores.snoreLoudlyScore >= 3 || scores.feelTiredScore >= 3) && scores.bmi >= 25)) { // potentially undefined if incorrect user input
      console.log("You're at risk of sleep apnea.");
      risk = 3;
    } else {
      console.log("You're at a low risk of sleep apnea.");
      risk = 1;
    }
    return risk;
  };

  const getSleepEfficiency = () => {
    console.log('Function getSleepEfficiency started'); // For debugging
    // [Total sleep time/(total sleep time + time to fall asleep + time you're waking up)] * 100
    const totalTimes = {
      totalSleepMinutes: hoursToMinutes(sleepHours) + parseInt(sleepMinutes, 10),
      totalFallAsleepMinutes: hoursToMinutes(fallAsleepHours) + parseInt(fallAsleepMinutes, 10), // sleep latency
      totalTimeAwakeMinutes: hoursToMinutes(timeAwakeHours) + parseInt(timeAwakeMinutes, 10),
      numberOfTimesAwake: parseInt(timesWakeUp, 10),
    };

    // TODO: Check this math, it should be a percentage so it shouldn't be larger than 100
    const sleepEfficiency = (totalTimes.totalSleepMinutes / (totalTimes.totalSleepMinutes + totalTimes.totalFallAsleepMinutes + totalTimes.totalSleepMinutes)) * 100;
    if (!isNaN(sleepEfficiency)) {
      console.log('Your sleep efficiency is:', sleepEfficiency.toFixed(2));
    } else {
      console.log('One of the inputs is not a valid number.');
    }
    return Math.round(sleepEfficiency);
  };

  // Healthy Eating [> 4 drinks (caffeine and/OR sugary)is red; 0 –1 (caffein and/or sugary) is green, 1-2 is yellow.
  // We will have their worst score be the nutrition goal they need to focus on
  const getDiet = () => {
    let diet = 0;
    console.log('Function getDiet started'); // For debugging
    const parsedSugaryBeverages = parseFloat(sugaryBeverages);
    const parsedCaffeinatedBeverages = parseFloat(caffeinatedBeverages);
    const totalDrinks = parsedSugaryBeverages + parsedCaffeinatedBeverages;
    if (totalDrinks > 4) {
      console.log('Red.');
      diet = 5;
    } else if (totalDrinks >= 2 && totalDrinks <= 3) {
      console.log('Yellow.');
      diet = totalDrinks / 2;
    } else {
      console.log('Green.');
      diet = 1;
    }
    return diet;
  }

  // Physical Activity (0-50 is red; 50-100 is yellow, 100 and above is green)
  const getPhysicalActivity = () => {
    console.log('Function getPhysicalActivity started'); // For debugging
    const totalPAMinutes = Math.round(hoursToMinutes(hours) + parseInt(minutes, 10));
    let physical_activity = 0;
    if (totalPAMinutes >= 0 && totalPAMinutes <= 50) {
      console.log('Red.');
      physical_activity = 5;
    } else if (totalPAMinutes >= 51 && totalPAMinutes <= 100) {
      console.log('Yellow.');
      physical_activity = 3;
    } else {
      console.log('Green.');
      physical_activity = 1;
    }
    return physical_activity;
  }

  const getStress = () => {
    console.log('Function getStress started'); // For debugging
    const stressScore = getMappedValue(stressLevel.text);
    if (stressScore >= 0 && stressScore <= 1) {
      console.log('Green.', stressScore); // For debugging
    } else if (stressScore >= 2 && stressScore <= 3) {
      console.log('Yellow.', stressScore); // For debugging
    } else {
      console.log('Red.', stressScore); // For debugging
    }
    return stressScore;
  }

  const calculateResults = async () => {
    const insomniaSeverityIndex = getInsomniaSeverityIndex();
    const sleepApneaRisk = getSleepApneaRisk();
    const sleepEfficiency = getSleepEfficiency();
    const bmi = calculateBMI();
    const diet = getDiet();
    const physicalActivity = getPhysicalActivity();
    const stress = getStress();

    const results = {
      isDeployed,
      isOnDuty,
      bmi,
      diet,
      insomniaSeverityIndex,
      physicalActivity,
      sleepApneaRisk,
      sleepEfficiency,
      stress,
      completedAssessment: true
    };
  
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(FIRESTORE_DB, 'users', userId);
        const resultsDocRef = doc(collection(userDocRef, 'results'), `scores_${userId}`);
        await setDoc(resultsDocRef, results);
        console.log('Results stored successfully!');
        navigation.navigate('ResultsScreen');
      } else {
        console.log('No user logged in');
      }
    } catch (error) {
      console.error('Error storing results:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // This function will now expect an object with text and value
  const renderOptions = (
    question: string,
    selectedOption: { text: OptionType, value: number },
    setSelectedOption: React.Dispatch<React.SetStateAction<{ text: OptionType, value: number }>>,
    options: string[]
  ) => {
    // When an option is selected, find its corresponding numeric value and update state
    const handlePress = (option: OptionType) => {
      const numericValue = severityMapping[option];
      setSelectedOption({ text: option, value: numericValue });
    };

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        <View style={styles.optionsRow}>
          {options.map((option) => (
            <OptionButton
              key={option}
              label={option}
              onPress={() => handlePress(option)}
              isSelected={selectedOption.text === option}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        
        <View style={styles.switchContainer}>
          <Text style={styles.questionText}>Are you currently deployed?</Text>
          <SwitchSelector
            initial={0}
            onPress={value => setIsDeployed(value)}
            textColor={'#BDBDBD'} // your active text color
            selectedColor={'#52796F'} // the color for the label text when it is selected
            buttonColor={'#BDBDBD'} // the color for the button when it is selected
            borderColor={'#BDBDBD'} // border color
            hasPadding
            options={[
              { label: 'yes', value: 'no' },
              { label: 'no', value: 'yes' },
            ]}
            style={styles.switchSelector}
            buttonStyle={styles.switchButton}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.questionText}>Are you currently on duty?</Text>
          <SwitchSelector
            initial={0}
            onPress={value => setIsOnDuty(value)}
            textColor={'#BDBDBD'} // your active text color
            selectedColor={'#52796F'} // the color for the label text when it is selected
            buttonColor={'#BDBDBD'} // the color for the button when it is selected
            borderColor={'#BDBDBD'} // border color
            hasPadding
            options={[
              { label: 'yes', value: 'no' },
              { label: 'no', value: 'yes' },
            ]}
            style={styles.switchSelector}
            buttonStyle={styles.switchButton}
          />
        </View>

        <Text style={styles.questionText}>Please rate these questions based off of the past 2 weeks.</Text>

        {renderOptions('Difficulty falling asleep:', difficultyFallingAsleep, setDifficultyFallingAsleep, ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'])}
        {renderOptions('Difficulty staying asleep:', difficultyStayingAsleep, setDifficultyStayingAsleep, ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'])}
        {renderOptions('Problems waking up too early:', problemsWakingUpEarly, setProblemsWakingUpEarly, ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'])}
        {renderOptions('How satisfied are you with your current sleep pattern?', sleepSatisfaction, setSleepSatisfaction, ['Very Satisfied', 'Satisfied', 'Somewhat', 'Dissatisfied', 'Very Dissatisfied'])}
        {renderOptions('How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?', noticeableSleep, setNoticeableSleep, ['Not Noticeable', 'Rarely', 'Somewhat', 'Noticeable', 'Very Noticeable'])}
        {renderOptions('How worried are you about your current sleep problem?', worriedAboutSleep, setWorriedAboutSleep, ['Never', 'Rarely', 'Somewhat', 'Often', 'Always'])}
        {renderOptions('To what extent do you consider your sleep problem to interfere with your daily functioning currently?', interferingWithSleep, setInterferingWithSleep, ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'])}
        {renderOptions('Do you snore loudly?', snoreLoudly, setSnoreLoudly, ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'])}
        {renderOptions('Do you often feel tired, fatigued, or sleepy during the day?', feelTired, setFeelTired, ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'])}
        {renderOptions('Has anyone observed you stop breathing during sleep?', stopBreathing, setStopBreathing, ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'])}
        {renderOptions('How would you rate your current stress level?', stressLevel, setStressLevel, ['None', 'Low', 'Moderate', 'High', 'Very High'])}

        <Text style={styles.questionText}>
          How many hours of sleep do you get in a typical night? This is not time in bed. This is time you feel that you are sleeping.
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={setSleepHours}
            value={sleepHours}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 99 hours
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={setSleepMinutes}
            value={sleepMinutes}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 59 minutes
          />
          <Text style={styles.unitText}>min</Text>
        </View>

        <Text style={styles.questionText}>
          How long does it take you to fall asleep in a typical night?
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={setFallAsleepHours}
            value={fallAsleepHours}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 99 hours
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={setFallAsleepMinutes}
            value={fallAsleepMinutes}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 59 minutes
          />
          <Text style={styles.unitText}>min</Text>
        </View>

        <Text style={styles.questionText}>
          How many times do you wake up in a typical night?
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setTimesWakeUp}
          value={timesWakeUp}
          keyboardType="numeric"
          placeholder="# of times"
        />

        <Text style={styles.questionText}>
          Due to the wake-up(s), how long are you awake during a typical night. This is time awake from all the wake-ups combined.
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={setTimeAwakeHours}
            value={timeAwakeHours}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 99 hours
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={setTimeAwakeMinutes}
            value={timeAwakeMinutes}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 59 minutes
          />
          <Text style={styles.unitText}>min</Text>
        </View>

        <Text style={styles.questionText}>
          How many caffeinated beverages do you consume in a typical day?
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setCaffeinatedBeverages}
          value={caffeinatedBeverages}
          keyboardType="numeric"
          placeholder="# of beverages"
        />

        <Text style={styles.questionText}>
          How many times do you eat food from a fast-food restaurant in a typical week?
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setFastFood}
          value={fastFood}
          keyboardType="numeric"
          placeholder="# times in a week"
        />

        <Text style={styles.questionText}>
          How many servings of fruits and vegetables do you typically have per day?
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setServings}
          value={servings}
          keyboardType="numeric"
          placeholder="# of servings per day"
          maxLength={2} // Assuming we want to limit to 9 servings, 5 is recommended
        />

        <Text style={styles.questionText}>
          How many sugary beverages like soda, juices, or Kool-Aid do you consume in a typical day?
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setSugaryBeverages}
          value={sugaryBeverages}
          keyboardType="numeric"
          placeholder="# of beverages"
          maxLength={2}
        />

        <Text style={styles.questionText}>
          How many minutes of physical activity do you do in a typical week?
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={setHours}
            value={hours}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 99 hours
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={setMinutes}
            value={minutes}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 59 minutes
          />
          <Text style={styles.unitText}>min</Text>
        </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>What is your height?</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.healthInput}
              onChangeText={setHeight}
              value={height}
              maxLength={3}
              keyboardType="numeric"
              placeholder="Enter here"
            />
          <SwitchSelector
            initial={0}
            onPress={value => setHeightUnit(value === 'cm' ? 'cm' : 'in')}
            textColor={'#BDBDBD'} // your active text color
            selectedColor={'#52796F'} // the color for the label text when it is selected
            buttonColor={'#BDBDBD'} // the color for the button when it is selected
            borderColor={'#BDBDBD'} // border color
            hasPadding
            options={[
              { label: 'cm', value: 'cm' },
              { label: 'in', value: 'in' },
            ]}
            style={styles.switchSelector}
            buttonStyle={styles.switchButton}
            />
          </View>
        </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>What is your weight?</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.healthInput}
            onChangeText={setWeight}
            value={weight}
            maxLength={3}
            keyboardType="numeric"
            placeholder="Enter here"
          />
          <SwitchSelector
            initial={0}
            onPress={value => setWeightUnit(value === 'kgs' ? 'kgs' : 'lbs')}
            textColor={'#BDBDBD'} // your active text color
            selectedColor={'#52796F'} // the color for the label text when it is selected
            buttonColor={'#BDBDBD'} // the color for the button when it is selected
            borderColor={'#BDBDBD'} // border color
            hasPadding
            options={[
              { label: 'kgs', value: 'kgs' },
              { label: 'lbs', value: 'lbs' },
            ]}
            style={styles.switchSelector}
            buttonStyle={styles.switchButton} // custom style for the switch button
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateResults}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
    paddingBottom: 50,
    width: '100%', // Ensure this view takes full width
  },  
  title: {
    // I would like this to be in line with the back arrow
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    padding: 8, // Padding to make it easier to press
    top: 0,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%', 
  },
  switchSelector: {
    width: 80, // Adjust the width as needed
    height: 30, // Adjust the height as needed
    borderRadius: 15, // Half of the height to make it rounded
    marginLeft: 150, // Add some space between the text input and the switch
  },
  switchButton: {
    padding: 2, // Reduce padding to decrease the size of the button
    // You may also want to adjust fontSize here if the text is too large after scaling
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // Set a fixed height for buttons
  },
  optionButtonSelected: {
    backgroundColor: '#52796F',
    borderColor: '#52796F',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    flexShrink: 1, // Allow text to shrink if needed
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
    flexShrink: 1, // Allow text to shrink if needed
    marginBottom: 16,
  },
  healthInput: {
    borderBottomWidth: 1, // Add underline
    borderColor: '#BDBDBD', // Set underline color
    paddingVertical: 5, // Adjust padding as needed
    marginBottom: 20, // Space between the inputs
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInput: {
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    textAlign: 'center',
    width: 60, // Fixed width for the inputs
    fontSize: 16,
    paddingVertical: 5,
  },
  unitText: {
    fontSize: 16,
    width: 50, // Fixed width for the unit text
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
});

export default SleepAssessmentScreen;
