import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Data structure for sleep coaches
type CoachItem = {
  id: string;
  name: string;
  phoneNumber: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

// Data for sleep coaches
const coaches: CoachItem[] = [
  {
    id: '1',
    name: 'Cristina Macedo',
    phoneNumber: '805-756-5089',
    iconName: 'person',
  }
];

const List: React.FC = () => {
  // Function to render each item
  const renderItem = ({ item }: { item: CoachItem }) => (
    <View style={styles.itemContainer}>
      <Ionicons name={item.iconName} size={24} color="#000" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.coachName}>{item.name}</Text>
        <Text style={styles.contactInfo}>{`Phone Number: ${item.phoneNumber}`}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={coaches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 16,
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 16,
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    color: '#000',
    opacity: 0.7,
  },
});

export default List;
