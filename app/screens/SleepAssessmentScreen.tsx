import { doc, setDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import OptionButton, { OptionType } from '../components/OptionButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../types/navigationTypes';
import * as assessmentHelpers from '../../utils/sleepAssessmentHelpers';

type SleepAssessmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SleepAssessmentScreen'>;

const SleepAssessmentScreen = () => {
  const navigation = useNavigation<SleepAssessmentScreenNavigationProp>();
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

  const calculateResults = async () => {
    // Validate and convert height
    const heightInMeters = assessmentHelpers.calculateHeight(height, heightUnit);
    if (!heightInMeters) {
      return alert('Please provide a valid height.');
    }
  
    // Validate and convert weight
    const weightInKg = weightUnit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight);
    if (isNaN(weightInKg)) {
      return alert('Please provide a valid weight.');
    }
  
    // Calculate BMI
    const bmi = assessmentHelpers.calculateBMI(weight, weightUnit, heightInMeters);
    if (typeof bmi === 'undefined') {
      return alert('Please provide valid weight and height to calculate BMI.');
    }
  
    // Calculate other results
    const insomniaSeverityIndex = assessmentHelpers.getInsomniaSeverityIndex({
      difficultyFallingAsleep: difficultyFallingAsleep.text,
      difficultyStayingAsleep: difficultyStayingAsleep.text,
      problemsWakingUpEarly: problemsWakingUpEarly.text,
      sleepSatisfaction: sleepSatisfaction.text,
      interferingWithSleep: interferingWithSleep.text,
      noticeableSleep: noticeableSleep.text,
      worriedAboutSleep: worriedAboutSleep.text,
    });
  
    const sleepApneaRisk = assessmentHelpers.getSleepApneaRisk(
      snoreLoudly.value,
      feelTired.value,
      stopBreathing.value,
      bmi
    );
  
    // TODO: Double check this is correct when I have more brain power
    const sleepEfficiency = assessmentHelpers.getSleepEfficiency(
      parseInt(sleepHours, 10) * 60,
      parseInt(sleepMinutes, 10),
      parseInt(timeAwakeMinutes, 10)
    );
  
    const diet = assessmentHelpers.getDiet(caffeinatedBeverages, sugaryBeverages);
    const physicalActivity = assessmentHelpers.getPhysicalActivity(hours, minutes);
    console.log(physicalActivity);
    const stress = assessmentHelpers.getStress(stressLevel.value);
  
    // Prepare results object
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
      heightInMeters,
      weightInKg,
      completedAssessment: true,
    };
  
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(FIRESTORE_DB, 'users', userId);
        const resultsDocRef = doc(collection(userDocRef, 'results'), `scores_${userId}`);
        await setDoc(resultsDocRef, results, { merge: true });
        navigation.replace('ResultsScreen');
      } else {
        console.error('No user logged in');
      }
    } catch (error) {
      console.error('Error storing results:', error);
    }
  };

  // This function will now expect an object with text and value
  const renderOptions = (
    question: string,
    selectedOption: { text: OptionType, value: number },
    setSelectedOption: React.Dispatch<React.SetStateAction<{ text: OptionType, value: number }>>,
    options: string[]
  ) => {
    // When an option is selected, find its corresponding numeric value and update state
    const handlePress = (option: OptionType) => {
      const numericValue = assessmentHelpers.severityMapping[option];
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
              onPress={() => handlePress(option as OptionType)}
              isSelected={selectedOption.text === option}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          maxLength={1}
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
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateResults}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
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
