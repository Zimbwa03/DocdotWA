import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ImageQuizScreen from '../screens/ImageQuizScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AiTutorScreen from '../screens/AiTutorScreen';
import ResourcesScreen from '../screens/ResourcesScreen';

// Define our stack navigator param list
type RootStackParamList = {
  Home: undefined;
  Quiz: { category?: string; subcategory?: string };
  ImageQuiz: undefined;
  Stats: undefined;
  Profile: undefined;
  AiTutor: undefined;
  Resources: undefined;
};

// Define our authentication stack param list
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Main tab navigator component for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5', // Primary color
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{
          tabBarLabel: 'Quiz',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="help-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="ImageQuiz" 
        component={ImageQuizScreen} 
        options={{
          tabBarLabel: 'Image Quiz',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="image" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="bar-chart-2" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Authentication stack for unauthenticated users
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// TabBarIcon component for our bottom tabs
// This is a placeholder - you'll need to replace it with an actual icon component
const TabBarIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  // For now, return a simple colored box
  return (
    <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
  );
};

// Main application navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        // User is signed in
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        // User is not signed in
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;