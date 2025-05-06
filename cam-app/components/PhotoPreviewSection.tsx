import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Text, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Constant for tab bar height from _layout.tsx
const TAB_BAR_HEIGHT = 64 + 20; // height + bottom margin

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
    handleEstimate
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    handleEstimate: () => void;
}) => {
    // Get safe area insets
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header with back button */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleRetakePhoto}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Preview</Text>
                <View style={styles.placeholder} />
            </SafeAreaView>
            
            {/* Image preview */}
            <View style={styles.imageContainer}>
                <Image
                    style={styles.previewImage}
                    source={{ uri: photo?.uri }}
                />
                
                {/* Overlay gradient at the bottom of the image */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
                    style={styles.imageOverlay}
                />
            </View>
            
            {/* Action buttons - positioned to stay above tab bar */}
            <View style={[
                styles.controlsContainer,
                { paddingBottom: TAB_BAR_HEIGHT + 10 } // Add padding to account for tab bar
            ]}>
                <View style={styles.actionText}>
                    <Text style={styles.infoText}>Ready to locate this building?</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    {/* Retake Button */}
                    <TouchableOpacity 
                        style={styles.retakeButton} 
                        onPress={handleRetakePhoto}
                    >
                        <Ionicons name="refresh-outline" size={22} color="#FFF" />
                        <Text style={styles.buttonText}>Retake</Text>
                    </TouchableOpacity>
                    
                    {/* Estimate Button */}
                    <TouchableOpacity 
                        style={styles.estimateButton} 
                        onPress={handleEstimate}
                    >
                        <Ionicons name="location" size={22} color="#FFF" />
                        <Text style={styles.buttonText}>Locate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(80,80,80,0.5)',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    placeholder: {
        width: 40, // Ensures the title stays centered
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150, // Height of the gradient overlay
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    actionText: {
        marginBottom: 20,
        alignItems: 'center',
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    retakeButton: {
        backgroundColor: '#444',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
        elevation: 3,
    },
    estimateButton: {
        backgroundColor: '#3E92CC', // Changed to blue to make it stand out
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PhotoPreviewSection;