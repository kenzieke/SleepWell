/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// Mock Expo environment variables
process.env.EXPO_OS = 'ios';

jest.mock('@expo/vector-icons', () => ({
    Ionicons: jest.fn(() => null), // Mock Ionicons to return an empty component
  }));
