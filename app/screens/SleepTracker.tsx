import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { DateComponent } from '../components/DateComponent';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../types/navigationTypes';
import { useBannerStore } from '../../stores/BannerStore';
import SaveBanner from '../components/SaveBanner';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';
import FirstTimeModal from '../components/FirstTimeModal';

type SleepTrackerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SleepTrackerScreen'>;

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

const SleepTrackerScreen: React.FC = () => {
  const navigation = useNavigation<SleepTrackerScreenNavigationProp>();
  const { showBanner, message, visible, hideBanner } = useBannerStore();

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

  interface IsValidIntegerOrEmpty {
    (input: string): boolean;
  }

  const isValidIntegerOrEmpty: IsValidIntegerOrEmpty = (input) => {
    return input.trim() === '' || /^\d+$/.test(input.trim());
  };

  const [date, setDate] = useState(new Date());
  const [isDeployed, setIsDeployed] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isAtHome, setIsAtHome] = useState(false);
  const [sleepRating, setSleepRating] = useState('');

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
  const [originalData, setOriginalData] = useState<any>(null);

  const [caffeine, setCaffeine] = useState<string>('');
  const [vegetables, setVegetables] = useState<string>('');
  const [sugaryDrinks, setSugaryDrinks] = useState<string>('');
  const [fastFood, setFastFood] = useState<string>('');
  const [minPA, setMinPA] = useState<string>('');
  const [goals, setGoals] = useState<string>('');
  const [dailyWeight, setDailyWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<string>('kgs');
  const [stressLevel, setStressLevel] = useState<OptionType>('null');
  const [rateDiet, setRateDiet] = useState<OptionType>('null');
  const stressOptions: OptionType[] = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];
  const dietOptions: OptionType[] = ['Very Poor', 'Poor', 'Okay', 'Good', 'Outstanding'];

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    console.log('Before subscription: isLoading=', isLoading);

    const formattedDate = date.toISOString().split('T')[0];
    const healthDataRef = doc(collection(FIRESTORE_DB, 'users', userId, 'healthData'), formattedDate);

    console.log('Calling setIsLoading(true)');
    setIsLoading(true);

    const unsubscribe = onSnapshot(healthDataRef, (docSnap) => {
      console.log('Snapshot received: isLoading=', isLoading);
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
        setIsLoading(false);

        setOriginalData((prev: any) => ({
          ...prev,
          healthData: data,
        }));
      } else {
        if (!isLoading) {
          clearForm();
        }
        setIsLoading(false);
        setOriginalData((prev: any) => ({ ...prev, healthData: null }));
      }
    });

    return () => {
      console.log('Unsubscribing');
      unsubscribe();
    };
  }, [date]);

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
        setIsLoading(false);

        setOriginalData((prev: any) => ({
          ...prev,
          sleepData: data,
        }));
      } else {
        if (!isLoading) {
          clearForm();
        }
        setOriginalData((prev: any) => ({ ...prev, sleepData: null }));
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

    interface ValidateAndPrepareData {
      (value: string, field: string): string | undefined;
    }

    const validateAndPrepareData: ValidateAndPrepareData = (value, field) => {
      if (!isValidIntegerOrEmpty(value)) {
        alert(`${field} must be a valid integer or empty.`);
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

    const healthData: HealthData = {
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
    const sleepDataRef = doc(collection(userDocRef, 'sleepData'), formattedDate);

    interface HealthData {
      date: string;
      caffeine: string;
      vegetables: string;
      sugaryDrinks: string;
      fastFood: string;
      minPA: string;
      rateDiet: OptionType;
      stressLevel: OptionType;
      goals: string;
      weight: {
      value: string;
      unit: string;
      };
    }


    const addFieldIfValid = (fieldValue: string, fieldName: keyof HealthData) => {
      if (isValidIntegerOrEmpty(fieldValue)) {
        (healthData as unknown as Record<string, string | OptionType | { value: string; unit: string }>)[fieldName] = fieldValue;
      } else {
        alert(`${fieldName} must be a valid integer or empty.`);
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
      const hasChanges =
        JSON.stringify(sleepData) !== JSON.stringify(originalData?.sleepData) ||
        JSON.stringify(healthData) !== JSON.stringify(originalData?.healthData);

      console.log('Has changes:', hasChanges);
      console.log('Original data exists:', !!originalData);

      if (!hasChanges && originalData) {
        showBanner('No changes detected to save.');
      } else {
        await setDoc(sleepDataRef, sleepData);
        await setDoc(healthDataRef, healthData);

        setOriginalData({ sleepData, healthData });
        showBanner('Results saved!');
      }
    } catch (error) {
      alert('Failed to save data. Please try again.');
    }
  };

  const displayEmptyOrValue = (value: string): string => value === '0' ? '' : value;

  interface HandleInputChange {
    (setter: React.Dispatch<React.SetStateAction<string>>): (value: string) => void;
  }

  const handleInputChange: HandleInputChange = (setter) => (value) => {
    setter(value === '' ? '0' : value);
  };

  interface HandleMinuteInputChange {
    (setter: React.Dispatch<React.SetStateAction<string>>): (value: string) => void;
  }

  const handleMinuteInputChange: HandleMinuteInputChange = (setter) => (value) => {
    if (value === '') {
      setter('0');
    } else {
      const numValue = parseInt(value, 10);
      if (numValue > 59) {
        setter('59');
      } else {
        setter(value);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <FirstTimeModal
        storageKey="@hasSeenSleepTracker"
        message="Track your sleep and health information here daily."
      />
      <SaveBanner
        visible={visible}
        message={message}
        onHide={hideBanner}
      />
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
                  textColor={colors.borderMedium}
                  selectedColor={colors.primary}
                  buttonColor={colors.borderMedium}
                  borderColor={colors.borderMedium}
                  hasPadding
                  options={[
                  { label: 'no', value: 'yes' },
                  { label: 'yes', value: 'no' },
                  ]}
                  style={styles.switchSelector}
              />
          </View>

          <View style={styles.switchContainer}>
              <Text style={styles.questionText}>Deployed?</Text>
              <SwitchSelector
                  initial={0}
                  onPress={value => setIsDeployed(value)}
                  textColor={colors.borderMedium}
                  selectedColor={colors.primary}
                  buttonColor={colors.borderMedium}
                  borderColor={colors.borderMedium}
                  hasPadding
                  options={[
                  { label: 'no', value: 'yes' },
                  { label: 'yes', value: 'no' },
                  ]}
                  style={styles.switchSelector}
              />
          </View>

        <View style={styles.questionContainer}>
          {renderOptions({
          question: 'Rate your last sleep:',
          value: sleepRating,
          setValue: setSleepRating,
          options: sleepOptions
        })}
        </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          How long were you in bed/cot/mat in total?
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={handleInputChange(setInBedHours)}
            value={displayEmptyOrValue(inBedHours)}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={handleMinuteInputChange(setInBedMinutes)}
            value={displayEmptyOrValue(inBedMinutes)}
            keyboardType="numeric"
            maxLength={2}
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
            onChangeText={handleInputChange(setTimeAsleepHours)}
            value={displayEmptyOrValue(timeAsleepHours)}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={handleMinuteInputChange(setTimeAsleepMinutes)}
            value={displayEmptyOrValue(timeAsleepMinutes)}
            keyboardType="numeric"
            maxLength={2}
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
            onChangeText={handleInputChange(setFallAsleepHours)}
            value={displayEmptyOrValue(fallAsleepHours)}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={handleMinuteInputChange(setFallAsleepMinutes)}
            value={displayEmptyOrValue(fallAsleepMinutes)}
            keyboardType="numeric"
            maxLength={2}
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
          onChangeText={handleInputChange(setTimesWokeUp)}
          value={displayEmptyOrValue(timesWokeUp)}
          keyboardType="numeric"
          placeholder="# of times"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.questionText}>Take any sleep medications?</Text>
        <SwitchSelector
            initial={0}
            onPress={value => setSleepMedications(value)}
            textColor={colors.borderMedium}
            selectedColor={colors.primary}
            buttonColor={colors.borderMedium}
            borderColor={colors.borderMedium}
            hasPadding
            options={[
            { label: 'no', value: 'yes' },
            { label: 'yes', value: 'no' },
            ]}
            style={styles.switchSelector}
          />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.questionText}>Any naps during the day before?</Text>
        <SwitchSelector
            initial={0}
            onPress={value => setNaps(value)}
            textColor={colors.borderMedium}
            selectedColor={colors.primary}
            buttonColor={colors.borderMedium}
            borderColor={colors.borderMedium}
            hasPadding
            options={[
            { label: 'no', value: 'yes' },
            { label: 'yes', value: 'no' },
            ]}
            style={styles.switchSelector}
          />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          How much time did you nap in total?
        </Text>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={handleInputChange(setNapTimeHours)}
            value={displayEmptyOrValue(napTimeHours)}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={styles.unitText}>hours</Text>
          <TextInput
            style={styles.timeInput}
            onChangeText={handleMinuteInputChange(setNapTimeMinutes)}
            value={displayEmptyOrValue(napTimeMinutes)}
            keyboardType="numeric"
            maxLength={2}
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
        <Text style={styles.sectionHeaderText}>This next section is to be completed at the end of your day:</Text>
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
                maxLength={3}
            />
            <SwitchSelector
              key={weightUnit}
              initial={weightUnit === 'lbs' ? 0 : 1}
              onPress={(value) => setWeightUnit(value)}
              textColor={colors.borderMedium}
              selectedColor={colors.primary}
              buttonColor={colors.borderMedium}
              borderColor={colors.borderMedium}
              hasPadding
              options={[
                { label: 'kgs', value: 'kgs' },
                { label: 'lbs', value: 'lbs' },
              ]}
              style={styles.switchSelector}
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
              maxLength={2}
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
              maxLength={2}
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
              maxLength={2}
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
              maxLength={2}
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
              maxLength={3}
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  backButton: {
    padding: spacing.sm,
    top: 0,
  },
  labelContainer: {
    marginTop: spacing.lg,
    position: 'absolute',
    top: -25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: 15,
  },
  labelText: {
    textAlign: 'center',
    color: colors.textWhite,
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  contentView: {
    padding: spacing.xl,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  switchSelector: {
    width: 80,
    height: 30,
    borderRadius: 15,
    marginLeft: 150,
  },
  switchButton: {
    padding: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  optionTextSelected: {
    color: colors.textWhite,
  },
  questionContainer: {
    marginBottom: spacing.lg,
  },
  questionText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    textAlign: 'left',
    flexShrink: 1,
    marginBottom: spacing.lg,
  },
  healthInput: {
    borderBottomWidth: 1,
    borderColor: colors.borderMedium,
    paddingVertical: 5,
    marginBottom: spacing.xl,
    fontSize: fontSizes.md,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  timeInput: {
    borderBottomWidth: 1,
    borderColor: colors.borderMedium,
    textAlign: 'center',
    width: 60,
    fontSize: fontSizes.md,
    paddingVertical: 5,
  },
  unitText: {
    fontSize: fontSizes.md,
    width: 50,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xxl,
    marginTop: spacing.xxl,
  },
  buttonText: {
    fontWeight: fontWeights.bold,
    color: colors.textWhite,
    fontSize: fontSizes.md,
    textAlign: 'center',
  },
  sectionHeaderText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
});

export default SleepTrackerScreen;
