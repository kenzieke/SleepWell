import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import SwitchSelector from 'react-native-switch-selector'; // Import the switch selector
import Slider from '@react-native-community/slider';
import { DateComponent } from '../../components/DateComponent';

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

const SleepTrackerScreen: React.FC = () => {
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

  const [isDeployed, setIsDeployed] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isAtHome, setIsAtHome] = useState(false);

  const [sliderValue, setSliderValue] = useState<number>(5);

// Function to convert slider value to a string
const getSleepRating = (value: number): string => {
  const ratings = ['Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'];
  return ratings[Math.floor(value / 1)]; // Since we have 5 steps, each step corresponds to one label
};

  const sliderWidth = Dimensions.get('window').width - (20 * 2); // padding is 20 on each side
  const [labelWidth, setLabelWidth] = useState(0);
  const labelPosition = (sliderValue / 5) * (sliderWidth - labelWidth) + 20; // Adjusted for padding

  // Sleep time related questions
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [timesWokeUp, setTimesWokeUp] = useState<string>('');
  const [naps, setNaps] = useState<string>('0');
  const [sleepMedications, setSleepMedications] = useState<string>('0');
  const [comments, setComments] = useState<string>('');

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
                {/* <Pressable onPress={() => router.push("/screens/SleepAssessment")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#52796F" />
                </Pressable>
                <Text style={styles.title}>Sleep Tracker</Text> */}

                {/* Day of the week goes here */}
            <View style={styles.questionContainer}>
              <DateComponent></DateComponent>
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
                    { label: 'yes', value: 'no' },
                    { label: 'no', value: 'yes' },
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
                    { label: 'yes', value: 'no' },
                    { label: 'no', value: 'yes' },
                    ]}
                    style={styles.switchSelector}
                    buttonStyle={styles.switchButton}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text style={styles.questionText}>At home?</Text>
                <SwitchSelector
                    initial={0}
                    onPress={value => setIsAtHome(value)}
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
              <Text style={styles.questionText}>Rate your last sleep:</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={4}
                step={1}
                value={sliderValue}
                // Start the value as fair, how do I do this?
                onValueChange={value => setSliderValue(value)}
                minimumTrackTintColor="#52796F"
                maximumTrackTintColor="#BDBDBD"
                thumbTintColor="#FFFFFF"
              />
              <View style={[styles.labelContainer, { left: labelPosition }]}>
                <Text style={styles.labelText}>{getSleepRating(sliderValue)}</Text>
              </View>
            </View>
          </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            How long were you in bed/cot/mat in total?
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
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            How long did you actually sleep in total?
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
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            How long did it take you to fall asleep (at first)?
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

        <TouchableOpacity style={styles.button}>
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
    sliderContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    slider: {
      marginTop: 30,
      width: '100%',
      height: 0,
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

export default SleepTrackerScreen;