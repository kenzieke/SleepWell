import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define your data structure for sleep coaches
type CoachItem = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

// Data for sleep coaches
const coaches: CoachItem[] = [
  {
    id: '1',
    name: 'Dr. Samantha Miller',
    phoneNumber: '+1 (555) 123-4567',
    email: 'samantha.miller@sleepcoach.com',
    iconName: 'person',
  },
  {
    id: '2',
    name: 'Dr. Robert Smith',
    phoneNumber: '+1 (555) 234-5678',
    email: 'robert.smith@sleepcoach.com',
    iconName: 'person',
  },
  {
    id: '3',
    name: 'Dr. Laura Johnson',
    phoneNumber: '+1 (555) 345-6789',
    email: 'laura.johnson@sleepcoach.com',
    iconName: 'person',
  },
  // Add more coaches if needed
];

const List: React.FC = () => {
  // Function to render each item
  const renderItem = ({ item }: { item: CoachItem }) => (
    <View style={styles.itemContainer}>
      <Ionicons name={item.iconName} size={24} color="#000" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.coachName}>{item.name}</Text>
        <Text style={styles.contactInfo}>{`Phone: ${item.phoneNumber}`}</Text>
        <Text style={styles.contactInfo}>{`Email: ${item.email}`}</Text>
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
          // Header component to replace the previous ScrollView's content
          <View style={styles.headerContainer}>
            {/* Your header content, like the title or a back button */}
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
