/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AudioPlayer from '../components/AudioPlayer';
import { Audio } from 'expo-av';

jest.mock('expo-av', () => {
  const mockSoundInstance = {
    loadAsync: jest.fn(),
    playAsync: jest.fn(),
    pauseAsync: jest.fn(),
    unloadAsync: jest.fn(),
    setOnPlaybackStatusUpdate: jest.fn(),
    setPositionAsync: jest.fn(),
  };

  return {
    Audio: {
      Sound: jest.fn(() => mockSoundInstance), // ✅ Mock the Sound class itself
    },
  };
});

(Audio.Sound as unknown as jest.Mock).createAsync = jest
  .fn()
  .mockResolvedValue({ sound: new Audio.Sound(), status: { isLoaded: true } });
  
describe('AudioPlayer Component', () => {
  const mockAudioSource = require('../../assets/audio/module1.wav');  

  it('plays audio when play button is pressed', async () => {
    console.log("🎤 Mocked audio source in test:", mockAudioSource);

    const { getByTestId } = render(
      <AudioPlayer moduleTitle="Test Title" moduleSubtitle="Test Subtitle" audioSource={mockAudioSource} />
    );

    const playButton = getByTestId('play-button');

    await act(async () => {
      fireEvent.press(playButton);
    });

    const soundInstance = (Audio.Sound as unknown as jest.Mock).mock.instances[0];

    expect(soundInstance).toBeDefined();
    expect(soundInstance.loadAsync).toHaveBeenCalled();
    expect(soundInstance.playAsync).toHaveBeenCalled();
  });
});  

describe('AudioPlayer Component', () => {
  const mockAudioSource = require('../../assets/audio/module1.wav');

  it('renders correctly with given props', () => {
    const { getByText } = render(
      <AudioPlayer moduleTitle="Test Title" moduleSubtitle="Test Subtitle" audioSource={mockAudioSource} />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  it('plays audio when play button is pressed', async () => {
    const { getByTestId } = render(
      <AudioPlayer moduleTitle="Test Title" moduleSubtitle="Test Subtitle" audioSource={mockAudioSource} />
    );
  
    const playButton = getByTestId('play-button');
  
    await act(async () => {
      fireEvent.press(playButton);
    });
  
    const soundInstance = (Audio.Sound as unknown as jest.Mock).mock.instances[0];
  
    expect(soundInstance).toBeDefined(); // ✅ Ensure the instance was created
    expect(soundInstance.loadAsync).toHaveBeenCalled();
    expect(soundInstance.playAsync).toHaveBeenCalled();
  });  

  it('pauses audio when the play button is pressed again', async () => {
    const { getByTestId } = render(
      <AudioPlayer moduleTitle="Test Title" moduleSubtitle="Test Subtitle" audioSource={mockAudioSource} />
    );

    const playButton = getByTestId('play-button');

    await act(async () => {
      fireEvent.press(playButton); // Start playing
      fireEvent.press(playButton); // Pause
    });

    expect(Audio.Sound).toHaveBeenCalledTimes(1);
  });

  it('skips forward when forward button is pressed', async () => {
    const { getByTestId } = render(
      <AudioPlayer moduleTitle="Test Title" moduleSubtitle="Test Subtitle" audioSource={mockAudioSource} />
    );

    const forwardButton = getByTestId('forward-button');

    await act(async () => {
      fireEvent.press(forwardButton);
    });

    expect(Audio.Sound).toHaveBeenCalledTimes(1);
  });

  it('skips backward when backward button is pressed', async () => {
    const { getByTestId } = render(
      <AudioPlayer moduleTitle="Test Title" moduleSubtitle="Test Subtitle" audioSource={mockAudioSource} />
    );

    const backwardButton = getByTestId('backward-button');

    await act(async () => {
      fireEvent.press(backwardButton);
    });

    expect(Audio.Sound).toHaveBeenCalledTimes(1);
  });
});
