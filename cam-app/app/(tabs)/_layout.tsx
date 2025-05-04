import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; 
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12, // Adjust font size
          marginTop: 4, // Space between icon and label
        },
        tabBarStyle: {
          backgroundColor: '#796AD2', // Make the background transparent
          borderTopWidth: 0, // Remove the border if needed
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'} // Filled icon when focused
              color={focused ? '#140f32' : color} // Change icon color when focused
            />
          ),
          tabBarLabelStyle: {
            color: '#140f32', // Set label color for Home
          },
        }}
      />

      {/* Camera Tab */}
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'camera' : 'camera-outline'} // Filled icon when focused
              color={focused ? '#140f32' : color} // Change icon color when focused
            />
          ),
          tabBarLabelStyle: {
            color: '#140f32', // Set label color for Camera
          },
        }}
      />

<Tabs.Screen
        name="explore"
        options={{
          title: 'Pin',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="location" size={size} color={focused ? '#140f32' : color} />  // Pin icon
          ),
          tabBarLabelStyle: {
            color: '#140f32', // Set label color for Camera
          },
        }}
      />
    </Tabs>
  );
}
