import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigationTypes';
import AudioPlayer from '../../components/AudioPlayer';

// Import audio files
const audioFiles: Record<string, any> = {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Sleep Efficiency': require('../../assets/audio/module1.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Sleep Schedule and Restriction': require('../../assets/audio/module2.wav'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'Keeping Track': require('../../assets/audio/module3.wav'),
  // Add more files
};

type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, 'AudioPlayerScreen'>;

const AudioPlayerScreen: React.FC = () => {
  const route = useRoute<AudioPlayerScreenRouteProp>();
  const { moduleTitle, moduleSubtitle } = route.params;

  return (
    <View style={styles.container}>
      <AudioPlayer 
        moduleTitle={moduleTitle} 
        moduleSubtitle={moduleSubtitle} 
        audioSource={audioFiles[moduleSubtitle] || null}
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
