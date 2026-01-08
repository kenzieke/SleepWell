import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import FullWidthPicture from "../components/FullWidthPicture";
import { ScrollView } from 'react-native-gesture-handler';
import { useLessonStore } from '../../stores/LessonStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';
import { markLessonComplete } from '../../utils/lessonHelpers';
import { colors, fontSizes, fontWeights, spacing, borderRadius, buttonHeight } from '../styles';

// Define the props for the LessonDetailScreen
type LessonDetailProps = NativeStackScreenProps<RootStackParamList, 'LessonDetailScreen'>;

const LessonDetailScreen: React.FC<LessonDetailProps> = ({ route, navigation }) => {
  const { lesson } = route.params;
  const { setLesson, userId, setUserId } = useLessonStore();

  useEffect(() => {
    setLesson(lesson); // Set the lesson data in the store
    setUserId(); // Ensure setUserId fetches and sets the user ID properly
  }, [lesson, setLesson, setUserId]);

  const handleMarkLessonComplete = () => {
    if (userId) {
      markLessonComplete(userId, lesson.id.toString(), lesson.title, navigation);
    } else {
      console.error('User ID is undefined');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollViewStyle}
        minimumZoomScale={1}
        maximumZoomScale={5}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <FullWidthPicture uri={Image.resolveAssetSource(lesson.image).uri} />
      </ScrollView>

      <TouchableOpacity onPress={handleMarkLessonComplete} style={styles.doneBtn}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewStyle: {
    flex: 1,
    width: '100%',
    paddingTop: spacing.xxxl,
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

export default LessonDetailScreen;
