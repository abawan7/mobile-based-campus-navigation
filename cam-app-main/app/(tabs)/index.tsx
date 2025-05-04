import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import { FontAwesome } from '@expo/vector-icons'; // For location pin icon

export default function SplitPage() {
  const [fadeInText] = useState(new Animated.Value(0)); // Initial opacity for first text
  const [scaleText] = useState(new Animated.Value(0.5)); // Initial scale for first text

  const [fadeInDescription] = useState(new Animated.Value(0)); // Initial opacity for description text
  const [scaleDescription] = useState(new Animated.Value(0.5)); // Initial scale for description text

  // Use useEffect to trigger the animation when the component mounts
  useEffect(() => {
    // First pop animation (for "Find Your Way Around FAST")
    Animated.timing(fadeInText, {
      toValue: 1,  // Fade to opacity 1
      duration: 800, // Duration of the fade
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleText, {
      toValue: 1,  // Scale to 1 (original size)
      duration: 800, // Duration of the scale
      useNativeDriver: true,
    }).start();

    // Delay the second pop animation (for description text)
    setTimeout(() => {
      // Second pop animation (for description text)
      Animated.timing(fadeInDescription, {
        toValue: 1,  // Fade to opacity 1
        duration: 800, // Duration of the fade
        useNativeDriver: true,
      }).start();

      Animated.timing(scaleDescription, {
        toValue: 1,  // Scale to 1 (original size)
        duration: 800, // Duration of the scale
        useNativeDriver: true,
      }).start();
    }, 1000); // Delay of 1 second before starting the second animation
  }, []);

  return (
    <LinearGradient
      colors={[
        '#140f32',
        '#140f32',
        '#140f32',
        '#140f32',
        '#140f32',
        '#1b163e',
        '#231d4a',
        '#2b2456',
        '#3d3473',
        '#514592',
        '#6457b1',
        '#796ad2',
      ]}
      style={styles.bottomHalf}
    >
      <View style={styles.textContainer}>
        {/* Location Pin Icon */}
        <FontAwesome name="map-marker" size={50} color="#F5F5DC" />
        
        {/* Animated Text */}
        <Animated.Text
          style={[
            styles.bottomText,
            {
              opacity: fadeInText,  // Apply the fade-in animation
              transform: [{ scale: scaleText }],  // Apply the scaling animation
            },
          ]}
        >
          Find Your Way Around FAST
        </Animated.Text>

        {/* Animated Description */}
        <Animated.Text
          style={[
            styles.descriptionText,
            {
              opacity: fadeInDescription,  // Apply the fade-in animation
              transform: [{ scale: scaleDescription }],  // Apply the scaling animation
            },
          ]}
        >
          A mobile-based campus navigation assistant that estimates a user's location using image-based landmark recognition and distance estimation, without relying on GPS.
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  textContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Center both icon and text vertically
  },

  bottomText: {
    fontSize: 40,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#F5F5DC',
    marginTop: 10, // Add space between icon and text
    textAlign: 'center',
  },

  descriptionText: {
    fontSize: 18, // Smaller font size for the description
    fontStyle: 'normal', // Normal style for the description
    color: '#F5F5DC',
    marginTop: 20, // Add space between the main text and the description
    textAlign: 'center',
    paddingHorizontal: 20, // Add some padding for better readability
  },
});
