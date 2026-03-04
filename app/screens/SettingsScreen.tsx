import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../types/navigationTypes';
import { colors, fontSizes, fontWeights, spacing } from '../styles';
import InfoModal from '../components/InfoModal';
import ScalableText from '../components/ScalableText';
import { useLessonTrackingStore } from '../../stores/LessonTrackingStore';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SettingsScreen'>;

const SETTINGS_INFO_MESSAGE = "View your profile information, access your sleep coach's contact details, see your baseline assessment results, or log out of the app.";

interface UserProfile {
  name: string;
  email: string;
  inviteCode: string;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const cleanupLessonTracking = useLessonTrackingStore((state) => state.cleanup);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={{ marginRight: 10 }}>
          <Ionicons name="information-circle-outline" size={24} color="#52796F" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          name: data.name || '',
          email: data.email || FIREBASE_AUTH.currentUser?.email || '',
          inviteCode: data.inviteCode || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // Cleanup Firestore listeners before signing out
            cleanupLessonTracking();

            FIREBASE_AUTH.signOut()
              .then(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              })
              .catch((error) => console.error('Logout error:', error));
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    iconName: keyof typeof Ionicons.glyphMap,
    title: string,
    onPress: () => void,
    showChevron: boolean = true
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <Ionicons name={iconName} size={24} color={colors.textPrimary} style={styles.icon} />
        <ScalableText style={styles.settingText} maxScale={2}>{title}</ScalableText>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <InfoModal
        visible={infoVisible}
        message={SETTINGS_INFO_MESSAGE}
        onClose={() => setInfoVisible(false)}
      />
      {/* Profile Section */}
      {userProfile && (
        <View style={styles.profileSection}>
          <View style={styles.profileIcon}>
            <Ionicons name="person-circle" size={60} color={colors.primary} />
          </View>
          <ScalableText style={styles.profileName} maxScale={2}>{userProfile.name}</ScalableText>
          <ScalableText style={styles.profileEmail} maxScale={2}>{userProfile.email}</ScalableText>
          <ScalableText style={styles.profileCode} maxScale={2}>Access Code: {userProfile.inviteCode}</ScalableText>
        </View>
      )}

      {/* Settings List */}
      <View style={styles.settingsList}>
        {renderSettingItem('person-outline', 'Sleep Coach', () => {
          navigation.navigate('ListMain');
        })}

        {renderSettingItem('stats-chart-outline', 'Baseline Results', () => {
          navigation.navigate('ResultsScreen', { fromTracker: true });
        })}

        {renderSettingItem('log-out-outline', 'Log Out', handleLogout, false)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileIcon: {
    marginBottom: spacing.md,
  },
  profileName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  profileCode: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  settingsList: {
    paddingTop: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.lg,
    width: 24,
  },
  settingText: {
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
  },
});

export default SettingsScreen;
