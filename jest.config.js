module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(expo-constants|expo-font|expo-asset|expo-av|expo-modules-core|expo|@expo|react-native|@react-native|react-navigation|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '\\.(wav|mp3|ogg|mp4)$': '<rootDir>/__mocks__/fileMock.js', // ✅ Mock audio files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
};
