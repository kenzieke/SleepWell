import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface AudioPlayerProps {
  moduleTitle: string;
  moduleSubtitle: string;
  audioSource: any; // Local audio file
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ moduleTitle, moduleSubtitle, audioSource }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlayAudio = async () => {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(audioSource, { shouldPlay: true });
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 1);
          }
        });
      } else {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const seekAudio = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const skipForward = async () => {
    if (sound) {
      const newPosition = Math.min(position + 10000, duration);
      await sound.setPositionAsync(newPosition);
    }
  };

  const skipBackward = async () => {
    if (sound) {
      const newPosition = Math.max(position - 10000, 0);
      await sound.setPositionAsync(newPosition);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{moduleTitle}</Text>
      <View style={styles.imagePlaceholder} />
      <Text style={styles.subtitle}>{moduleSubtitle}</Text>

      {/* Progress Bar */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seekAudio}
        minimumTrackTintColor="#52796F"
        maximumTrackTintColor="#E5E5E5"
        thumbTintColor="#52796F"
      />

      {/* Playback Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={skipBackward}>
          <Ionicons name="play-back" size={32} color="#52796F" />
        </TouchableOpacity>

        <TouchableOpacity onPress={loadAndPlayAudio}>
          <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={64} color="#52796F" />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipForward}>
          <Ionicons name="play-forward" size={32} color="#52796F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#52796F',
    borderRadius: 15,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default AudioPlayer;
