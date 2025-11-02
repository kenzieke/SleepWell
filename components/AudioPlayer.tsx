import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Asset } from 'expo-asset';

interface AudioPlayerProps {
  moduleTitle: string;
  moduleSubtitle: string;
  audioSource: number | string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ moduleTitle, moduleSubtitle, audioSource }) => {
  const [uri, setUri] = useState<string | null>(null);

  // Configure playback mode
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'duckOthers',
    }).catch((e) => console.warn('Audio mode config failed', e));
  }, []);

  // Resolve require() → URI
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

  // Create player with given URI
  const player = useAudioPlayer(uri, { updateInterval: 500, downloadFirst: true });
  const status = useAudioPlayerStatus(player);

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
        minimumTrackTintColor="#52796F"
        maximumTrackTintColor="#E5E5E5"
        thumbTintColor="#52796F"
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={skipBackward} disabled={!uri}>
          <Ionicons name="play-back" size={32} color={uri ? '#52796F' : '#B0B0B0'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} disabled={!uri}>
          <Ionicons
            name={status?.playing ? 'pause-circle' : 'play-circle'}
            size={64}
            color={uri ? '#52796F' : '#B0B0B0'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipForward} disabled={!uri}>
          <Ionicons name="play-forward" size={32} color={uri ? '#52796F' : '#B0B0B0'} />
        </TouchableOpacity>
      </View>

      {!uri && <Text style={styles.noSource}>No audio source provided.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#52796F',
    borderRadius: 15,
    marginBottom: 10,
  },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  slider: { width: '80%', marginBottom: 20 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '60%' },
  noSource: { marginTop: 8, color: '#888' },
});

export default AudioPlayer;
