import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // Define consistent color palette
  const colors = {
    primary: '#3E92CC', // Blue color from the map markers
    accent: '#FF5722',  // Orange color from the detected building marker
    tabBackground: 'transparent', // Changed to transparent for BlurView
    activeText: '#3E92CC',
    inactiveText: colorScheme === 'dark' ? '#8E8E93' : '#6E6E73',
    shadow: colorScheme === 'dark' ? '#000' : '#888'
  };

  // Set the intensity of the blur effect based on theme
  const blurIntensity = colorScheme === 'dark' ? 70 : 80;
  // Set blur tint based on theme
  const blurTint = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.activeText,
        tabBarInactiveTintColor: colors.inactiveText,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
          marginTop: '10%'
        },
        tabBarBackground: () => (
          <BlurView 
            tint={blurTint}
            intensity={blurIntensity}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 25,
            }}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 8,
          backgroundColor: colors.tabBackground,
          borderRadius: 25,
          height: 64,
          paddingBottom: 4,
          paddingTop: 8,
          borderTopWidth: 0,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          overflow: 'hidden', // Important for the BlurView
        },
        tabBarItemStyle: {
          margin: 4,
          borderRadius: 20,
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
              name={focused ? 'home' : 'home-outline'} 
              color={focused ? colors.primary : color}
              size={24} 
            />
          ),
        }}
      />

      {/* Camera Tab - Highlighted as a special action */}
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 20,
              padding: 8,
              marginTop: -8,
              marginBottom: -8,
              width: 60,
              alignItems: 'center',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 4,
            }}>
              <Ionicons 
                name={focused ? 'camera' : 'camera-outline'} 
                color='#FFF'
                size={26} 
              />
            </View>
          ),
          tabBarLabelStyle: {
            color: colors.primary,
            fontWeight: '700',
            fontSize: 12,
            marginTop: 4,
          },
        }}
      />

      {/* Explore/Map Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'map' : 'map-outline'} 
              color={focused ? colors.primary : color}
              size={24} 
            />
          ),
        }}
      />
    </Tabs>
  );
}