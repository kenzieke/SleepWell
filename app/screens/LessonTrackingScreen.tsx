import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLessonTrackingStore } from '../../stores/LessonTrackingStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';
import type { Lesson } from '../../stores/LessonTrackingStore';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

type LessonTrackingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LessonTrackingScreen'
>;

const LessonTrackingScreen: React.FC = () => {
  const navigation = useNavigation<LessonTrackingScreenNavigationProp>();
  const {
    lessons,
    userProgress,
    allLessonsCompleted,
    currentWeek,
    fetchUserProgress,
    updateLessonProgress,
  } = useLessonTrackingStore();

  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [lockedModalVisible, setLockedModalVisible] = useState(false);
  const [lockedMessage, setLockedMessage] = useState('');

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  const handleToggleExpand = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleUncheckLesson = async (lessonId: number) => {
    const completed = userProgress[lessonId];
    await updateLessonProgress(lessonId, !completed);
  };

  const handleLockedAccess = (requiredWeek: number) => {
    setLockedMessage(`Wait until Week ${requiredWeek} to unlock this module.`);
    setLockedModalVisible(true);
  };

  const handleNavigate = (lesson: Lesson, target: 'summary' | 'audio') => {
    if (!currentWeek) return;
    if (lesson.id > currentWeek) {
      handleLockedAccess(lesson.id);
      return;
    }

    if (target === 'summary') {
      navigation.navigate('LessonDetailScreen', { lesson });
    } else if (target === 'audio') {
      navigation.navigate('AudioPlayerScreen', {
        moduleTitle: `Module ${lesson.id}`,
        moduleSubtitle: lesson.title.replace(/^Module #\d+: /, ''),
      });
    }
  };


  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        {allLessonsCompleted && (
          <Text style={styles.completedText}>All modules completed!</Text>
        )}

        {lessons.map((lesson) => (
          <View key={lesson.id} style={styles.lessonItem}>
            {/* Collapsible Header */}
            <TouchableOpacity
              style={styles.lessonHeader}
              onPress={() => handleToggleExpand(lesson.id)}
            >
              <Text
                style={[
                  styles.lessonTitle,
                  lesson.id > (currentWeek ?? 0) && styles.lockedLesson,
                ]}
              >
                {lesson.title}
              </Text>

              <View style={styles.iconWrapper}>
                {userProgress[lesson.id] ? (
                  <TouchableOpacity onPress={() => handleUncheckLesson(lesson.id)}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color={colors.primary} />
                )}
                <Ionicons
                  name={
                    expandedLesson === lesson.id ? 'chevron-up' : 'chevron-down'
                  }
                  size={22}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>

            {/* Expanded Content */}
            {expandedLesson === lesson.id && (
              <View style={styles.lessonOptions}>
                <TouchableOpacity
                  onPress={() => handleNavigate(lesson, 'summary')}
                  style={styles.optionItem}
                >
                  <Ionicons name="book-outline" size={20} color={colors.primary} />
                  <Text style={styles.optionText}>Read Summary (1/2 page)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleNavigate(lesson, 'audio')}
                  style={styles.optionItem}
                >
                  <Ionicons name="headset-outline" size={20} color={colors.primary} />
                  <Text style={styles.optionText}>Listen to Podcast (3 min)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Locked Module Modal */}
      <Modal
        visible={lockedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLockedModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="lock-closed-outline" size={40} color={colors.primary} />
            <Text style={styles.modalText}>{lockedMessage}</Text>
            <Pressable
              onPress={() => setLockedModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lessonItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
  },
  lessonTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    flex: 1,
  },
  lockedLesson: {
    color: colors.textMuted,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  lessonOptions: {
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  optionText: {
    fontSize: fontSizes.md,
    marginLeft: spacing.md,
  },
  completedText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    margin: spacing.xl,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 5,
    borderRadius: borderRadius.xl,
    padding: 35,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: fontSizes.lg,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  modalButtonText: {
    color: colors.textWhite,
    fontWeight: fontWeights.bold,
  },
});

export default LessonTrackingScreen;
