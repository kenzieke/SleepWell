import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import FullWidthPicture from "../../components/FullWidthPicture";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { ScrollView } from 'react-native-gesture-handler';

const LessonDetailScreen = ({ route, navigation }) => {
    const { lesson } = route.params;
    const userId = FIREBASE_AUTH.currentUser?.uid;

    const markLessonComplete = async () => {
      if (userId) {
        const lessonTrackingRef = doc(FIRESTORE_DB, 'users', userId, 'lessonTracking', 'progress');
        const updatedProgress = { [lesson.id]: true };
        await setDoc(lessonTrackingRef, updatedProgress, { merge: true });
        console.log(`Marking ${lesson.title} as complete`);
        navigation.goBack();
      } else {
        console.error("User ID is undefined.");
      }
    };

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollViewStyle}
          minimumZoomScale={1}
          maximumZoomScale={5} // Adjust this to control zoom level
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <FullWidthPicture uri={Image.resolveAssetSource(lesson.image).uri} />
        </ScrollView>

        <TouchableOpacity onPress={markLessonComplete} style={styles.doneBtn}>
            <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF', // Set background color to white
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollViewStyle: {
      flex: 1,
      width: '100%',
      paddingTop: 30, // Add padding at the top to shift the image down
    },
    doneText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
      },
    doneBtn: {
        width: '80%',
        backgroundColor: '#52796F',
        borderRadius: 25,
        height: 40, // Reduce the height of the button
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10, // Reduce the top margin
        marginBottom: 10, // Reduce the bottom margin if needed
    }
});

export default LessonDetailScreen;
