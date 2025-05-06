import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, Animated } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Props interface for the data coming from the backend
interface MapViewProps {
  building: string;
  distance: number;
  latitude: number; 
  longitude: number; 
}

const { width } = Dimensions.get('window');

// Custom map style (optional - you can customize this further)
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

const MapViewScreen: React.FC<MapViewProps> = ({ building, distance, latitude, longitude }) => {
  const [userLocation, setUserLocation] = useState({
    latitude: 31.481370524750606,
    longitude: 74.30352902161547,
  });
  
  const [expanded, setExpanded] = useState(false);
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Animation for the info panel
  const toggleExpanded = () => {
    Animated.timing(slideAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };
  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  // Static data for FAST NUCES Lahore Buildings
  const buildings = [
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

  // Center and zoom calculations
  const centerLatitude = (userLocation.latitude + latitude) / 2;
  const centerLongitude = (userLocation.longitude + longitude) / 2;
  
  const latDelta = Math.max(0.005, Math.abs(userLocation.latitude - latitude) * 2.5);
  const longDelta = Math.max(0.005, Math.abs(userLocation.longitude - longitude) * 2.5);

  // Function to center map on user location
  const centerOnUser = () => {
    mapRef.current?.animateToRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000);
  };

  // Function to center map on destination
  const centerOnDestination = () => {
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000);
  };

  // Function to show entire route
  const showRoute = () => {
    mapRef.current?.animateToRegion({
      latitude: centerLatitude,
      longitude: centerLongitude,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: centerLatitude, 
          longitude: centerLongitude,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        }}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
      >
        {/* Building Markers */}
        {buildings.map((b, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: b.latitude, longitude: b.longitude }}
            title={b.name}
            opacity={b.name === building ? 1 : 0.7}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="location" size={24} color="#3E92CC" />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{b.name}</Text>
                <Text style={styles.calloutText}>FAST NUCES Lahore</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Detected Building Marker */}
        <Marker
          coordinate={{ latitude, longitude }}
          title={`Detected: ${building}`}
          description={`${distance ? distance.toFixed(2) : "Unknown"} meters away`}
        >
          <View style={styles.detectedMarkerContainer}>
            <Ionicons name="location" size={30} color="#FF5722" />
          </View>
          <Callout>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>{building}</Text>
              <Text style={styles.calloutText}>{distance.toFixed(2)} meters away</Text>
            </View>
          </Callout>
        </Marker>

        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="Your Location"
        >
          <View style={styles.userMarkerContainer}>
            <View style={styles.userMarkerDot} />
            <View style={styles.userMarkerRing} />
          </View>
        </Marker>

        {/* Route Line */}
        <Polyline
          coordinates={[
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude, longitude }
          ]}
          strokeColor="#FF5722"
          strokeWidth={4}
          lineDashPattern={[0]}
        />
      </MapView>

      {/* Header Card */}
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            transform: [
              { translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -80]
              })}
            ]
          }
        ]}
      >
        <View style={styles.headerInner}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>FAST NUCES Lahore</Text>
            <TouchableOpacity onPress={toggleExpanded}>
              <Ionicons 
                name={expanded ? "chevron-down" : "chevron-up"} 
                size={24} 
                color="#555"
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.buildingInfo}>
              <View style={styles.iconContainer}>
                <Ionicons name="business" size={24} color="#3E92CC" />
              </View>
              <View>
                <Text style={styles.buildingName}>{building}</Text>
                <Text style={styles.distance}>
                  <Ionicons name="walk" size={16} color="#555" /> {distance ? distance.toFixed(2) : "Unknown"} meters
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Map Control Buttons */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapButton} onPress={centerOnUser}>
          <Ionicons name="locate" size={24} color="#3E92CC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mapButton} onPress={showRoute}>
          <Ionicons name="git-network" size={24} color="#3E92CC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mapButton} onPress={centerOnDestination}>
          <Ionicons name="flag" size={24} color="#3E92CC" />
        </TouchableOpacity>
      </View>

      {/* Bottom Panel */}
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', '#fff']}
        style={styles.bottomPanel}
      >
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="navigate" size={24} color="#3E92CC" />
            <Text style={styles.detailText}>Distance: {distance.toFixed(2)} m</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailItem}>
            <Ionicons name="time" size={24} color="#3E92CC" />
            <Text style={styles.detailText}>ETA: ~{Math.ceil(distance / 80)} min</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Navigation</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  headerInner: {
    padding: 16,
    paddingTop: 40, // Account for status bar
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buildingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(62, 146, 204, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: '#555',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -75 }],
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#DDD',
    marginHorizontal: 12,
  },
  startButton: {
    backgroundColor: '#3E92CC',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  userMarkerRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(66, 133, 244, 0.3)',
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
});

export default MapViewScreen;