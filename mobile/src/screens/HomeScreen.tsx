import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Quiz: { category?: string; subcategory?: string };
  ImageQuiz: undefined;
  Stats: undefined;
  Profile: undefined;
  AiTutor: undefined;
  Resources: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();

  const featuredCategories = [
    { id: 1, name: 'Anatomy', icon: '🫀', color: '#f87171' },
    { id: 2, name: 'Physiology', icon: '⚡', color: '#60a5fa' },
    { id: 3, name: 'Pathology', icon: '🦠', color: '#34d399' },
    { id: 4, name: 'Pharmacology', icon: '💊', color: '#a78bfa' },
    { id: 5, name: 'Immunology', icon: '🛡️', color: '#fbbf24' },
  ];

  // Get today's date in a readable format
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header with greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.displayName?.split(' ')[0] || 'Student'}
            </Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => navigation.navigate('Profile')}
          >
            {user?.photoURL ? (
              <Image 
                source={{ uri: user.photoURL }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profilePlaceholderText}>
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Study progress card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressTitle}>Your Study Progress</Text>
            <Text style={styles.progressSubtitle}>Keep going! You're doing great.</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>65% of today's goal completed</Text>
          </View>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={styles.continueButtonText}>Continue Studying</Text>
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Quiz')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#e0f2fe' }]}>
              <Text style={styles.actionIcon}>📝</Text>
            </View>
            <Text style={styles.actionTitle}>Text Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('ImageQuiz')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#fef3c7' }]}>
              <Text style={styles.actionIcon}>🖼️</Text>
            </View>
            <Text style={styles.actionTitle}>Image Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('AiTutor')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.actionIcon}>🤖</Text>
            </View>
            <Text style={styles.actionTitle}>AI Tutor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Stats')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#f3e8ff' }]}>
              <Text style={styles.actionIcon}>📊</Text>
            </View>
            <Text style={styles.actionTitle}>Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Categories section */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesContainer}
        >
          {featuredCategories.map(category => (
            <TouchableOpacity 
              key={category.id}
              style={[styles.categoryCard, { borderColor: category.color }]}
              onPress={() => navigation.navigate('Quiz', { category: category.name })}
            >
              <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Resources section */}
        <View style={styles.resourcesSection}>
          <View style={styles.resourcesHeader}>
            <Text style={styles.sectionTitle}>Learning Resources</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Resources')}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.resourceIconContainer}>
              <Text style={styles.resourceIcon}>📚</Text>
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Anatomy Textbook</Text>
              <Text style={styles.resourceDescription}>Comprehensive guide to human anatomy</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.resourceIconContainer}>
              <Text style={styles.resourceIcon}>🎬</Text>
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Pathology Video Series</Text>
              <Text style={styles.resourceDescription}>Visual explanations of disease mechanisms</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileImage: {
    width: 44,
    height: 44,
  },
  profilePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  progressTextContainer: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#4f46e5',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  continueButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  categoriesContainer: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  resourcesSection: {
    marginTop: 8,
    marginBottom: 32,
  },
  resourcesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  resourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceIcon: {
    fontSize: 24,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default HomeScreen;