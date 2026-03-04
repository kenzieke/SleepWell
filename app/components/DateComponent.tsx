import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ScalableText from './ScalableText';

interface DateComponentProps {
  date: Date;
  setDate: (date: Date) => void;
}

export const DateComponent: React.FC<DateComponentProps> = ({ date, setDate }) => {
  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date; // selectedDate can be null if the picker is dismissed
    setShow(false);
    if (currentDate) {
      setDate(currentDate); // Update the date only if it's not null
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={showDatepicker}
          style={styles.button}
        >
          <ScalableText style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit>
            Select Date
          </ScalableText>
        </TouchableOpacity>
        <ScalableText style={styles.selectedDateText} numberOfLines={1} adjustsFontSizeToFit>
          {date ? date.toLocaleDateString() : 'No date selected'}
        </ScalableText>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          display="default"
          onChange={onChange}
          accentColor="#52796F" // This is for Android, change accordingly if you are on a different platform
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    flexShrink: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#52796F',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#000',
    padding: 10,
    flex: 1,
    minWidth: 100,
  },
});
