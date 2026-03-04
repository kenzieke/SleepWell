import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';
import FirstTimeModal from '../components/FirstTimeModal';
import ScalableText from '../components/ScalableText';

// Goal data with colors from top to bottom
const goals = [
  {
    id: 'sleepDuration',
    title: 'Sleep Duration',
    subtitle: 'Sleep 7-9 hours per night.',
    icon: 'moon-outline' as const,
    backgroundColor: '#05323b', // Deep teal
    description: 'Ensure you get at least 7-9 hours of sleep every night.',
  },
  {
    id: 'sleepQuality',
    title: 'Sleep Quality',
    subtitle: 'Fall asleep fast and sleep soundly.',
    icon: 'alarm-outline' as const,
    backgroundColor: '#0f5968', // Dark cyan
    description: 'Your sleep quality is measured by the percentage of time spent asleep while in bed. Our program is designed to help improve this quality.',
  },
  {
    id: 'bodyComposition',
    title: 'Body Composition',
    subtitle: 'Lose any excess fat and/or build body mass.',
    icon: 'nutrition-outline' as const,
    backgroundColor: '#1d7883', // Teal
    description: 'BMI is not perfect but helps gauge risk of sleep disorders. Our program includes strategies for weight management to improve sleep.',
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    subtitle: 'Eat a balanced, nutrient-dense diet, stay hydrated, and limit caffeine.',
    icon: 'leaf-outline' as const,
    backgroundColor: '#2f939b', // Soft teal
    description: 'A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Aim for balanced meals with vegetables.',
  },
  {
    id: 'stress',
    title: 'Stress',
    subtitle: 'Boost stress management skills on and off duty.',
    icon: 'cloud-outline' as const,
    backgroundColor: '#1d7883', // Teal
    description: 'Managing stress is crucial for sleep health. Our program offers tools to help manage stress effectively.',
  },
  {
    id: 'physicalActivity',
    title: 'Physical Activity',
    subtitle: 'Engage in a moderate-intensity aerobic exercise for at least 150 minutes per week.',
    icon: 'barbell-outline' as const,
    backgroundColor: '#0f5968', // Dark cyan
    description: 'Regular physical activity improves sleep quality. Avoid vigorous activities right before bed.',
  },
];

const WeeklyGoals: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<typeof goals[0] | null>(null);

  const openModal = (goal: typeof goals[0]) => {
    setSelectedGoal(goal);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FirstTimeModal
        storageKey="@hasSeenWeeklyGoals"
        message="Tap any of the descriptions to get more information about what each goal entails."
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[styles.goalCard, { backgroundColor: goal.backgroundColor }]}
            onPress={() => openModal(goal)}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={goal.icon} size={40} color="rgba(255,255,255,0.4)" />
            </View>
            <View style={styles.textContainer}>
              <ScalableText style={styles.goalTitle} maxScale={2}>{goal.title}</ScalableText>
              <ScalableText style={styles.goalSubtitle} maxScale={2}>{goal.subtitle}</ScalableText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalView}>
              <ScalableText style={styles.modalText} maxScale={2}>
                {selectedGoal?.description || 'Content not available'}
              </ScalableText>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButtonContainer}>
                <ScalableText style={styles.closeButtonText} maxScale={2}>Close</ScalableText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f5968', // Dark cyan to match bottom card
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  goalCard: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  iconContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  goalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  goalSubtitle: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalView: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: borderRadius.xxl,
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
  closeButtonContainer: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  closeButtonText: {
    color: colors.textWhite,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});

export default WeeklyGoals;
