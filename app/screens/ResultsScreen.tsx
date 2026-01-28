import React, { useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { CategoryDetails, useResultsStore } from '../../stores/ResultsStore';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../styles';
import FirstTimeModal from '../components/FirstTimeModal';
import ScalableText from '../components/ScalableText';

const ResultsScreen = () => {
  const {
    results,
    isModalVisible,
    selectedCategory,
    fetchResults,
    setModalVisible,
    setSelectedCategory,
    getCategoryDetails,
  } = useResultsStore();

  useEffect(() => {
    fetchResults();
  }, []);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    if (!selectedCategory) return null;

    const details: CategoryDetails = getCategoryDetails(results)[selectedCategory];

    return (
      <View style={styles.modalContent}>
        <ScalableText style={styles.modalHeaderText} maxScale={2}>Your {selectedCategory} score is:</ScalableText>
        <ScalableText style={styles.modalScoreText} maxScale={2}>{details.score}</ScalableText>
        <ScalableText style={styles.modalDescriptionText} maxScale={2}>{details.description}</ScalableText>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.button}>
          <ScalableText style={styles.buttonText} maxScale={2}>Close</ScalableText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <FirstTimeModal
        storageKey="@hasSeenResultsScreen"
        message="Here are your baseline results from your very first sleep assessment. Click on any of them to see your scores explained."
      />
      <View style={styles.container}>
        <ScalableText style={styles.instructionText} maxScale={2}>
          Click on any of the following categories to see more about your results.
        </ScalableText>
        {Object.keys(getCategoryDetails(results)).map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryContainer}
            onPress={() => handleCategoryPress(category)}
          >
            <ScalableText style={styles.categoryText} maxScale={2}>{category}</ScalableText>
            <Image
              source={getCategoryDetails(results)[category].image}
              style={styles.scaleImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderModalContent()}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  instructionText: {
    fontSize: fontSizes.md,
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  categoryContainer: {
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    marginBottom: 5,
    textAlign: 'center',
  },
  scaleImage: {
    width: '100%',
    height: 40,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xxl,
    marginTop: spacing.xxl,
  },
  buttonText: {
    fontWeight: fontWeights.medium,
    color: colors.textWhite,
    fontSize: fontSizes.md,
    textAlign: 'center',
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
  modalContent: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    borderRadius: borderRadius.xxl,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
  },
  modalHeaderText: {
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalScoreText: {
    fontWeight: fontWeights.bold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalDescriptionText: {
    textAlign: 'center',
    fontSize: fontSizes.md,
    marginBottom: spacing.lg,
  },
});

export default ResultsScreen;
