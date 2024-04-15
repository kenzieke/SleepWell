import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';

const WeeklyLessonsScreen: React.FC = () => {
  // Example data, replace with your actual state or props
  const progressData = [
    { label: 'Sleep Duration', value: 72.4 },
    { label: 'Sleep Quality', value: 50.0 },
    // Add other data points
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Improve My Sleep</Text>
      <Text style={styles.subheader}>Daily Progress</Text>
      <View style={styles.progressContainer}>
        {progressData.map((item, index) => (
          <ProgressCircle
            key={index}
            percentage={item.value}
            label={item.label}
          />
        ))}
      </View>
      {/* Other UI elements */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  subheader: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  // ... other styles
});

export default WeeklyLessonsScreen;