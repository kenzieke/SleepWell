import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ScrollView, View, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import ScalableText from '../components/ScalableText';
import SwitchSelector from 'react-native-switch-selector';
import { DateComponent } from '../components/DateComponent';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../types/navigationTypes';
import { useBannerStore } from '../../stores/BannerStore';
import { computeDailySleepEfficiency } from '../../utils/sleepAssessmentHelpers';
import { useUnsavedChangesStore } from '../../stores/UnsavedChangesStore';
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
    <ScalableText
      style={[
        styles.optionText,
        isSelected && styles.optionTextSelected,
      ]}
      numberOfLines={2}
      adjustsFontSizeToFit
      minimumFontScale={0.5}
    >
      {label}
    </ScalableText>
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
        {question && <ScalableText style={styles.questionText}>{question}</ScalableText>}
        <View style={styles.optionsRow}>
          {options.map((option, index) => (
            <OptionButton
              key={index}
              label={option}
              onPress={() => { setValue(option); markDirty(); }}
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

  const [naps, setNaps] = useState(false);
  const [sleepMedications, setSleepMedications] = useState(false);
  const [comments, setComments] = useState<string>('');
  const [napTimeHours, setNapTimeHours] = useState<string>('0');
  const [napTimeMinutes, setNapTimeMinutes] = useState<string>('0');
  const sleepOptions = ['Very Poor', 'Poor', 'Okay', 'Good', 'Outstanding'];

  // New sleep questions state
  const [bedtimeHour, setBedtimeHour] = useState<string>('');
  const [bedtimeMinute, setBedtimeMinute] = useState<string>('0');
  const [bedtimeAmPm, setBedtimeAmPm] = useState<string>('PM');
  const [fallAsleepDurationHours, setFallAsleepDurationHours] = useState<string>('0');
  const [fallAsleepDurationMinutes, setFallAsleepDurationMinutes] = useState<string>('0');
  const [nightAwakenings, setNightAwakenings] = useState<string>('0');
  const [awakeningsDurationHours, setAwakeningsDurationHours] = useState<string>('0');
  const [awakeningsDurationMinutes, setAwakeningsDurationMinutes] = useState<string>('0');
  const [wakeTimeHour, setWakeTimeHour] = useState<string>('');
  const [wakeTimeMinute, setWakeTimeMinute] = useState<string>('0');
  const [wakeTimeAmPm, setWakeTimeAmPm] = useState<string>('AM');
  const [sleepLocation, setSleepLocation] = useState<string>('');
  const sleepLocationOptions = ['Station', 'On Assignment', 'Off Duty'];

  const clearSleepFields = () => {
    setIsDeployed(false);
    setIsOnDuty(false);
    setIsAtHome(false);
    setNaps(false);
    setSleepMedications(false);
    setComments('');
    setNapTimeHours('0');
    setNapTimeMinutes('0');
    setSleepRating('');
    setBedtimeHour('');
    setBedtimeMinute('0');
    setBedtimeAmPm('PM');
    setFallAsleepDurationHours('0');
    setFallAsleepDurationMinutes('0');
    setNightAwakenings('0');
    setAwakeningsDurationHours('0');
    setAwakeningsDurationMinutes('0');
    setWakeTimeHour('');
    setWakeTimeMinute('0');
    setWakeTimeAmPm('AM');
    setSleepLocation('');
  };

  const clearHealthFields = () => {
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
  const sleepLoadedRef = useRef(false);
  const healthLoadedRef = useRef(false);
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

  // --- Unsaved changes tracking ---
  const { setHasUnsavedChanges, registerCallbacks, clearCallbacks } = useUnsavedChangesStore();

  const markDirty = useCallback(() => {
    if (sleepLoadedRef.current && healthLoadedRef.current) {
      setHasUnsavedChanges(true);
    }
  }, []);

  const discardChanges = useCallback(() => {
    if (originalData?.sleepData) {
      const sd = originalData.sleepData;
      setIsDeployed(sd.isDeployed || false);
      setIsOnDuty(sd.isOnDuty || false);
      setIsAtHome(sd.isAtHome || false);
      setNaps(sd.naps || false);
      setSleepMedications(sd.sleepMedications || false);
      setComments(sd.comments || '');
      setNapTimeHours(sd.napTimeHours || '0');
      setNapTimeMinutes(sd.napTimeMinutes || '0');
      setSleepRating(sd.sleepRating || '');
      setBedtimeHour(sd.bedtimeHour || '');
      setBedtimeMinute(sd.bedtimeMinute || '0');
      setBedtimeAmPm(sd.bedtimeAmPm || 'PM');
      setFallAsleepDurationHours(sd.fallAsleepDurationHours || '0');
      setFallAsleepDurationMinutes(sd.fallAsleepDurationMinutes || '0');
      setNightAwakenings(sd.nightAwakenings || '0');
      setAwakeningsDurationHours(sd.awakeningsDurationHours || '0');
      setAwakeningsDurationMinutes(sd.awakeningsDurationMinutes || '0');
      setWakeTimeHour(sd.wakeTimeHour || '');
      setWakeTimeMinute(sd.wakeTimeMinute || '0');
      setWakeTimeAmPm(sd.wakeTimeAmPm || 'AM');
      setSleepLocation(sd.sleepLocation || '');
    } else {
      setIsDeployed(false);
      setIsOnDuty(false);
      setIsAtHome(false);
      setNaps(false);
      setSleepMedications(false);
      setComments('');
      setNapTimeHours('0');
      setNapTimeMinutes('0');
      setSleepRating('');
      setBedtimeHour('');
      setBedtimeMinute('0');
      setBedtimeAmPm('PM');
      setFallAsleepDurationHours('0');
      setFallAsleepDurationMinutes('0');
      setNightAwakenings('0');
      setAwakeningsDurationHours('0');
      setAwakeningsDurationMinutes('0');
      setWakeTimeHour('');
      setWakeTimeMinute('0');
      setWakeTimeAmPm('AM');
      setSleepLocation('');
    }
    if (originalData?.healthData) {
      const hd = originalData.healthData;
      setCaffeine(hd.caffeine);
      setVegetables(hd.vegetables);
      setSugaryDrinks(hd.sugaryDrinks);
      setFastFood(hd.fastFood);
      setMinPA(hd.minPA);
      setGoals(hd.goals);
      setDailyWeight(hd.weight?.value || '');
      setWeightUnit(hd.weight?.unit || 'kgs');
      setRateDiet(hd.rateDiet || 'null');
      setStressLevel(hd.stressLevel || 'null');
    } else {
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
    }
    setHasUnsavedChanges(false);
  }, [originalData]);

  // Keep refs to latest callbacks to avoid stale closures
  const saveDataRef = useRef<() => Promise<void>>(async () => {});
  const discardChangesRef = useRef<() => void>(() => {});
  useEffect(() => {
    saveDataRef.current = saveData;
    discardChangesRef.current = discardChanges;
  });

  // Register stable callbacks with the store on mount
  useEffect(() => {
    registerCallbacks(
      () => saveDataRef.current(),
      () => discardChangesRef.current()
    );
    return () => clearCallbacks();
  }, []);

  // Reset state when leaving the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (dailyWeight === '') {
        setWeightUnit(originalData?.healthData?.weight?.unit || 'kgs');
      }
      setDate(new Date());
    });
    return unsubscribe;
  }, [navigation, dailyWeight, originalData]);

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    console.log('Before subscription: isLoading=', isLoading);

    const formattedDate = date.toISOString().split('T')[0];
    const healthDataRef = doc(collection(FIRESTORE_DB, 'users', userId, 'healthData'), formattedDate);

    healthLoadedRef.current = false;
    setHasUnsavedChanges(false);
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
        setOriginalData((prev: any) => ({
          ...prev,
          healthData: data,
        }));
        healthLoadedRef.current = true;
        if (sleepLoadedRef.current) {
          setIsLoading(false);
        }
      } else {
        clearHealthFields();
        setOriginalData((prev: any) => ({ ...prev, healthData: null }));
        healthLoadedRef.current = true;
        if (sleepLoadedRef.current) {
          setIsLoading(false);
        }
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

    sleepLoadedRef.current = false;
    setHasUnsavedChanges(false);
    setIsLoading(true);

    const unsubscribe = onSnapshot(sleepDataRef, (docSnap) => {
      console.log(`Snapshot received for date: ${formattedDate}, exists: ${docSnap.exists()}`);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsDeployed(data.isDeployed || false);
        setIsOnDuty(data.isOnDuty || false);
        setIsAtHome(data.isAtHome || false);
        setNaps(data.naps || false);
        setSleepMedications(data.sleepMedications || false);
        setComments(data.comments || '');
        setNapTimeHours(data.napTimeHours || '0');
        setNapTimeMinutes(data.napTimeMinutes || '0');
        setBedtimeHour(data.bedtimeHour || '');
        setBedtimeMinute(data.bedtimeMinute || '0');
        setBedtimeAmPm(data.bedtimeAmPm || 'PM');
        setFallAsleepDurationHours(data.fallAsleepDurationHours || '0');
        setFallAsleepDurationMinutes(data.fallAsleepDurationMinutes || '0');
        setNightAwakenings(data.nightAwakenings || '0');
        setAwakeningsDurationHours(data.awakeningsDurationHours || '0');
        setAwakeningsDurationMinutes(data.awakeningsDurationMinutes || '0');
        setWakeTimeHour(data.wakeTimeHour || '');
        setWakeTimeMinute(data.wakeTimeMinute || '0');
        setWakeTimeAmPm(data.wakeTimeAmPm || 'AM');
        setSleepLocation(data.sleepLocation || '');
        setOriginalData((prev: any) => ({
          ...prev,
          sleepData: data,
        }));
        sleepLoadedRef.current = true;
        if (healthLoadedRef.current) {
          setIsLoading(false);
        }
      } else {
        clearSleepFields();
        setOriginalData((prev: any) => ({ ...prev, sleepData: null }));
        sleepLoadedRef.current = true;
        if (healthLoadedRef.current) {
          setIsLoading(false);
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

    const sleepEfficiency = computeDailySleepEfficiency(
      bedtimeHour, bedtimeMinute, bedtimeAmPm,
      wakeTimeHour, wakeTimeMinute, wakeTimeAmPm,
      fallAsleepDurationHours, fallAsleepDurationMinutes,
      awakeningsDurationHours, awakeningsDurationMinutes,
    );

    const sleepData = {
      date: formattedDate,
      isDeployed,
      isOnDuty,
      isAtHome,
      naps,
      sleepMedications,
      comments,
      napTimeHours: validateAndPrepareData(napTimeHours, 'nap hours'),
      napTimeMinutes: validateAndPrepareData(napTimeMinutes, 'nap minutes'),
      sleepRating,
      bedtimeHour,
      bedtimeMinute,
      bedtimeAmPm,
      fallAsleepDurationHours: validateAndPrepareData(fallAsleepDurationHours, 'fall asleep hours'),
      fallAsleepDurationMinutes: validateAndPrepareData(fallAsleepDurationMinutes, 'fall asleep minutes'),
      nightAwakenings: validateAndPrepareData(nightAwakenings, 'times woke up'),
      awakeningsDurationHours: validateAndPrepareData(awakeningsDurationHours, 'awakenings hours'),
      awakeningsDurationMinutes: validateAndPrepareData(awakeningsDurationMinutes, 'awakenings minutes'),
      wakeTimeHour,
      wakeTimeMinute,
      wakeTimeAmPm,
      sleepLocation,
      ...(sleepEfficiency !== undefined && { sleepEfficiency }),
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
        setHasUnsavedChanges(false);
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
    markDirty();
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
    markDirty();
  };

  const handleHourInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    if (value === '') {
      setter('');
    } else {
      const numValue = parseInt(value, 10);
      if (numValue > 12) {
        setter('12');
      } else if (numValue < 1) {
        setter('1');
      } else {
        setter(value);
      }
    }
    markDirty();
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
              <ScalableText style={styles.questionText}>On Duty?</ScalableText>
              <SwitchSelector
                  key={String(isOnDuty)}
                  initial={String(isOnDuty) === 'no' ? 1 : 0}
                  onPress={value => { setIsOnDuty(value); markDirty(); }}
                  textColor={colors.borderMedium}
                  selectedColor={colors.primary}
                  buttonColor={colors.borderMedium}
                  borderColor={colors.borderMedium}
                  hasPadding
                  fontSize={12}
                  options={[
                  { label: 'no', value: 'yes' },
                  { label: 'yes', value: 'no' },
                  ]}
                  style={styles.switchSelector}
              />
          </View>

          <View style={styles.switchContainer}>
              <ScalableText style={styles.questionText}>Deployed (Out of county)?</ScalableText>
              <SwitchSelector
                  key={String(isDeployed)}
                  initial={String(isDeployed) === 'no' ? 1 : 0}
                  onPress={value => { setIsDeployed(value); markDirty(); }}
                  textColor={colors.borderMedium}
                  selectedColor={colors.primary}
                  buttonColor={colors.borderMedium}
                  borderColor={colors.borderMedium}
                  hasPadding
                  fontSize={12}
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

      {/* a. What time did you try to go to sleep? */}
      <View style={styles.questionContainer}>
        <ScalableText style={styles.questionText}>
          What time did you try to go to sleep?
        </ScalableText>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleHourInputChange(setBedtimeHour)}
            value={bedtimeHour}
            keyboardType="numeric"
            placeholder="Hr"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>:</ScalableText>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleMinuteInputChange(setBedtimeMinute)}
            value={displayEmptyOrValue(bedtimeMinute)}
            keyboardType="numeric"
            placeholder="Min"
            maxLength={2}
          />
          <SwitchSelector
            key={`bedtime-${bedtimeAmPm}`}
            initial={bedtimeAmPm === 'AM' ? 0 : 1}
            onPress={(value) => { setBedtimeAmPm(value); markDirty(); }}
            textColor={colors.borderMedium}
            selectedColor={colors.primary}
            buttonColor={colors.borderMedium}
            borderColor={colors.borderMedium}
            hasPadding
            fontSize={12}
            options={[
              { label: 'AM', value: 'AM' },
              { label: 'PM', value: 'PM' },
            ]}
            style={styles.switchSelector}
          />
        </View>
      </View>

      {/* b. How long did it take you to fall asleep? */}
      <View style={styles.questionContainer}>
        <ScalableText style={styles.questionText}>
          How long did it take you to fall asleep?
        </ScalableText>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleInputChange(setFallAsleepDurationHours)}
            value={displayEmptyOrValue(fallAsleepDurationHours)}
            keyboardType="numeric"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>hours</ScalableText>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleMinuteInputChange(setFallAsleepDurationMinutes)}
            value={displayEmptyOrValue(fallAsleepDurationMinutes)}
            keyboardType="numeric"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>min</ScalableText>
        </View>
      </View>

      {/* c. How many times did you wake up? */}
      <View style={styles.questionContainer}>
        <ScalableText style={styles.questionText}>
          How many times did you wake up, not counting your final awakening?
        </ScalableText>
        <TextInput
          style={styles.healthInput}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
          onChangeText={handleInputChange(setNightAwakenings)}
          value={displayEmptyOrValue(nightAwakenings)}
          keyboardType="numeric"
          placeholder="# of times"
          maxLength={2}
        />
      </View>

      {/* d. In total, how long did these awakenings last? */}
      <View style={styles.questionContainer}>
        <ScalableText style={styles.questionText}>
          In total, how long did these awakenings last?
        </ScalableText>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleInputChange(setAwakeningsDurationHours)}
            value={displayEmptyOrValue(awakeningsDurationHours)}
            keyboardType="numeric"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>hours</ScalableText>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleMinuteInputChange(setAwakeningsDurationMinutes)}
            value={displayEmptyOrValue(awakeningsDurationMinutes)}
            keyboardType="numeric"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>min</ScalableText>
        </View>
      </View>

      {/* e. What time did you wake up? */}
      <View style={styles.questionContainer}>
        <ScalableText style={styles.questionText}>
          What time did you wake up?
        </ScalableText>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleHourInputChange(setWakeTimeHour)}
            value={wakeTimeHour}
            keyboardType="numeric"
            placeholder="Hr"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>:</ScalableText>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleMinuteInputChange(setWakeTimeMinute)}
            value={displayEmptyOrValue(wakeTimeMinute)}
            keyboardType="numeric"
            placeholder="Min"
            maxLength={2}
          />
          <SwitchSelector
            key={`wake-${wakeTimeAmPm}`}
            initial={wakeTimeAmPm === 'AM' ? 0 : 1}
            onPress={(value) => { setWakeTimeAmPm(value); markDirty(); }}
            textColor={colors.borderMedium}
            selectedColor={colors.primary}
            buttonColor={colors.borderMedium}
            borderColor={colors.borderMedium}
            hasPadding
            fontSize={12}
            options={[
              { label: 'AM', value: 'AM' },
              { label: 'PM', value: 'PM' },
            ]}
            style={styles.switchSelector}
          />
        </View>
      </View>

      {/* f. Where did this sleep occur? */}
      <View style={styles.questionContainer}>
        {renderOptions({
          question: 'Where did this sleep occur?',
          value: sleepLocation,
          setValue: setSleepLocation,
          options: sleepLocationOptions,
        })}
      </View>

      <View style={styles.switchContainer}>
        <ScalableText style={styles.questionText}>Take any sleep medications?</ScalableText>
        <SwitchSelector
            key={String(sleepMedications)}
            initial={String(sleepMedications) === 'no' ? 1 : 0}
            onPress={value => { setSleepMedications(value); markDirty(); }}
            textColor={colors.borderMedium}
            selectedColor={colors.primary}
            buttonColor={colors.borderMedium}
            borderColor={colors.borderMedium}
            hasPadding
            fontSize={12}
            options={[
            { label: 'no', value: 'yes' },
            { label: 'yes', value: 'no' },
            ]}
            style={styles.switchSelector}
          />
      </View>

      <View style={styles.switchContainer}>
        <ScalableText style={styles.questionText}>Any naps during the day before?</ScalableText>
        <SwitchSelector
            key={String(naps)}
            initial={String(naps) === 'no' ? 1 : 0}
            onPress={value => { setNaps(value); markDirty(); }}
            textColor={colors.borderMedium}
            selectedColor={colors.primary}
            buttonColor={colors.borderMedium}
            borderColor={colors.borderMedium}
            hasPadding
            fontSize={12}
            options={[
            { label: 'no', value: 'yes' },
            { label: 'yes', value: 'no' },
            ]}
            style={styles.switchSelector}
          />
      </View>

      <View style={styles.questionContainer}>
        <ScalableText style={styles.questionText}>
          How much time did you nap in total?
        </ScalableText>
        <View style={styles.timeContainer}>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleInputChange(setNapTimeHours)}
            value={displayEmptyOrValue(napTimeHours)}
            keyboardType="numeric"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>hours</ScalableText>
          <TextInput
            style={styles.timeInput}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.5}
            onChangeText={handleMinuteInputChange(setNapTimeMinutes)}
            value={displayEmptyOrValue(napTimeMinutes)}
            keyboardType="numeric"
            maxLength={2}
          />
          <ScalableText style={styles.unitText} numberOfLines={1}>min</ScalableText>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <ScalableText style={styles.questionText}>
          Comments:
        </ScalableText>
        <TextInput
          style={styles.healthInput}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
          onChangeText={(v) => { setComments(v); markDirty(); }}
          value={comments}
          placeholder="Comments"
        />
      </View>

      <View style={styles.questionContainer}>
        <ScalableText style={styles.sectionHeaderText}>This next section is to be completed at the end of your day:</ScalableText>
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
          <ScalableText style={styles.questionText}>Weight:</ScalableText>
          <View style={styles.inputRow}>
            <TextInput
                style={styles.healthInput}
                allowFontScaling={true}
                maxFontSizeMultiplier={1.5}
                onChangeText={(v) => { setDailyWeight(v); markDirty(); }}
                value={dailyWeight}
                keyboardType="numeric"
                placeholder="Enter here"
                maxLength={3}
            />
            <SwitchSelector
              key={weightUnit}
              initial={weightUnit === 'lbs' ? 0 : 1}
              onPress={(value) => { setWeightUnit(value); markDirty(); }}
              textColor={colors.borderMedium}
              selectedColor={colors.primary}
              buttonColor={colors.borderMedium}
              borderColor={colors.borderMedium}
              hasPadding
              fontSize={12}
              options={[
                { label: 'kgs', value: 'kgs' },
                { label: 'lbs', value: 'lbs' },
              ]}
              style={styles.switchSelector}
            />
          </View>
      </View>

      <View style={styles.questionContainer}>
          <ScalableText style={styles.questionText}>
              Drinks with caffeine today:
          </ScalableText>
          <TextInput
              style={styles.healthInput}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.5}
              onChangeText={(v) => { setCaffeine(v); markDirty(); }}
              value={caffeine}
              keyboardType="numeric"
              placeholder="# of drinks"
              maxLength={2}
          />
      </View>

      <View style={styles.questionContainer}>
          <ScalableText style={styles.questionText}>
              Vegetable servings today:
          </ScalableText>
          <TextInput
              style={styles.healthInput}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.5}
              onChangeText={(v) => { setVegetables(v); markDirty(); }}
              value={vegetables}
              keyboardType="numeric"
              placeholder="# of vegetable servings"
              maxLength={2}
          />
      </View>

      <View style={styles.questionContainer}>
          <ScalableText style={styles.questionText}>
              Sugary drinks today:
          </ScalableText>
          <TextInput
              style={styles.healthInput}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.5}
              onChangeText={(v) => { setSugaryDrinks(v); markDirty(); }}
              value={sugaryDrinks}
              keyboardType="numeric"
              placeholder="# of sugary drinks"
              maxLength={2}
          />
      </View>

      <View style={styles.questionContainer}>
          <ScalableText style={styles.questionText}>
              Fast food today:
          </ScalableText>
          <TextInput
              style={styles.healthInput}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.5}
              onChangeText={(v) => { setFastFood(v); markDirty(); }}
              value={fastFood}
              keyboardType="numeric"
              placeholder="# of fast food items"
              maxLength={2}
          />
      </View>

      <View style={styles.questionContainer}>
          <ScalableText style={styles.questionText}>
              Minutes of physical activity today:
          </ScalableText>
          <TextInput
              style={styles.healthInput}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.5}
              onChangeText={(v) => { setMinPA(v); markDirty(); }}
              value={minPA}
              keyboardType="numeric"
              placeholder="Minutes of physical activity"
              maxLength={3}
          />
      </View>

      <View style={styles.questionContainer}>
          <ScalableText style={styles.questionText}>
              Other goals for today:
          </ScalableText>
          <TextInput
              style={styles.healthInput}
              allowFontScaling={true}
              maxFontSizeMultiplier={1.5}
              onChangeText={(v) => { setGoals(v); markDirty(); }}
              value={goals}
              placeholder="Enter your goals here"
          />
      </View>

        <TouchableOpacity style={styles.button} onPress={saveData}>
          <ScalableText style={styles.buttonText}>Save</ScalableText>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
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
    width: 120,
    height: 40,
    borderRadius: 20,
    marginLeft: 'auto',
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
    minHeight: 40,
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
