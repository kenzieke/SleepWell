/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ImageBackground } from 'react-native';
import ProgressCircle from '../components/ProgressCircle';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { useWeeklyLessonsStore } from '../../stores/WeeklyLessonStore';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';

type WeeklyLessonsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WeeklyLessonsScreen'>;

interface ProgressDataItem {
  label: string;
  value?: number;
  score?: number;
  avgEfficiency?: number;
  prevAvgEfficiency?: number;
  prevValue?: number;
}

const WeeklyLessonsScreen: React.FC = () => {
  const navigation = useNavigation<WeeklyLessonsScreenNavigationProp>();
  const { progressData, fetchData } = useWeeklyLessonsStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProgressDataItem | null>(null);

  const handleOpenModal = (item: ProgressDataItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (userId) fetchData(userId);

    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (userId) fetchData(userId);
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  const getDescriptionForItem = (item: ProgressDataItem) => {
    if (item.label === 'Sleep Efficiency') {
      const sleepImprovement = item.avgEfficiency && item.prevAvgEfficiency && item.avgEfficiency > item.prevAvgEfficiency;
      return `Sleep Efficiency: ${item.avgEfficiency?.toFixed(2)}% - ${
        item.avgEfficiency && item.avgEfficiency >= 85
          ? 'Great job this week!'
          : item.avgEfficiency && item.avgEfficiency >= 50
          ? 'On your way!'
          : 'Reminder to track your sleep every day.'
      } ${
        sleepImprovement
          ? 'Your sleep efficiency has improved since last week!'
          : 'Try to improve your sleep efficiency next week.'
      }`;
    } else if (item.label === 'Body Comp') {
      return item.value === 100
        ? 'Great job this week!'
        : item.value === 33
        ? 'Keep working to meet your goals! Strive to eat at least a cup of vegetables at every meal and reduce portions of unhealthy foods.'
        : 'Reminder to track your body weight every day.';
    } else if (item.label === 'Nutrition') {
      return item.value === 100
        ? 'Great job tracking your diet this week!'
        : item.value === 33
        ? 'Reminder to track your eating every day for best results.'
        : 'No diet data tracked this week.';
    } else if (item.label === 'Physical Activity') {
      const activityImprovement = item.value && item.prevValue && item.value > item.prevValue;
      return item.value === 100
        ? 'Great job this week!'
        : item.value === 50
        ? 'Keep working to meet your goals!'
        : 'Reminder to track your physical activity every day.' +
          (activityImprovement ? ' Your physical activity has improved since last week!' : ' Try to increase your activity next week.');
    } else if (item.label === 'Stress') {
      return item.value === 100
        ? 'Great job tracking your stress this week. Try different tools to reduce stress.'
        : item.value === 33
        ? 'Track your stress levels daily and try different tools to reduce stress.'
        : 'Reminder to track your stress levels every day.';
    } else if (item.label === 'Weekly Module') {
      return item.value === 100
        ? 'Great job this week!'
        : 'Reminder to do your module every week.';
    }
    return '';
  };

  return (
    <ImageBackground
      source={require('../../assets/sleepwellhomebackground.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.headerContent}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sleep Well{"\n"}Firefighters</Text>
        <Text style={styles.subtitle}>A Wildland Urban Interface Institute{'\n'}Research Study at Cal Poly</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LessonTrackingScreen')}>
          <Text style={styles.buttonText}>Open Modules</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.header}>Weekly Progress</Text>
        <View style={styles.progressRow}>
          {progressData.slice(0, 3).map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleOpenModal(item)}>
              <ProgressCircle key={`first-row-${index}`} percentage={item.value ?? 0} label={item.label} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.progressRow}>
          {progressData.slice(3).map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleOpenModal(item)}>
              <ProgressCircle key={`second-row-${index}`} percentage={item.value ?? 0} label={item.label} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal animationType="slide" visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedItem && (
              <Text style={styles.modalText}>{getDescriptionForItem(selectedItem)}</Text>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.hero,
    fontWeight: fontWeights.bold,
    color: colors.textWhite,
    textAlign: 'center',
    marginBottom: spacing.lg,
    textShadowColor: colors.primaryDark,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textWhite,
    fontStyle: 'italic',
    fontWeight: fontWeights.medium,
    textAlign: 'center',
    marginBottom: spacing.lg,
    textShadowColor: colors.primaryDark,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  progressContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.medium,
    fontStyle: 'italic',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  button: {
    backgroundColor: colors.background,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.huge,
    borderRadius: 30,
    borderWidth: 2,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    borderColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fontSizes.xl,
    color: colors.primaryDark,
    fontWeight: fontWeights.bold,
  },
  centeredView: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: spacing.xl,
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
  closeButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    color: colors.textWhite,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});

export default WeeklyLessonsScreen;
