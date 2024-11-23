# HealthTrackerScreen

## Description
A React Native screen for tracking daily health metrics such as stress levels, dietary habits, weight, and caffeine intake. It integrates with Firebase Firestore for real-time data syncing and Zustand for state management.

## Key Features
- Real-time Firebase Firestore sync for health data.
- Zustand for local state management.
- Reusable `OptionButton` component for rendering options.

## Functions
### `renderOptions(field: string, options: OptionType[], selectedValue: OptionType)`
Generates a row of buttons for selecting options for a specific field.

### `saveData()`
Saves the current health data to Firebase Firestore.

## Styles
| Style Name               | Description                                     |
|--------------------------|-------------------------------------------------|
| `scrollView`             | The main scrollable container.                  |
| `container`              | Main container for the form content.            |
| `button`                 | Styling for the save button.                    |
| `optionButton`           | Base style for the selectable buttons.          |
