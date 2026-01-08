import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Asset } from 'expo-asset';
import { useLessonTrackingStore } from '../../stores/LessonTrackingStore';
import { findLessonBySubtitle } from '../../utils/lessonHelpers';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

interface AudioPlayerProps {
  moduleTitle: string;
  moduleSubtitle: string;
  audioSource: number | string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ moduleTitle, moduleSubtitle, audioSource }) => {
  const [uri, setUri] = useState<string | null>(null);
  const { lessons, updateLessonProgress } = useLessonTrackingStore();

  /** Configure playback mode (runs once on mount) */
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'duckOthers',
    }).catch((e) => console.warn('Audio mode config failed', e));
  }, []);

  /** Convert require() → local URI */
  useEffect(() => {
    (async () => {
      if (typeof audioSource === 'number') {
        const asset = Asset.fromModule(audioSource);
        await asset.downloadAsync();
        setUri(asset.localUri ?? asset.uri);
      } else if (typeof audioSource === 'string') {
        setUri(audioSource);
      } else {
        setUri(null);
      }
    })();
  }, [audioSource]);

  /** Create the player hook for this URI */
  const player = useAudioPlayer(uri, { updateInterval: 500, downloadFirst: true });
  const status = useAudioPlayerStatus(player);

  /** Automatically mark lesson complete once audio finishes */
  useEffect(() => {
    if (status?.didJustFinish) {
      const currentLesson = findLessonBySubtitle(lessons, moduleSubtitle);
      if (currentLesson && !currentLesson.completed) {
        updateLessonProgress(currentLesson.id, true);
      }
    }
  }, [status?.didJustFinish, lessons, moduleSubtitle, updateLessonProgress]);

  /** Playback controls */
  const togglePlayPause = () => {
    if (!status) return;
    if (status.playing) {
      player.pause();
    } else {
      if (status.didJustFinish) player.seekTo(0);
      player.play();
    }
  };

  const skipForward = () => {
    if (!status?.duration) return;
    const newTime = Math.min(status.currentTime + 10, status.duration);
    player.seekTo(newTime);
  };

  const skipBackward = () => {
    if (!status) return;
    const newTime = Math.max(status.currentTime - 10, 0);
    player.seekTo(newTime);
  };

  const onSeekComplete = (value: number) => player.seekTo(value);

  const iconColor = uri ? colors.primary : colors.textMuted;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{moduleTitle}</Text>
      <View style={styles.imagePlaceholder} />
      <Text style={styles.subtitle}>{moduleSubtitle}</Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={status?.duration ?? 1}
        value={status?.currentTime ?? 0}
        onSlidingComplete={onSeekComplete}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.backgroundTertiary}
        thumbTintColor={colors.primary}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={skipBackward} disabled={!uri}>
          <Ionicons name="play-back" size={32} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} disabled={!uri}>
          <Ionicons
            name={status?.playing ? 'pause-circle' : 'play-circle'}
            size={64}
            color={iconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipForward} disabled={!uri}>
          <Ionicons name="play-forward" size={32} color={iconColor} />
        </TouchableOpacity>
      </View>

      {!uri && <Text style={styles.noSource}>No audio source provided.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.md,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.xl,
  },
  slider: {
    width: '80%',
    marginBottom: spacing.xl,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  noSource: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
});

export default AudioPlayer;
