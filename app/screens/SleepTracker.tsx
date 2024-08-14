import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import SwitchSelector from 'react-native-switch-selector'; // Import the switch selector
import { DateComponent } from '../../components/DateComponent';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

type OptionType = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe' |
                  'Very Poor' | 'Okay' | 'Good' | 'Outstanding' | 'Poor' |
                  'null';

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

const TrackerScreen: React.FC = () => {
  // Generic function to render option buttons for a question
  interface RenderOptionsProps<T extends string | OptionType> {
    question?: string;
    value: T;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    options: T[];
  }
  
  function renderOptions<T extends string | OptionType>({
    question,
    value,
    setValue,
    options = []
  }: RenderOptionsProps<T>) {
    console.log("Options: ", options);
    console.log("Current Value: ", value);
    return (
      <View style={styles.questionContainer}>
        {question && <Text style={styles.questionText}>{question}</Text>}
        <View style={styles.optionsRow}>
          {options.map((option, index) => (
            <OptionButton
              key={index}
              label={option}
              onPress={() => setValue(option)}
              isSelected={value === option}
            />
          ))}
        </View>
      </View>
    );
  }

  const isValidIntegerOrEmpty = (input) => {
    return input.trim() === '' || /^\d+$/.test(input.trim());
  };

  const [date, setDate] = useState(new Date());
  const [isDeployed, setIsDeployed] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isAtHome, setIsAtHome] = useState(false);
  const [sleepRating, setSleepRating] = useState('');

  // Sleep time related questions
  const [timesWokeUp, setTimesWokeUp] = useState<string>('');
  const [naps, setNaps] = useState(false);
  const [sleepMedications, setSleepMedications] = useState(false);
  const [comments, setComments] = useState<string>('');
  const [inBedHours, setInBedHours] = useState<string>('0');
  const [inBedMinutes, setInBedMinutes] = useState<string>('0');
  const [fallAsleepHours, setFallAsleepHours] = useState<string>('0');
  const [fallAsleepMinutes, setFallAsleepMinutes] = useState<string>('0');
  const [timeAsleepHours, setTimeAsleepHours] = useState<string>('0');
  const [timeAsleepMinutes, setTimeAsleepMinutes] = useState<string>('0');
  const [napTimeHours, setNapTimeHours] = useState<string>('0');
  const [napTimeMinutes, setNapTimeMinutes] = useState<string>('0');
  const sleepOptions = ['Very Poor', 'Poor', 'Okay', 'Good', 'Outstanding'];

  // Function to clear form fields
  const clearForm = () => {
    setIsDeployed(false);
    setIsOnDuty(false);
    setIsAtHome(false);
    setTimesWokeUp('');
    setNaps(false);
    setSleepMedications(false);
    setComments('');
    setInBedHours('0');
    setInBedMinutes('0');
    setNapTimeHours('0');
    setNapTimeMinutes('0');
    setTimeAsleepHours('0');
    setTimeAsleepMinutes('0');
    setFallAsleepHours('0');
    setFallAsleepMinutes('0');
    setSleepRating('');
    setCaffeine('');
    setVegetables('');
    setSugaryDrinks('');
    setFastFood('');
    setMinPA('');
    setGoals('');
    setDailyWeight('');
    setWeightUnit('kgs');
    setRateDiet('null');
    setStressLevel('null');
  };

  const [isLoading, setIsLoading] = useState(false);

  const [caffeine, setCaffeine] = useState<string>('');
  const [vegetables, setVegetables] = useState<string>('');
  const [sugaryDrinks, setSugaryDrinks] = useState<string>('');
  const [fastFood, setFastFood] = useState<string>('');
  const [minPA, setMinPA] = useState<string>('');
  const [goals, setGoals] = useState<string>('');
  const [dailyWeight, setDailyWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<string>('kgs');
  const [stressLevel, setStressLevel] = useState<OptionType>('null'); // default value
  const [rateDiet, setRateDiet] = useState<OptionType>('null'); // default value
  const stressOptions: OptionType[] = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];
  const dietOptions: OptionType[] = ['Very Poor', 'Poor', 'Okay', 'Good', 'Outstanding'];

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;
  
    console.log('Before subscription: isLoading=', isLoading); // Debug: Check state before subscription
  
    const formattedDate = date.toISOString().split('T')[0];
    const healthDataRef = doc(collection(FIRESTORE_DB, 'users', userId, 'healthData'), formattedDate);
  
    console.log('Calling setIsLoading(true)'); // Debug: Check when setIsLoading is called
    setIsLoading(true);
  
    const unsubscribe = onSnapshot(healthDataRef, (docSnap) => {
      console.log('Snapshot received: isLoading=', isLoading); // Debug: State when snapshot is received
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCaffeine(data.caffeine);
        setVegetables(data.vegetables);
        setSugaryDrinks(data.sugaryDrinks);
        setFastFood(data.fastFood);
        setMinPA(data.minPA);
        setGoals(data.goals);
        console.log('Setting daily weight:', data.weight?.value);
        setDailyWeight(data.weight?.value);
        console.log('Setting weight unit:', data.weight?.unit || 'kgs');
        setWeightUnit(data.weight?.unit || 'kgs');      
        setRateDiet(data.rateDiet || 'null');
        setStressLevel(data.stressLevel || 'null');
        console.log('Calling setIsLoading(false) after data exists'); // Debug: Check when setIsLoading is called
        setIsLoading(false);
      } else {
        if (!isLoading) {
          clearForm();
        }
        console.log('Calling setIsLoading(false) when no data'); // Debug: Check when setIsLoading is called
        setIsLoading(false);
      }
    });
  
    return () => {
      console.log('Unsubscribing'); // Debug: Check when unsubscribe happens
      unsubscribe();
    };
  }, [date]); // Dependencies array

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;
  
    const formattedDate = date.toISOString().split('T')[0];
    const sleepDataRef = doc(collection(FIRESTORE_DB, 'users', userId, 'sleepData'), formattedDate);

    console.log(`Setting up snapshot listener for date: ${formattedDate}`);
    setIsLoading(true);
  
    const unsubscribe = onSnapshot(sleepDataRef, (docSnap) => {
      console.log(`Snapshot received for date: ${formattedDate}, exists: ${docSnap.exists()}`);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsDeployed(data.isDeployed || false);
        setIsOnDuty(data.isOnDuty || false);
        setIsAtHome(data.isAtHome || false);
        setTimesWokeUp(data.timesWokeUp || '0');
        setNaps(data.naps || false);
        setSleepMedications(data.sleepMedications || false);
        setComments(data.comments || '');
        setInBedHours(data.inBedHours || '0');
        setInBedMinutes(data.inBedMinutes || '0');
        setNapTimeHours(data.napTimeHours || '0');
        setNapTimeMinutes(data.napTimeMinutes || '0');
        setTimeAsleepHours(data.timeAsleepHours || '0');
        setTimeAsleepMinutes(data.timeAsleepMinutes || '0');
        setFallAsleepHours(data.fallAsleepHours || '0');
        setFallAsleepMinutes(data.fallAsleepMinutes || '0');
        // setSliderValue(data.sliderValue || 5);
        setIsLoading(false);
      } else {
        if (!isLoading) {
          clearForm();
        }
      }
    });
  
    return () => {
      console.log(`Cleaning up snapshot listener for date: ${formattedDate}`);
      unsubscribe();
    };
  }, [date]);

  const saveData = async () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      alert("You must be logged in to save your health data.");
      return;
    }
  
    const formattedDate = date.toISOString().split('T')[0];
  
    const validateAndPrepareData = (value, field) => {
      if (!isValidIntegerOrEmpty(value)) {
        // errors.push(field);
      } else {
        return value;
      }
    };
  
    const sleepData = {
      date: formattedDate,
      isDeployed,
      isOnDuty,
      isAtHome,
      timesWokeUp: validateAndPrepareData(timesWokeUp, 'times woke up'),
      naps,
      sleepMedications,
      comments,
      inBedHours: validateAndPrepareData(inBedHours, 'hours in bed'),
      inBedMinutes: validateAndPrepareData(inBedMinutes, 'minutes in bed'),
      napTimeHours: validateAndPrepareData(napTimeHours, 'nap hours'),
      napTimeMinutes: validateAndPrepareData(napTimeMinutes, 'nap minutes'),
      timeAsleepHours: validateAndPrepareData(timeAsleepHours, 'sleep hours'),
      timeAsleepMinutes: validateAndPrepareData(timeAsleepMinutes, 'sleep minutes'),
      fallAsleepHours: validateAndPrepareData(fallAsleepHours, 'fall asleep hours'),
      fallAsleepMinutes: validateAndPrepareData(fallAsleepMinutes, 'fall asleep minutes'),
      sleepRating
    };

    const healthData = {
      date: formattedDate,
      caffeine,
      vegetables,
      sugaryDrinks,
      fastFood,
      minPA,
      rateDiet,  // Store the original value directly
      stressLevel,  // Store the original value directly
      goals,
      weight: {
        value: dailyWeight,
        unit: weightUnit
      },
    };
  
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    const healthDataRef = doc(collection(userDocRef, 'healthData'), formattedDate);
    const sleepDataRef = doc(collection(userDocRef, 'sleepData'), formattedDate);
  
    const addFieldIfValid = (fieldValue, fieldName) => {
      if (isValidIntegerOrEmpty(fieldValue)) {
        healthData[fieldName] = fieldValue;
      } else {
      }
    };
  
    addFieldIfValid(caffeine, 'caffeine');
    addFieldIfValid(vegetables, 'vegetables');
    addFieldIfValid(sugaryDrinks, 'sugaryDrinks');
    addFieldIfValid(fastFood, 'fastFood');
    addFieldIfValid(minPA, 'minPA');

    if (isValidIntegerOrEmpty(caffeine)) {
      healthData.caffeine = caffeine;
    } else {
      alert("Drinks with caffeine today must be a valid integer or empty.");
    }

    if (isValidIntegerOrEmpty(vegetables)) {
      healthData.vegetables = vegetables;
    } else {
      alert("Vegetable servings today must be a valid integer or empty.");
    }

    if (isValidIntegerOrEmpty(sugaryDrinks)) {
      healthData.sugaryDrinks = sugaryDrinks;
    } else {
      alert("Sugary drinks today must be a valid integer or empty.");
    }

    if (isValidIntegerOrEmpty(fastFood)) {
      healthData.fastFood = fastFood;
    } else {
      alert("Fast food today must be a valid integer or empty.");
    }

    if (isValidIntegerOrEmpty(minPA)) {
      healthData.minPA = minPA;
    } else {
      alert("Minutes of physical activity today must be a valid integer or empty.");
    }

    try {
      await setDoc(sleepDataRef, sleepData);
      await setDoc(healthDataRef, healthData);
      console.log('Health data saved successfully.');
      console.log('Sleep data saved successfully.');
    } catch (error) {
      console.error('Error saving sleep data:', error);
      console.error('Error saving health data:', error);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <DateComponent date={date} setDate={setDate} />
        </View>

          <View style={styles.switchContainer}>
              <Text style={styles.questionText}>On Duty?</Text>
              <SwitchSelector
                  initial={0}
                  onPress={value => setIsOnDuty(value)}
                  textColor={'#BDBDBD'} // your active text color
                  selectedColor={'#52796F'} // the color for the label text when it is selected
                  buttonColor={'#BDBDBD'} // the color for the button when it is selected
                  borderColor={'#BDBDBD'} // border color
                  hasPadding
                  options={[
                  { label: 'no', value: 'yes' },
                  { label: 'yes', value: 'no' },
                  ]}
                  style={styles.switchSelector}
                  buttonStyle={styles.switchButton}
              />
          </View>

          <View style={styles.switchContainer}>
              <Text style={styles.questionText}>Deployed?</Text>
              <SwitchSelector
                  initial={0}
                  onPress={value => setIsDeployed(value)}
                  textColor={'#BDBDBD'} // your active text color
                  selectedColor={'#52796F'} // the color for the label text when it is selected
                  buttonColor={'#BDBDBD'} // the color for the button when it is selected
                  borderColor={'#BDBDBD'} // border color
                  hasPadding
                  options={[
                  { label: 'no', value: 'yes' },
                  { label: 'yes', value: 'no' },
                  ]}
                  style={styles.switchSelector}
                  buttonStyle={styles.switchButton}
              />
          </View>

        <View style={styles.questionContainer}>
          {renderOptions('Rate your last sleep:', sleepRating, setSleepRating, sleepOptions)}
        </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          How long were you in bed/cot/mat in total?
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={setInBedHours}
            value={inBedHours}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 99 hours
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={setInBedMinutes}
            value={inBedMinutes}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 59 minutes
          />
          <Text style={styles.unitText}>min</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          How long did you actually sleep in total (excluding naps)?
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={setTimeAsleepHours}
            value={timeAsleepHours}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 99 hours
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={setTimeAsleepMinutes}
            value={timeAsleepMinutes}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 59 minutes
          />
          <Text style={styles.unitText}>min</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          How long did it take you to fall asleep (at first)?
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
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          How many times did you wake up?
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setTimesWokeUp}
          value={timesWokeUp}
          keyboardType="numeric"
          placeholder="# of times"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.questionText}>Take any sleep medications?</Text>
        <SwitchSelector
            initial={0}
            onPress={value => setSleepMedications(value)}
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
        <Text style={styles.questionText}>Any naps during the day before?</Text>
        <SwitchSelector
            initial={0}
            onPress={value => setNaps(value)}
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

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          How much time did you nap in total?
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={setNapTimeHours}
            value={napTimeHours}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 99 hours
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={setNapTimeMinutes}
            value={napTimeMinutes}
            keyboardType="numeric"
            maxLength={2} // Assuming we want to limit to 59 minutes
          />
          <Text style={styles.unitText}>min</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          Comments:
        </Text>
        <TextInput
          style={styles.healthInput}
          onChangeText={setComments}
          value={comments}
          placeholder="Comments"
        />
      </View>

      <View style={styles.questionContainer}>
        {renderOptions({
          question: 'Rate your stress level today:',
          value: stressLevel,
          setValue: setStressLevel,
          options: stressOptions
        })}
        {renderOptions({
          question: 'How are you doing today in managing portions, eating vegetables, and limiting caffeine and sugary drinks?',
          value: rateDiet,
          setValue: setRateDiet,
          options: dietOptions
        })}
      </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Weight:</Text>
          <View style={styles.inputRow}>
            <TextInput
                style={styles.healthInput}
                onChangeText={setDailyWeight}
                value={dailyWeight}
                keyboardType="numeric"
                placeholder="Enter here"
            />
            <SwitchSelector
              key={weightUnit} // add this line
              initial={weightUnit === 'lbs' ? 0 : 1}
              onPress={(value) => setWeightUnit(value)}
              textColor={'#BDBDBD'}
              selectedColor={'#52796F'}
              buttonColor={'#BDBDBD'}
              borderColor={'#BDBDBD'}
              hasPadding
              options={[
                { label: 'lbs', value: 'lbs' },
                { label: 'kgs', value: 'kgs' },
              ]}
              style={styles.switchSelector}
              buttonStyle={styles.switchButton}
            />
          </View>
      </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
              Drinks with caffeine today:
          </Text>
          <TextInput
              style={styles.healthInput}
              onChangeText={setCaffeine}
              value={caffeine}
              keyboardType="numeric"
              placeholder="# of drinks"
          />
      </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
              Vegetable servings today:
          </Text>
          <TextInput
              style={styles.healthInput}
              onChangeText={setVegetables}
              value={vegetables}
              keyboardType="numeric"
              placeholder="# of vegetable servings"
          />
      </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
              Sugary drinks today:
          </Text>
          <TextInput
              style={styles.healthInput}
              onChangeText={setSugaryDrinks}
              value={sugaryDrinks}
              keyboardType="numeric"
              placeholder="# of sugary drinks"
          />
      </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
              Fast food today:
          </Text>
          <TextInput
              style={styles.healthInput}
              onChangeText={setFastFood}
              value={fastFood}
              keyboardType="numeric"
              placeholder="# of fast food items"
          />
      </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
              Minutes of physical activity today:
          </Text>
          <TextInput
              style={styles.healthInput}
              onChangeText={setMinPA}
              value={minPA}
              keyboardType="numeric"
              placeholder="Minutes of physical activity"
          />
      </View>

      <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
              Other goals for today:
          </Text>
          <TextInput
              style={styles.healthInput}
              onChangeText={setGoals}
              value={goals}
              placeholder="Enter your goals here"
          />
      </View>

      <TouchableOpacity style={styles.button} onPress={saveData}>
        <Text style={styles.buttonText}>Save</Text>
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
  labelContainer: {
    marginTop: 16,
    position: 'absolute',
    top: -25, // Adjust this to fit your design
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52796F',
    paddingVertical: 5,
    paddingHorizontal: 10, // This will give space inside the label
    borderRadius: 15, // This will round the corners
  },
  labelText: {
    textAlign: 'center', // Center the text inside the label
    color: 'white',
    backgroundColor: '#52796F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  contentView: {
      padding: 20,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'stretch',
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

export default TrackerScreen;