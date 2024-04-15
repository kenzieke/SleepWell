import React from 'react';
import { View, StyleSheet } from 'react-native';

const MarkerComponent = ({ score, totalScore, scaleWidth }) => {
    // Calculate the left offset for the marker
    const leftOffset = (score / totalScore) * scaleWidth;
  
    // Styles for the marker
    const markerStyles = StyleSheet.create({
      marker: {
        position: 'absolute',
        left: leftOffset,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black', // or any color you want for the marker
      },
    });
  
    return (
      <View style={markerStyles.marker} />
    );
  };

  export default MarkerComponent;