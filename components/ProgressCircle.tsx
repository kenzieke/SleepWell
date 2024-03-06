import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

interface ProgressCircleProps {
  percentage: number;
  label: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, label }) => {
  const strokeWidth = 10;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const svgProgress = circumference - (percentage / 100) * circumference;

  let progressColor = '#FF0000'; // Red for example
  if (percentage > 50) progressColor = '#FFFF00'; // Yellow
  if (percentage > 75) progressColor = '#00FF00'; // Green

  return (
    <View style={styles.progressContainer}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Circle
          stroke="#ddd" // Background circle color
          fill="none"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={progressColor}
          fill="none"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={svgProgress}
          strokeLinecap="round"
          transform={`rotate(-90 50 50)`}
        />
      </Svg>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressPercentage}>{`${percentage}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'center',
    margin: 8,
  },
  progressLabel: {
    position: 'absolute',
    textAlign: 'center',
    width: 100,
    top: 35,
    fontSize: 14,
  },
  progressPercentage: {
    position: 'absolute',
    textAlign: 'center',
    width: 100,
    top: 50,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProgressCircle;
