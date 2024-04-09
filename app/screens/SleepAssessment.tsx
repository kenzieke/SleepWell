import React, { useState } from 'react';
import { router } from "expo-router";
import { ScrollView, View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, Pressable } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { Ionicons } from '@expo/vector-icons';

type Severity = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe' | '';
type Satisfaction = 'Very Satisfied' | 'Satisfied' | 'Somewhat' | 'Dissatisfied' | 'Very Dissatisfied' | '';
type Noticeable = 'Not Noticeable' | 'Rarely' | 'Somewhat' | 'Noticeable' | 'Very Noticeable' | '';
type Worried = 'Never' | 'Rarely' | 'Somewhat' | 'Often' | 'Always' | '';
type Stress = 'None' | 'Low' | 'Moderate' | 'High' | 'Very High' | '';
type CatchAll = 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always' | '';

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

const SleepAssessmentScreen: React.FC = () => {
  const [isDeployed, setIsDeployed] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [difficultyFallingAsleep, setDifficultyFallingAsleep] = useState<Severity>('');
  const [difficultyStayingAsleep, setDifficultyStayingAsleep] = useState<Severity>('');
  const [problemsWakingUpEarly, setProblemsWakingUpEarly] = useState<Severity>('');
  const [sleepSatisfaction, setSleepSatisfaction] = useState<Satisfaction>('');
  const [noticeableSleep, setNoticeableSleep] = useState<Noticeable>('')
  const [worriedAboutSleep, setWorriedAboutSleep] = useState<Worried>('');
  const [interferingWithSleep, setInterferingWithSleep] = useState<CatchAll>('');
  const [snoreLoudly, setSnoreLoudly] = useState<CatchAll>('');
  const [feelTired, setFeelTired] = useState<CatchAll>('');
  const [stopBreathing, setStopBreathing] = useState<CatchAll>('');
  const [caffeinatedBeverages, setCaffeinatedBeverages] = useState<string>('');
  const [sugaryBeverages, setSugaryBeverages] = useState<string>('');
  const [stressLevel, setStressLevel] = useState<Stress>('');
  const [timesWakeUp, setTimesWakeUp] = useState<string>('');
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [height, setHeight] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<string>('cm');
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<string>('kgs');

  // Define a mapping
  const severityMapping = {
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
    'Very Noticeable:': 5,

    'Never': 1,
    'Often': 4,
    'Always': 5,

    'Low': 2,
    'High': 4,
    'Very High': 5
  };

  // Generic function to render option buttons for a question
  const renderOptions = <T extends string>(
    question: string,
    value: T,
    setValue: React.Dispatch<React.SetStateAction<T>>,
    options: T[]
  ) => {
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        <View style={styles.optionsRow}>
          {options.map((option) => (
            <OptionButton
                key={option}
                label={option}
                onPress={() => setValue(option)}
                isSelected={value === option && value !== ''}
            />
            ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* This works for the routing I just can't go back to the index screen for some reason */}
        <Pressable onPress={() => router.push("/screens/LoginScreen")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#52796F" />
        </Pressable>
        <Text style={styles.title}>Sleep Assessment</Text>
        
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
          How many sugary beverages like soda, juices, or Kool-Aid do you consume in a typical day?
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setSugaryBeverages}
          value={sugaryBeverages}
          keyboardType="numeric"
          placeholder="# of beverages"
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
            onPress={value => setHeightUnit(value)}
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
            onPress={value => setWeightUnit(value)}
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

      <TouchableOpacity style={styles.button}>
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
    paddingBottom: 50, // Add padding to the bottom to ensure the 'Next' button is not cut off
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
