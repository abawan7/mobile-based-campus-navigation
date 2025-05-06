import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { useCameraPermissions, CameraView, CameraType } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, StatusBar, Dimensions } from 'react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; // Changed to Ionicons for a more modern look
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/hooks/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import MapViewScreen from '@/components/Map';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient effect (you'll need to install this package)
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Camera() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  // Tab bar height (from _layout.tsx) + bottom margin
  const TAB_BAR_HEIGHT = 64 + 20;

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapData, setMapData] = useState({
    building: "",
    latitude: 0,
    longitude: 0,
    distance: 0
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to access the camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  }; 

  const handleUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need access to your gallery to upload photos.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, 
      base64: true,
    });
  
    if (!result.canceled && result.assets && result.assets[0]) {
      const pickedPhoto = {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        name: result.assets[0].fileName,
      };
      setPhoto(pickedPhoto);
    } else {
      console.log('No photo selected');
    }
  };
  
  const handleRetakePhoto = () => setPhoto(null);

  const resizeImage = async (uri: string) => {
    try {
      const resizedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 1024, height: 1024 } }],
        { format: SaveFormat.JPEG, compress: 0.8 }
      );
      return resizedImage.uri;
    } catch (error) {
      console.error("Error resizing image:", error);
      throw error;
    }
  };

  const handleEstimate = async () => {
    if (!photo || !photo.uri) {
        Alert.alert("No photo", "Please capture or upload a photo first.");
        return;
    }

    try {
        const formData = new FormData();
        const uri = photo.uri;
        const filename = uri.split('/').pop() || 'image.jpg';
        
        formData.append('image', {
            uri,
            type: 'image/jpeg',
            name: filename,
        } as any);
        
        console.log("FormData prepared with image");

        const serverResponse = await fetch('http://192.168.100.88:5001/detect', {
            method: 'POST',
            body: formData,
        });

        const responseText = await serverResponse.text();
        console.log("Response from server:", responseText);

        if (responseText.trim() === '') {
            throw new Error('Empty response from the server');
        }

        if (!serverResponse.ok) {
            throw new Error(`Error: ${responseText || "Failed to fetch data"}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
            console.log("Parsed JSON data:", data);
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            throw new Error("Failed to parse JSON response");
        }

        const dynamicData = {
            building: data.building,
            latitude: data.latitude,
            longitude: data.longitude,
            distance: data.distance,
        };

        setShowMap(true);
        setMapData(dynamicData);

    } catch (error) {
        console.error("Unexpected error:", error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error occurred';
            
        Alert.alert("Error", "Something went wrong while processing the image: " + errorMessage);
    }
  };

  if (showMap) {
    return <MapViewScreen {...mapData} />;
  }

  if (photo) {
    return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} handleEstimate={handleEstimate} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {/* Camera Overlays */}
        <View style={styles.cameraOverlay}>
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.topBarButton}
              onPress={() => navigation.goBack()} // Add navigation if needed
            >
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBarButton}>
              <Ionicons name="settings" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bottom Controls - Positioned to stay above tab bar */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={[
            styles.controlsContainer,
            { 
              paddingBottom: TAB_BAR_HEIGHT + 20, // Add extra padding to keep controls above tab bar
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0
            }
          ]}
        >
          <View style={styles.buttonContainer}>
            {/* Toggle Camera Button */}
            <TouchableOpacity
              style={styles.sideButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>

            {/* Take Photo Button */}
            <TouchableOpacity
              style={styles.takePhotoButton}
              onPress={handleTakePhoto}
            >
              <View style={styles.takePhotoInnerCircle} />
            </TouchableOpacity>

            {/* Upload Button */}
            <TouchableOpacity
              style={styles.sideButton}
              onPress={handleUploadPhoto}
            >
              <Ionicons name="images" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#3E92CC',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraOverlay: {
    flex: 1,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topBarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlsContainer: {
    width: '100%',
    paddingVertical: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(80, 80, 80, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  takePhotoInnerCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#3E92CC', // Modern blue color
  },
});