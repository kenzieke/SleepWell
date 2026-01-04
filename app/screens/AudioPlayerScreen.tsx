/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';
import AudioPlayer from '../components/AudioPlayer';
import { useLessonTrackingStore } from '../../stores/LessonTrackingStore';
import { findLessonBySubtitle } from '../../utils/lessonHelpers';
import { colors, fontSizes, fontWeights, spacing, borderRadius, buttonHeight } from '../styles';

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

const normalizeKey = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizedAudioFiles: Record<string, number> = Object.fromEntries(
  Object.entries(audioFiles).map(([k, v]) => [normalizeKey(k), v])
);

const audioByNumber: Record<number, number> = {
  1: require('../../assets/audio/module1.mp3'),
  2: require('../../assets/audio/module2.wav'),
  3: require('../../assets/audio/module3.wav'),
  4: require('../../assets/audio/module4.wav'),
  5: require('../../assets/audio/module5.wav'),
  6: require('../../assets/audio/module6.wav'),
  7: require('../../assets/audio/module7.wav'),
  8: require('../../assets/audio/module8.wav'),
  9: require('../../assets/audio/module9.wav'),
  10: require('../../assets/audio/module10.wav'),
  11: require('../../assets/audio/module11.wav'),
  12: require('../../assets/audio/module12.wav'),
};

const getModuleNumber = (a?: string, b?: string): number | null => {
  const s = `${a ?? ''} ${b ?? ''}`;
  const m = s.match(/module\s*(\d{1,2})/i);
  const n = m ? parseInt(m[1], 10) : NaN;
  return Number.isFinite(n) && audioByNumber[n] ? n : null;
};

type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, 'AudioPlayerScreen'>;

const AudioPlayerScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'AudioPlayerScreen'>>();
  const route = useRoute<AudioPlayerScreenRouteProp>();
  const { moduleTitle, moduleSubtitle } = route.params;
  const { lessons, updateLessonProgress } = useLessonTrackingStore();

  const handleMarkLessonComplete = () => {
    const currentLesson = findLessonBySubtitle(lessons, moduleSubtitle);
    if (currentLesson) {
      updateLessonProgress(currentLesson.id, true);
      navigation.goBack();
    } else {
      console.error('Lesson not found for the provided subtitle.');
    }
  };

  const num = getModuleNumber(moduleTitle, moduleSubtitle);

  const resolvedAudioSource =
    audioFiles[moduleSubtitle] ??
    audioFiles[moduleTitle] ??
    normalizedAudioFiles[normalizeKey(moduleSubtitle)] ??
    normalizedAudioFiles[normalizeKey(moduleTitle)] ??
    (num ? audioByNumber[num] : undefined);

  return (
    <View style={styles.container}>
      <AudioPlayer
        key={String(resolvedAudioSource)}
        moduleTitle={moduleTitle}
        moduleSubtitle={moduleSubtitle}
        audioSource={resolvedAudioSource as number}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={handleMarkLessonComplete} style={styles.doneBtn}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontWeight: fontWeights.bold,
    color: colors.textWhite,
    fontSize: fontSizes.md,
  },
  doneBtn: {
    width: '80%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xxl,
    height: buttonHeight.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
  },
});

export default AudioPlayerScreen;
