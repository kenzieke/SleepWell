/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigationTypes';
import AudioPlayer from '../../components/AudioPlayer';

console.log('AudioPlayerScreen loaded');

// Import audio files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const audioFiles: Record<string, any> = {
    'Sleep Efficiency': require('../../assets/audio/module1.mp3'),
    'Sleep Schedule & Restriction': require('../../assets/audio/module2.wav'),
    'Sleep Tracking for Health': require('../../assets/audio/module3.wav'),
    'Naps': require('../../assets/audio/module4.wav'),
    'Light, Sound, & Sleep Quality': require('../../assets/audio/module5.wav'),
    'Bedtime Routines': require('../../assets/audio/module6.wav'),
    'Healthy Eating & Sleep': require('../../assets/audio/module7.wav'),
    'Healthy Drinks & Sleep': require('../../assets/audio/module8.wav'),
    'Healthy Body Weight': require('../../assets/audio/module9.wav'),
    'Building Physical Activity': require('../../assets/audio/module10.wav'),
    'Stress Management Techniques': require('../../assets/audio/module11.wav'),
    'Cognitive Strategies': require('../../assets/audio/module12.wav'),
};  

// Log the audio files to verify paths
Object.keys(audioFiles).forEach(key => {
  console.log(`Audio file for ${key}:`, audioFiles[key]);
});

type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, 'AudioPlayerScreen'>;

const AudioPlayerScreen: React.FC = () => {
  const route = useRoute<AudioPlayerScreenRouteProp>();
  const { moduleTitle, moduleSubtitle } = route.params;

  return (
    <View style={styles.container}>
      <AudioPlayer 
        moduleTitle={moduleTitle} 
        moduleSubtitle={moduleSubtitle} 
        audioSource={audioFiles[moduleSubtitle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AudioPlayerScreen;
