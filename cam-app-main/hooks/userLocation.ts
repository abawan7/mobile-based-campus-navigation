import { useState } from 'react';
import * as Location from 'expo-location';

// Define types for location state (latitude and longitude can be either number or null)
interface LocationData {
  latitude: number | null;
  longitude: number | null;
  errorMsg: string | null;
}

const useLocation = () => {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    errorMsg: null,
  });

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({
          latitude: null,
          longitude: null,
          errorMsg: 'Permission denied',
        });
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        errorMsg: null,
      });
    } catch (error) {
      setLocation({
        latitude: null,
        longitude: null,
        errorMsg: 'Error getting location',
      });
    }
  };

  return { getUserLocation, location };
};

export default useLocation;
