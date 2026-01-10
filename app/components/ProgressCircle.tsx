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
  const svgProgress = 0; // Always set the circle to be fully filled

  // Define colors based on the percentage
  let progressColorBackground = '#FFDCD8'; // Light red
  let progressColor = '#FD7C6B'; // Darker red for low percentages

  if (percentage >= 50) {
    progressColorBackground = '#FFFCE5'; // Light yellow
    progressColor = '#FDEE6B'; // Yellow for mid percentages
  }
  if (percentage >= 75) {
    progressColorBackground = '#DBFFCE'; // Light green
    progressColor = '#83F45C'; // Green for high percentages
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
          strokeDashoffset={svgProgress} // Always fully filled
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      <View style={[styles.textLabel, { height: diameter, width: diameter }]}>
        <Text style={styles.progressLabel}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    position: 'relative',
    width: diameter,
    height: diameter,
  },
  textLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,  // Allow text wrapping within the circle
    flexWrap: 'wrap',       // Wrap text to fit into the circle
  },
});

export default ProgressCircle;
