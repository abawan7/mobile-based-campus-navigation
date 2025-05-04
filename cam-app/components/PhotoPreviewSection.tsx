import { Fontisto, AntDesign } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
    handleEstimate // Added handleEstimate as a prop
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    handleEstimate: () => void;
}) => (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        {/* Image takes full width and height */}
        <Image
          style={styles.previewContainer}
          source={{ uri: photo?.uri }} 
        />
        
        {/* Buttons container */}
        <View style={styles.buttonContainer}>
          {/* Retake Button (Trash Icon) */}
          <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={handleRetakePhoto}>
            <Fontisto name="trash" size={25} color="white" />
          </TouchableOpacity>

          {/* Estimate Button with Logo */}
          <TouchableOpacity style={[styles.button, styles.estimateButton]} onPress={handleEstimate}>
            {/* Replace the Text component with an Image (Logo) */}
            <AntDesign name="arrowright" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', 
        padding: 20,
    },
    box: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        overflow: 'hidden', 
        backgroundColor: 'white', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10, 
        position: 'relative', 
    },
    previewContainer: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
    },
    buttonContainer: {
        position: 'absolute', 
        bottom: 20, // Keep buttons at the bottom of the screen
        left: '50%',
        transform: [{ translateX: -100 }], // Center the buttons horizontally
        flexDirection: 'row', // Arrange buttons side by side
        justifyContent: 'center', 
        alignItems: 'center',
    },
    button: {
        padding: 15,
        borderRadius: 50, 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    retakeButton: {
        backgroundColor: '#FF6347', // Tomato color for trash button
        marginRight: 30,
        marginLeft: 30 // Add space between buttons
    },
    estimateButton: {
        backgroundColor: '#796AD2', // Purple color for estimate button
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 25, // Set the width of the logo
        height: 25, // Set the height of the logo
        marginRight: 10, // Add space between logo and the arrow icon
    }
});

export default PhotoPreviewSection;
