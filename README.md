# Mobile-Based Campus Navigation Assistant

[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![React Native Maps](https://img.shields.io/badge/React_Native_Maps-1E90FF?style=flat&logo=react&logoColor=white)](https://github.com/react-native-maps/react-native-maps)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)


## 📱 Project Overview

The Mobile-Based Campus Navigation Assistant is an innovative system designed to estimate a user's location on Fast NUCES **without using GPS**. Instead, it relies on image-based landmark recognition and distance estimation. The project includes a mobile app that identifies campus buildings and determines the user's position based on captured images.

## ✨ Features

- **Landmark Recognition**: Uses a pretrained model to recognize buildings on the campus
- **Distance Estimation**: Calculates the distance between the user and landmarks based on visual cues
- **Localization**: Displays the user's position dynamically on a digital campus map

## 🛠️ Technologies Used

- **Backend**: Flask
- **Frontend**: React Native (Expo)
- **Maps**: React Native Maps
- **Image Recognition**: TensorFlow/Keras or PyTorch
- **Image Processing**: OpenCV, NumPy, Matplotlib
- **Geolocation**: Expo Location API

## 🚀 Project Phases

### Phase 1: Image Collection & Dataset Preparation
- **Objective**: Build a dataset of campus landmarks with properly annotated images
- **Tools Used**: Mobile cameras, LabelImg, Python (Pandas)
- **Deliverables**: 
  - Images in `images/` folder
  - Annotations in `annotations/annotations.csv`
  - A `dataset_description.txt` file with details

### Phase 2: Landmark Recognition Model
- **Objective**: Train a pretrained CNN model (e.g., MobileNet, ResNet, VGG16) to recognize campus buildings
- **Tools Used**: TensorFlow/Keras or PyTorch, OpenCV, Google Colab
- **Deliverables**:
  - Trained model file (.h5, .pth, or .tflite)
  - Preprocessing, training, and inference code (.ipynb)
  - Evaluation results (metrics & confusion matrix)
  - A report (PDF) summarizing model details
  - A ReadMe file explaining how to run the model

### Phase 3: Distance Estimation
- **Objective**: Estimate the distance from the user's position to a detected landmark
- **Tools Used**: OpenCV, NumPy, SciPy, Matplotlib
- **Deliverables**:
  - Distance estimation logic implemented and tested
  - Visualization of distance estimations

### Phase 4: Localization on Campus Map & Mobile App Development
- **Objective**: Display the user's estimated location on a digital campus map within the mobile app
- **Tools Used**: Flask/Django (Backend API), React Native/Kivy (Mobile App), React Native Maps, Matplotlib/Leaflet.js
- **Deliverables**:
  - Mobile app for capturing images and estimating location
  - Backend API for serving model predictions
  - Final version of the app with user location displayed dynamically on the campus map

## 🔧 Setup Instructions

### 1. Clone the repository

`git clone https://github.com/abawan7/mobile-based-campus-navigation.git
cd mobile-based-campus-navigation`

### 2\. Install Backend Dependencies

Navigate to the backend folder and install the required Python dependencies:

bash

Copy

`cd backend
pip install -r requirements.txt`

-   Flask

-   OpenCV

-   TensorFlow or PyTorch

-   NumPy

-   SciPy

### 3\. Install Frontend Dependencies

Navigate to the frontend folder and install the required dependencies for React Native:

bash

Copy

`cd frontend
npm install`

-   Expo

-   React Native Maps

-   React Navigation

### 4\. Running the Application

#### Backend (Flask)

To run the Flask backend, use the following command:

bash

Copy

`cd backend
python app.py`

The Flask app will run on `http://127.0.0.1:5000`.

#### Frontend (React Native)

To run the React Native app in Expo, use the following command:

bash

Copy

`cd frontend
expo start`

This will start the Expo development server, and you can scan the QR code to open the app on your mobile device.

* * * * *

Project Structure
-----------------

### Backend Folder

plaintext

Copy

`/backend
  ├── app.py                 # Main Flask application file
  ├── model                  # Pretrained model and related code
  ├── requirements.txt       # Python dependencies
  └── utils.py               # Utility functions (image processing, distance estimation)`

### Frontend Folder

plaintext

Copy

`/frontend
  ├── App.js                 # Main entry point of the React Native app
  ├── components/            # Reusable UI components (buttons, input fields, etc.)
  ├── screens/               # Screens for various app views (MapView, Image Capture)
  ├── assets/                # Images, icons, and other static assets
  └── app.json               # Expo configuration`

* * * * *

Evaluation Criteria
-------------------

Each phase will be evaluated based on the following:

-   **Dataset Completeness & Annotation Accuracy** (Phase 1)

-   **Recognition Model Performance** (Phase 2)

-   **Distance Estimation Accuracy** (Phase 3)

-   **Localization Accuracy & Usability of Mobile App** (Phase 4)

* * * * *

Expected Outcome
----------------

By the end of the project, you will have developed a fully functional navigation system that:

-   Recognizes campus buildings from images.

-   Estimates distances to known landmarks.

-   Determines the user's location and displays it on a mobile app.

* * * * *

Contributions
-------------

If you want to contribute to this project, please fork the repository and create a pull request with the changes you've made. Make sure to provide a clear description of your modifications and include tests where applicable.
