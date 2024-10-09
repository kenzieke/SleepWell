import React, { useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { DateComponent } from '../../components/DateComponent';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { useHealthTrackerStore } from '../../stores/HealthTrackerStore';

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
      numberOfLines={2}
      adjustsFontSizeToFit
      minimumFontScale={0.5}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const HealthTrackerScreen: React.FC = () => {
  const {
    date,
    caffeine,
    vegetables,
    sugaryDrinks,
    fastFood,
    minPA,
    goals,
    dailyWeight,
    weightUnit,
    rateDiet,
    stressLevel,
    isLoading,
    setInput,
    clearForm,
    setIsLoading,
  } = useHealthTrackerStore();

  const renderOptions = (field: string, options: OptionType[], selectedValue: OptionType) => {
    return (
      <View style={styles.optionsRow}>
        {options.map(option => (
          <OptionButton
            key={option}
            label={option}
            onPress={() => setInput(field, option)}
            isSelected={selectedValue === option}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const formattedDate = date.toISOString().split('T')[0];
    const healthDataRef = doc(collection(FIRESTORE_DB, 'users', userId, 'healthData'), formattedDate);

    setIsLoading(true);

    const unsubscribe = onSnapshot(healthDataRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setInput('caffeine', data.caffeine);
        setInput('vegetables', data.vegetables);
        setInput('sugaryDrinks', data.sugaryDrinks);
        setInput('fastFood', data.fastFood);
        setInput('minPA', data.minPA);
        setInput('goals', data.goals);
        setInput('dailyWeight', data.weight?.value);
        setInput('weightUnit', data.weight?.unit || 'kgs');
        setInput('rateDiet', data.rateDiet || 'null');
        setInput('stressLevel', data.stressLevel || 'null');
        setIsLoading(false);
      } else {
        clearForm();
        setIsLoading(false);
      }
    });

    return () => {
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

    const healthData = {
      date: formattedDate,
      caffeine,
      vegetables,
      sugaryDrinks,
      fastFood,
      minPA,
      rateDiet,
      stressLevel,
      goals,
      weight: {
        value: dailyWeight,
        unit: weightUnit
      },
    };

    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    const healthDataRef = doc(collection(userDocRef, 'healthData'), formattedDate);

    try {
      await setDoc(healthDataRef, healthData);
      console.log('Health data saved successfully.');
    } catch (error) {
      console.error('Error saving health data:', error);
      alert('Failed to save health data. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <DateComponent date={date} setDate={(newDate: string) => setInput('date', newDate)} />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Rate your stress level today:</Text>
          {renderOptions('stressLevel', ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'], stressLevel)}
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>How are you doing today in managing portions, eating vegetables, and limiting caffeine and sugary drinks?</Text>
          {renderOptions('rateDiet', ['Very Poor', 'Poor', 'Okay', 'Good', 'Outstanding'], rateDiet)}
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Weight:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.healthInput}
              onChangeText={(value) => setInput('dailyWeight', value)}
              value={dailyWeight}
              keyboardType="numeric"
              placeholder="Enter here"
            />
            <SwitchSelector
              key={weightUnit}
              initial={weightUnit === 'lbs' ? 0 : 1}
              onPress={(value) => setInput('weightUnit', value)}
              options={[
                { label: 'lbs', value: 'lbs' },
                { label: 'kgs', value: 'kgs' },
              ]}
              style={styles.switchSelector}
              textColor={'#BDBDBD'}
              selectedColor={'#FFFFFF'}
              buttonColor={'#52796F'}
            />
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Drinks with caffeine today:</Text>
          <TextInput
            style={styles.healthInput}
            onChangeText={(value) => setInput('caffeine', value)}
            value={caffeine}
            keyboardType="numeric"
            placeholder="# of drinks"
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
    paddingBottom: 50,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  healthInput: {
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    paddingVertical: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    height: 40,
  },
  optionButtonSelected: {
    backgroundColor: '#52796F',
    borderColor: '#52796F',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    flexShrink: 1,
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  switchSelector: {
    width: 100,
    marginTop: 8,
  },
  switchButton: {
    padding: 5,
  },
});

export default HealthTrackerScreen;
