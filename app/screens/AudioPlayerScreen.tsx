/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';
import AudioPlayer from '../../components/AudioPlayer';
import { useLessonTrackingStore } from '../../stores/LessonTrackingStore';

const audioFiles: Record<string, number> = {
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
Object.keys(audioFiles).forEach((key) => {
  console.log(`Audio file for ${key}:`, audioFiles[key]);
});

// ✅ Correct typing for route props
type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, 'AudioPlayerScreen'>;

const AudioPlayerScreen: React.FC = () => {
  // ✅ Correct navigation typing for the current screen
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'AudioPlayerScreen'>>();
  const route = useRoute<AudioPlayerScreenRouteProp>();
  const { moduleTitle, moduleSubtitle } = route.params;

  const { lessons, updateLessonProgress } = useLessonTrackingStore();

  const handleMarkLessonComplete = () => {
    const currentLesson = lessons.find((lesson) => lesson.title.includes(moduleSubtitle));

    if (currentLesson) {
      updateLessonProgress(currentLesson.id, true); // ✅ Update store and Firestore
      navigation.goBack(); // ✅ Navigate back after completion
    } else {
      console.error('Lesson not found for the provided subtitle.');
    }
  };

  return (
    <View style={styles.container}>
      <AudioPlayer
        moduleTitle={moduleTitle}
        moduleSubtitle={moduleSubtitle}
        audioSource={audioFiles[moduleSubtitle]}
      />

      {/* ✅ Button wrapper for centering */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={handleMarkLessonComplete} style={styles.doneBtn}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  doneBtn: {
    width: '80%',
    backgroundColor: '#52796F',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
});

export default AudioPlayerScreen;
