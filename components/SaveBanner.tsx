import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface SaveBannerProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

const SaveBanner: React.FC<SaveBannerProps> = ({ visible, message, onHide }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Slide down
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        // Slide up
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, translateY, onHide]);

  if (!visible) return null;

  // Only show confetti emoji for success messages (not for "No changes" message)
  const showConfetti = message.toLowerCase().includes('saved');

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <Animated.View style={styles.banner}>
        <Text style={styles.bannerText}>
          {showConfetti && '🎉 '}
          {message}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 50, // Account for status bar
    zIndex: 1000,
  },
  banner: {
    backgroundColor: '#A8F0DE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bannerText: {
    color: '#334A44',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SaveBanner;
