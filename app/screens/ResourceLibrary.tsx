import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

// Define your data structure for the list items
type ResourceItem = {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  link: string;
};

// Data; replace the flames with icons from Lexanna
const resources: ResourceItem[] = [
    {
        id: '1',
        title: 'Avoiding Nightmares',
        iconName: 'flame',
        link: 'Rescripting dreams',
      },
    {
        id: '2',
        title: 'White Noise',
        iconName: 'flame',
        link: 'Relaxing stories, music',
    },
    {
        id: '3',
        title: 'Guided Meditation',
        iconName: 'flame',
        link: 'Placeholder',
    },
    {
        id: '4',
        title: 'Fitness and Work Capacity',
        iconName: 'flame',
        link: 'Placeholder',
    },
    {
        id: '5',
        title: 'Fatigue Research',
        iconName: 'flame',
        link: 'https://www.nwcg.gov/sites/default/files/committee/docs/rmc-fatigue-wff-research-summary-2022.pdf',
    },
    {
        id: '6',
        title: 'Taking a Nap Near the Fire',
        iconName: 'flame',
        link: 'https://www.nwcg.gov/committee/6mfs/taking-a-nap-near-the-fireline',
    },
    {
        id: '7',
        title: 'Brain Rules',
        iconName: 'flame',
        link: 'https://www.nwcg.gov/sites/default/files/wfldp/toolbox/prp/brain-rules.pdf',
    },
    {
        id: '8',
        title: 'Nutrition',
        iconName: 'flame',
        link: 'hhttps://www.nwcg.gov/committee/6mfs/firefighter-nutrition',
    },
    {
        id: '9',
        title: 'Stress',
        iconName: 'flame',
        link: 'https://www.nwcg.gov/committee/6mfs/firefighter-stress-management',
    },
    // Add more if needed
];

const ResourceLibraryScreen: React.FC = () => {
  // Function to render each item
  const renderItem = ({ item }: { item: ResourceItem }) => (
    <View style={styles.itemContainer}>
      <Ionicons name={item.iconName} size={24} color="#000" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
          <Text style={styles.linkText}>{item.link}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={resources}
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
  // Add styles for headerContainer if needed
  headerContainer: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 16,
    alignItems: 'center', // Center items horizontally in the container
  },
  title: {
    // I would like this to be in line with the back arrow
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
  sectionTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
  },
  linkText: {
    color: '#000',
    opacity: 0.6,
  },
  backButton: {
    padding: 8, // Padding to make it easier to press
    top: 0,
  },
});

export default ResourceLibraryScreen;
