import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

// Props interface for the data coming from the backend
interface MapViewProps {
  building: string;
  distance: number;
  latitude: number; 
  longitude: number; 
}

const MapViewScreen: React.FC<MapViewProps> = ({ building, distance, latitude, longitude }) => {
  const [userLocation, setUserLocation] = useState({
    latitude: 31.481370524750606,
    longitude: 74.30352902161547,
  });
  
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

  const centerLatitude = (userLocation.latitude + latitude) / 2;
  const centerLongitude = (userLocation.longitude + longitude) / 2;
  
  const latDelta = Math.max(0.005, Math.abs(userLocation.latitude - latitude) * 2.5);
  const longDelta = Math.max(0.005, Math.abs(userLocation.longitude - longitude) * 2.5);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>FAST NUCES Lahore Campus</Text>
        <View style={styles.infoCard}>
          <Text style={styles.buildingName}>{building}</Text>
          <Text style={styles.distance}>{distance ? distance.toFixed(2) : "Unknown"} meters away</Text>
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: centerLatitude, 
          longitude: centerLongitude,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        }}
      >
        {buildings.map((b, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: b.latitude, longitude: b.longitude }}
            title={b.name}
            pinColor={b.name === building ? "blue" : "yellow"} 
          />
        ))}

        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={`Detected: ${building}`}
          description={`${distance ? distance.toFixed(2) : "Unknown"} meters away`}
          pinColor="blue"
        />
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="Your Location"
          pinColor="red"
        />

        <Polyline
          coordinates={[
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: latitude, longitude: longitude }
          ]}
          strokeColor="#FF0000"
          strokeWidth={2}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  buildingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  distance: {
    fontSize: 16,
    color: '#555',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});

export default MapViewScreen;