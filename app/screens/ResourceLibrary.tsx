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
    title: 'Relaxing Sounds',
    iconName: 'flame',
    links: [
      { name: 'White Noise', url: 'https://youtu.be/nMfPqeZjc2c?si=hMfu_wdrrcAo36TK' },
      { name: 'Music - Weightless 10 hours', url: 'https://youtu.be/UfcAVejslrU?si=NCuKn4EYiaVleCaQ' },
      { name: 'Music - Relaxing 3 hours', url: 'https://youtu.be/1ZYbU82GVz4?si=ct-rUdft7VXCYofm' }
    ],
  },
  {
    id: '2',
    title: 'Stress Tools: Guided Meditation, PMR, Deep Breathing',
    iconName: 'flame',
    links: [
      { name: 'Meditation Before Sleep (5 min)', url: 'https://youtu.be/2K4T9HmEhWE?si=M94unrpZ7xaTvuoK' },
      { name: 'Deep Breathing (5 min)', url: 'https://youtu.be/Z8emmFOuhxE?si=XP09rNxIEvwWHKjy' },
      { name: 'Progressive Muscle Relaxation', url: 'https://youtu.be/bQu3JjtJG88?si=g4FlHBXJ4xrxARlG' }
    ],
  },
  {
    id: '3',
    title: 'Mental Health',
    iconName: 'flame',
    links: [
      { name: 'Set Aside Worry Time', url: 'https://www.youtube.com/watch?v=OUNR0wh-0o4&t=29s' }
    ],
  },
  {
    id: '4',
    title: 'Special Topics',
    iconName: 'flame',
    links: [
      { name: 'Military Method for Falling Asleep', url: 'https://youtu.be/FWGuy4oOQgQ?si=tXD_Gy35nApgRb55' },
      { name: 'Managing Nightmares', url: 'https://youtu.be/8SwEQEoyqXg?si=Pnhue6TU53smW8lG' },
      { name: 'Things To Do When You Cannot Sleep', url: 'https://www.youtube.com/watch?v=IeojaKaSpf0' },
      { name: 'Ideas on Ways to Relax (1 min video)', url: 'https://www.youtube.com/watch?v=6eArqqaMkyQ&t=68s' },
      { name: 'Managing Shift Work Schedule', url: 'https://www.youtube.com/watch?v=T114qhKIMag' },
    ],
  },
  {
    id: '5',
    title: 'Motivation',
    iconName: 'flame',
    links: [
      { name: 'Remind Yourself of Key Sleep Strategies (2 min)', url: 'https://www.dhs.gov/medialibrary/assets/videos/9196' },
      { name: 'Recovering From Lapses', url: 'https://www.youtube.com/watch?v=Jh7PxmsbhhQ&t=5s' },
      { name: 'Sleep & Heart Health', url: 'https://www.heart.org/en/health-topics/sleep-disorders' },
      { name: 'Ways to Sleep Better (7 min)', url: 'https://www.youtube.com/watch?v=uckGbixdXgs&t=4s' },
      ],
  },
  {
    id: '6',
    title: 'Healthy Nutrition',
    iconName: 'flame',
    links: [
      { name: 'Healthy Eating for Firefighters (7 min)', url: 'https://www.youtube.com/watch?v=jfWbkCmF4yY' },
      { name: 'How to Log Food on MyFitnessPal', url: 'https://www.youtube.com/watch?v=I9cdBAcuhXU' },
      { name: 'Healthy Eating for Firefighters (50 min course)', url: 'https://www.youtube.com/watch?v=vposs0dsYsI&list=PLid8i4Cga6mAXUJi1TNjqGX4TusXEngvU&t=1s' },
      { name: 'MyPlate (2 min)', url: 'https://www.youtube.com/watch?v=j7CcaUZrUoE' },
      ],
  },
  {
    id: '7',
    title: 'Healthy Weight',
    iconName: 'flame',
    links: [
      { name: 'Healthy Weight Loss', url: 'https://www.heart.org/en/healthy-living/healthy-eating/losing-weight' },
      { name: 'Healthy Food Substitutions', url: 'https://www.youtube.com/watch?v=4D8KEU3HVyw' },
      { name: 'Protein Mistakes to Avoid', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/4-protein-mistakes-to-avoid' },
      { name: 'Meal Plan - Weight Based', url: 'https://cpslo-my.sharepoint.com/personal/sphelan_calpoly_edu/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fsphelan%5Fcalpoly%5Fedu%2FDocuments%2FGRANTS%2FFirefighters%2FFIREFIGHTERS%5FShared%20Folder%2FResource%20Library&view=0' },
      ],
  },
  {
    id: '8',
    title: 'Building Muscle',
    iconName: 'flame',
    links: [
      { name: 'Exercises for Firefighters', url: 'https://www.youtube.com/watch?v=B6yIQnYigWU' },
      { name: 'Upper Body Strength', url: 'https://www.youtube.com/watch?v=DIFXrfSu0gM' }
    ],
  },
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
