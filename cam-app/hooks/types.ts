// Define a type for the route parameters
export type RootStackParamList = {
    Camera: undefined; // No parameters for the Camera screen
    MapViewScreen: { 
      building: string; // The building name
      latitude: number; // Latitude of the building
      longitude: number; // Longitude of the building
      distance: number; // Distance to the building
    };
  };