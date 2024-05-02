import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

interface ProgressCircleProps {
  percentage: number;
  label: string;
}

const strokeWidth = 10;
const radius = 55; // This is the radius of the circle itself
const diameter = radius * 2;

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, label }) => {
  const circumference = 2 * Math.PI * radius;
  const svgProgress = circumference - (percentage / 100) * circumference;
  const textSize = diameter - strokeWidth * 2; // Text should fit inside the stroke
  const textOffset = radius - textSize / 2 + strokeWidth; // Adjust this to center text

  let progressColorBackground = '#FFDCD8' // Red
  let progressColor = '#FD7C6B'; // Red for low percentages
  if (percentage >= 50) {
    progressColor = '#FDEE6B';
    progressColorBackground = '#FFFCE5'
   } // Yellow for mid percentages
  if (percentage >= 75) {
    progressColor = '#83F45C'; // Green for high percentages
    progressColorBackground = '#DBFFCE';
  }

  return (
    <View style={styles.progressContainer}>
      <Svg height={diameter} width={diameter} viewBox={`0 0 ${diameter} ${diameter}`}>
        <Circle
          stroke={progressColorBackground}
          fill="none"
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={progressColor}
          fill="none"
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={svgProgress}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      <View style={[styles.textLabel, { top: textOffset, height: textSize, width: textSize }]}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressPercentage}>{`${percentage}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    position: 'relative',
    width: diameter, // Use diameter directly
    height: diameter, // Use diameter directly
  },
  textLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProgressCircle;
