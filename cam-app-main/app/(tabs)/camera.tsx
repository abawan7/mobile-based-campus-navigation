import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons'; // For camera icons
import { useNavigation } from '@react-navigation/native';  // Corrected the use of useNavigation hook
import { RootStackParamList } from '@/hooks/types'; // Fixed the import path
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import MapViewScreen from '@/components/Map';

export default function Camera() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();  // Correct placement of the hook

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [showMap, setShowMap] = useState(false); // State to control map visibility
  const [mapData, setMapData] = useState({
    building: "",
    latitude: 0,
    longitude: 0,
    distance: 0
  });

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
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
    // Request permissions to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need access to your gallery to upload photos.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use the updated MediaTypeOptions
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
  
  
    // Check if a photo was selected
    if (!result.canceled && result.assets && result.assets[0]) {
      const pickedPhoto = {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        name: result.assets[0].fileName,
      };
      setPhoto(pickedPhoto); // Set the photo state with the URI for previewing
    } else {
      console.log('No photo selected');
    }
  };
  
  const handleRetakePhoto = () => setPhoto(null);


  const resizeImage = async (uri: string) => {
    try {
      // Resize the image to 1024x1024 (you can adjust this as needed)
      const resizedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 1024, height: 1024 } }],
        { format: SaveFormat.JPEG, compress: 0.8 } // Adjust compression level if needed
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

        // Get the URI of the photo
        const uri = photo.uri;
        
        // Extract filename from URI or use a default one
        const filename = uri.split('/').pop() || 'image.jpg';
        
        // For React Native, we need to use the correct format that aligns with FormData's expectations
        // This works because React Native's FormData implementation accepts this format
        // even though TypeScript doesn't recognize it
        formData.append('image', {
            uri,
            type: 'image/jpeg',
            name: filename,
        } as any); // Use type assertion to bypass TypeScript's type checking
        
        console.log("FormData prepared with image");

        // Send the formData in the API request
        const serverResponse = await fetch('http://192.168.0.100:5001/detect', {
            method: 'POST',
            body: formData,
            headers: {
                // Remove 'Content-Type' header - React Native will set it automatically
                // with the correct boundary for multipart/form-data
            },
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
        
        // Safely extract error message
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error occurred';
            
        Alert.alert("Error", "Something went wrong while processing the image: " + errorMessage);
    }
};

  if (showMap) {
    // Render MapViewScreen with the dynamic data
    return <MapViewScreen {...mapData} />;
  }



  if (photo) {
    return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} handleEstimate={handleEstimate} />;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* Toggle Camera Facing Button */}
          <TouchableOpacity
            style={[styles.button, styles.iconButton]}
            onPress={toggleCameraFacing}
          >
            <FontAwesome5 name='sync' size={35} color='white' />
          </TouchableOpacity>

          {/* Take Photo Button */}
          <TouchableOpacity
            style={[styles.button, styles.iconButton, styles.takePhotoButton]}
            onPress={handleTakePhoto}
          >
            <FontAwesome5 name='camera' size={35} color='white' />
          </TouchableOpacity>

          {/* Upload Button */}
          <TouchableOpacity
            style={[styles.button, styles.iconButton]}
            onPress={handleUploadPhoto}
          >
            <FontAwesome5 name='cloud-upload-alt' size={35} color='white' />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    padding: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#444', // Dark background color for the button
    padding: 15,
    borderRadius: 50, // Rounded edges
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 10, // Add shadow for elevation effect
  },
  iconButton: {
    backgroundColor: '#796AD2', // Icon button background color
  },
  takePhotoButton: {
    backgroundColor: '#F5C100', // Yellow color for the Take Photo button
  },
});
