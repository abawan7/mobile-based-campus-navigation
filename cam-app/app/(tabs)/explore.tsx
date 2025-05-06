import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Image, Platform, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Interface for building data
interface Building {
  name: string;
  latitude: number;
  longitude: number;
}

export default function ExploreScreen() {
  // Static data for FAST NUCES Lahore Buildings
  const buildings: Building[] = [
    {
      name: "Directors Office",
      latitude: 31.48222964940498,
      longitude: 74.3035499304804,
    },
    {
      name: "EnM",
      latitude: 31.48107824241253,
      longitude: 74.30332310850635,
    },
    {
      name: "Admin Block",
      latitude: 31.481067391919904,
      longitude: 74.3030048329072,
    },
    {
      name: "Fast Love Garden",
      latitude: 31.481850562126183,
      longitude: 74.30293071206277,
    },
    {
      name: "CS New Building",
      latitude: 31.4805443557776,
      longitude: 74.30417136303642,
    },
    {
      name: "CS Old Building",
      latitude: 31.481178398975324,
      longitude: 74.30288072461302,
    },
    {
      name: "Fast Cricket Ground",
      latitude: 31.480388855092567,
      longitude: 74.30309787666373,
    },
    {
      name: "Fast Library",
      latitude: 31.481559857421292,
      longitude: 74.30378519760922,
    },
    {
      name: "Civil",
      latitude: 31.481982241525063,
      longitude: 74.30366007617641,
    },
  ];

  // Calculate center coordinates based on all building locations
  const calculateMapCenter = () => {
    let sumLat = 0;
    let sumLng = 0;
    
    buildings.forEach(building => {
      sumLat += building.latitude;
      sumLng += building.longitude;
    });
    
    return {
      latitude: sumLat / buildings.length,
      longitude: sumLng / buildings.length,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    };
  };

  // Custom map style
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    }
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image 
          source={require('@/assets/images/Lahore_Campus.jpg')} 
          style={styles.headerImage} 
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Campus Map</ThemedText>
      </ThemedView>
      <ThemedText>Explore the FAST NUCES Lahore Campus buildings.</ThemedText>
      
      {/* FAST NUCES Lahore Campus Map */}
      <ThemedView style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={calculateMapCenter()}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
        >
          {/* Building Markers */}
          {buildings.map((building, index) => (
            <Marker
              key={index}
              coordinate={{ 
                latitude: building.latitude, 
                longitude: building.longitude 
              }}
              title={building.name}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={24} color="#3E92CC" />
              </View>
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{building.name}</Text>
                  <Text style={styles.calloutText}>FAST NUCES Lahore</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <View style={styles.mapLabelContainer}>
          <Text style={styles.mapLabel}>FAST NUCES Lahore Campus</Text>
        </View>
      </ThemedView>
      
      <ThemedText style={styles.mapFooter}>
        The map displays all 9 major buildings on the FAST NUCES Lahore Campus.
      </ThemedText>
      
      <ThemedView style={styles.buildingListContainer}>
        <ThemedText type="title" style={styles.buildingListTitle}>Campus Buildings</ThemedText>
        {buildings.map((building, index) => (
          <ThemedView key={index} style={styles.buildingItem}>
            <Ionicons name="business-outline" size={20} color="#3E92CC" />
            <ThemedText style={styles.buildingName}>{building.name}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
      
      <ExternalLink href="https://lhr.nu.edu.pk/">
        <ThemedText type="link" style={styles.externalLink}>Learn more about FAST NUCES Lahore</ThemedText>
      </ExternalLink>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%', // Ensure the image takes the full width
    height: '100%', // Ensure the image takes the full height
    resizeMode: 'cover', // To ensure the image covers the entire area, maintaining its aspect ratio
    position: 'absolute', // Keep the image positioned as needed
  },  
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapFooter: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    fontStyle: 'italic',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutContainer: {
    width: 150,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    color: '#555',
  },
  mapLabelContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
  },
  mapLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  buildingListContainer: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  buildingListTitle: {
    marginBottom: 12,
    fontSize: 18,
  },
  buildingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  buildingName: {
    marginLeft: 10,
    fontSize: 14,
  },
  externalLink: {
    marginTop: 8,
    marginBottom: 16,
  }
});