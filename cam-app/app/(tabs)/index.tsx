import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Switched to Ionicons for consistency
import LottieView from 'lottie-react-native'; // Optional: for more advanced animations

const { width } = Dimensions.get('window');

export default function SplashPage() {
  // Animation values
  const fadeInMain = useRef(new Animated.Value(0)).current;
  const slideUpMain = useRef(new Animated.Value(50)).current;
  
  const fadeInTitle = useRef(new Animated.Value(0)).current;
  const scaleTitle = useRef(new Animated.Value(0.8)).current;
  
  const fadeInDesc = useRef(new Animated.Value(0)).current;
  const slideUpDesc = useRef(new Animated.Value(30)).current;
  
  const pulseIcon = useRef(new Animated.Value(1)).current;
  
  // Pulsing animation for the location icon
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseIcon, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseIcon, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    // Initial animation sequence
    const animationSequence = Animated.stagger(200, [
      // First show the background and icon
      Animated.parallel([
        Animated.timing(fadeInMain, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpMain, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Then animate the title
      Animated.parallel([
        Animated.timing(fadeInTitle, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scaleTitle, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      
      // Finally animate the description
      Animated.parallel([
        Animated.timing(fadeInDesc, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpDesc, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Start the animation sequence
    animationSequence.start();
    
    // Start the pulsing animation for the icon after a delay
    setTimeout(() => {
      startPulseAnimation();
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140f32" />
      
      <LinearGradient
        colors={[
          '#140f32', // Dark purple base
          '#1b163e',
          '#231d4a',
          '#2b2456',
          '#3d3473',
          '#514592',
          '#6457b1',
          '#796ad2', // Light purple top
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.background}
      >
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeInMain,
              transform: [{ translateY: slideUpMain }]
            }
          ]}
        >
          {/* Animated Icon */}
          <Animated.View style={{
            transform: [{ scale: pulseIcon }],
            marginBottom: 20
          }}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={60} color="#FFF" />
              <View style={styles.iconRing} />
            </View>
          </Animated.View>
          
          {/* Animated Title */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: fadeInTitle,
                transform: [{ scale: scaleTitle }]
              }
            ]}
          >
            Find Your Way{'\n'}Around FAST
          </Animated.Text>
          
          {/* Animated Description */}
          <Animated.Text
            style={[
              styles.description,
              {
                opacity: fadeInDesc,
                transform: [{ translateY: slideUpDesc }]
              }
            ]}
          >
            A mobile-based campus navigation assistant using image-based landmark recognition, without relying on GPS.
          </Animated.Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  iconRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: width * 0.85,
  },
  bottomIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FFF',
  },
});