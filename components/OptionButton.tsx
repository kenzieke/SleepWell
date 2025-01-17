import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export type OptionType = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe' |
                  'Very Satisfied' | 'Satisfied' | 'Somewhat' | 'Dissatisfied' | 'Very Dissatisfied' |
                  'Not Noticeable' | 'Rarely' | 'Noticeable' | 'Very Noticeable' |
                  'Never' | 'Often' | 'Always' |
                  'Low' | 'High' | 'Very High' | 'null';

const OptionButton: React.FC<{
    label: string;
    onPress: () => void;
    isSelected: boolean;
  }> = ({ label, onPress, isSelected }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionButton,
        isSelected && styles.optionButtonSelected,
      ]}>
      <Text
        style={[
          styles.optionText,
          isSelected && styles.optionTextSelected,
        ]}
        numberOfLines={2} // Allow text to wrap to a new line
        adjustsFontSizeToFit // Adjust the font size to ensure the text fits
        minimumFontScale={0.5} // Minimum scale factor for text size
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
    optionButton: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        paddingVertical: 10,
        marginHorizontal: 4,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40, // Set a fixed height for buttons
    },
    optionButtonSelected: {
        backgroundColor: '#52796F',
        borderColor: '#52796F',
    },
    optionText: {
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
        flexShrink: 1, // Allow text to shrink if needed
    },
    optionTextSelected: {
        color: '#ffffff',
    },
});

export default OptionButton;
