/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import ProgressCircle from '../../components/ProgressCircle';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import { useWeeklyLessonsStore } from '../../stores/WeeklyLessonStore';

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
    <View style={styles.container}>
      <View style={styles.greenHeader}>
        <Image source={require('../../assets/Pillow.jpg')} style={styles.imageStyle} resizeMode="contain" />
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LessonTrackingScreen')}>
          <Text style={styles.buttonText}>Open Modules</Text>
        </TouchableOpacity>
      </View>
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
      <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greenHeader: {
    backgroundColor: '#52796F',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 275,
  },
  imageStyle: {
    width: '100%',
    height: 200,
  },
  header: {
    paddingTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    fontSize: 18,
    color: '#007BFF',
    textAlign: 'center',
  },
});

export default WeeklyLessonsScreen;
