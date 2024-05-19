import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

type Link = {
  name: string;
  url: string;
};

type ResourceItem = {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  links: Link[];
};

// Data; replace the flames with icons from Lexanna
const resources: ResourceItem[] = [
  {
    id: '1',
    title: 'Avoiding Nightmares',
    iconName: 'flame',
    links: [
      { name: '6 Tips to Avoid Nightmares from a Therapist', url: 'https://www.youtube.com/watch?v=WJXY_u0KAR0' },
    ],
  },
  {
    id: '2',
    title: 'White Noise/Relaxing Music/Bedtime Stories',
    iconName: 'flame',
    links: [
      { name: 'Relaxing Stories', url: 'https://youtu.be/1ZYbU82GVz4?si=ct-rUdft7VXCYofm' },
      { name: 'Bedtime Stories', url: 'https://youtu.be/EVxkcRY8JHA?si=SL3cMXxVgLO0_UQC' },
      { name: 'Weightless Marconi Union', url: 'http://example.com/more' }
    ],
  },
  {
    id: '3',
    title: 'Stress Tools: Guided Meditation, PMR, Deep Breathing',
    iconName: 'flame',
    links: [
      { name: 'Meditation', url: 'https://youtu.be/2K4T9HmEhWE?si=M94unrpZ7xaTvuoK' },
      { name: 'Deep Breathing', url: 'https://youtu.be/Z8emmFOuhxE?si=XP09rNxIEvwWHKjy' },
      { name: 'Mindfulness', url: 'https://youtu.be/H0kWYFwciZA?si=1kEZW7nneg4Dbjnl' },
      { name: 'Progressive Muscle Relaxation', url: 'https://youtu.be/bQu3JjtJG88?si=g4FlHBXJ4xrxARlG' }
    ],
  },
  {
    id: '4',
    title: 'Nutrition',
    iconName: 'flame',
    links: [
      { name: 'Firefighter Specific Data', url: 'https://www.youtube.com/watch?v=jfWbkCmF4yY' },
      { name: 'How to Log Food on MyFitnessPal', url: 'https://www.youtube.com/watch?v=I9cdBAcuhXU' },
      { name: '5 Tips to Lose Weight (AHA)', url: 'https://www.heart.org/en/healthy-living/healthy-eating/losing-weight/conquer-cravings-with-these-healthy-substitutions' },
      { name: '15 Healthy Food Swaps', url: 'https://www.youtube.com/watch?v=4D8KEU3HVyw' },
      { name: 'Easy Snack Food Swaps', url: 'https://www.youtube.com/watch?v=6oQFWCDI4EM' }
    ],
  },
  {
    id: '5',
    title: 'Falling Asleep',
    iconName: 'flame',
    links: [
      { name: 'Military Method', url: 'https://youtu.be/FWGuy4oOQgQ?si=tXD_Gy35nApgRb55' },
      { name: 'Box Breathing', url: 'https://youtu.be/G802lT0YNJ8?si=cr2C70uJZBb9ehTn' }
    ],
  },
  {
    id: '6',
    title: 'Fitness',
    iconName: 'flame',
    links: [
      { name: 'Building Muscle', url: 'https://www.youtube.com/watch?v=47Dt93KB3T4' },
      { name: 'Simple Cardio Workout', url: 'https://www.youtube.com/watch?v=r8ljh2JuDLc' }
    ],
  },
  // {
  //   id: '7',
  //   title: 'Brain Rules',
  //   iconName: 'flame',
  //   links: [
  //     { name: 'Relaxing Stories', url: 'http://example.com/stories' },
  //     { name: 'Soothing Music', url: 'http://example.com/music' }
  //   ],
  // },
  // {
  //   id: '8',
  //   title: 'Nutrition',
  //   iconName: 'flame',
  //   links: [
  //     { name: 'Relaxing Stories', url: 'http://example.com/stories' },
  //     { name: 'Soothing Music', url: 'http://example.com/music' }
  //   ],
  // },
  // {
  //   id: '9',
  //   title: 'Stress',
  //   iconName: 'flame',
  //   links: [
  //     { name: 'Relaxing Stories', url: 'http://example.com/stories' },
  //     { name: 'Soothing Music', url: 'http://example.com/music' }
  //   ],
  // },
];

const ResourceLibraryScreen: React.FC = () => {
  // Function to render each item
  const renderItem = ({ item }: { item: ResourceItem }) => (
    <View style={styles.itemContainer}>
      <Ionicons name={item.iconName} size={24} color="#000" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        {item.links.map((link, index) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(link.url)}>
            <Text style={styles.linkText}>{link.name}</Text>
          </TouchableOpacity>
        ))}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4, // Add some space between the title and the links
  },
  linkText: {
    color: '#000',
    opacity: 0.6,
    paddingTop: 2, // This adds a bit of space between each link
    paddingBottom: 2, // You can adjust the padding as needed
  },
  headerContainer: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 16,
    alignItems: 'center', // Center items horizontally in the container
  },
  backButton: {
    padding: 8, // Padding to make it easier to press
    top: 0,
  },
});

export default ResourceLibraryScreen;
