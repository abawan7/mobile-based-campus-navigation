import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configurations
building_heights = {
    "Library": 6.0,
    "CS_Building": 7.5,
    "Civil": 9.0,
    "EnM": 7.5,
    "New_Building": 13.5,
    "Admin_Block": 6.0
}
FOCAL_LENGTH_MM = 6.86
SENSOR_HEIGHT_MM = 5.6
IMAGE_HEIGHT_PX = 3024
CAMERA_HEIGHT_M = 1.6  # camera lens height above ground (m)

# Mapping indices to building names
idx_to_label = ["Library", "CS_Building", "Civil", "EnM", "New_Building", "Admin_Block"]
idx_to_height = [building_heights[l] for l in idx_to_label]

# Flask setup
app = Flask(__name__)

CORS(app)


# Setting up logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Load the trained model
class Cast(Layer):
    def call(self, inp):
        return tf.cast(inp, tf.float32)

model = load_model("model/my_image_classifier.h5", custom_objects={"Cast": Cast})

def classify_building(img, model):
    inp = cv2.resize(img, (224, 224))
    preds = model.predict(np.expand_dims(inp, 0))
    return int(np.argmax(preds, axis=1)[0])

def detect_building_bbox(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 25))
    closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)
    cnts, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    h_img = img.shape[0]
    valid = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if h > 0.4 * h_img and y + h >= 0.9 * h_img:
            valid.append((x, y, w, h))
    if not valid:
        valid = [max([cv2.boundingRect(c) for c in cnts], key=lambda t: t[3])]
    return valid[0]  # x, y, w, h

def compute_distance(base_y, img_h, camera_h):
    f_px = (FOCAL_LENGTH_MM / SENSOR_HEIGHT_MM) * img_h
    dy = base_y - img_h / 2
    return (f_px * camera_h) / dy if dy > 0 else None

# Helper function to generate dummy lat/long based on building data
def get_lat_lon(building_name):
    # Dummy function: You could replace this with a real algorithm based on landmarks and distances
    building_coordinates = {
        "Library": (31.481559857421292, 74.30378519760922),
        "NB": (31.4805443557776, 74.30417136303642), 
        "CS": (31.481178398975324, 74.30288072461302),
        "Civil": (31.481982241525063, 74.30366007617641),
        "EnM": (31.48107824241253, 74.30332310850635),
        "Admin_Block": (31.481067391919904, 74.3030048329072),
    }
    return building_coordinates.get(building_name, (40.0, -73.0))  # Default to some coordinates

@app.route('/detect', methods=['POST'])
def detect_building_and_distance():
    app.logger.info(f"Received image")

    # Ensure the 'image' field exists in the request
    if 'image' not in request.files:
        app.logger.error("No image part in the request")
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']

    # Log the file name, size, and content type to debug
    app.logger.info(f"Received file name: {file.filename}")
    app.logger.info(f"Received file size: {len(file.read())} bytes")
    app.logger.info(f"Received file content type: {file.content_type}")

    if file.filename == '':
        app.logger.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Reset file pointer after reading its size for further processing
        file.seek(0)

        # Check that the file is not empty
        if len(file.read()) == 0:
            app.logger.error("The file is empty.")
            return jsonify({'error': 'The file is empty.'}), 400

        # Reset again for image processing
        file.seek(0)

        # Read the image as a binary stream and convert to numpy array using OpenCV
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            app.logger.error("Failed to decode image")
            raise ValueError("Failed to decode image")

        # Log the image shape for debugging
        app.logger.info(f"Image shape: {img.shape}")

        # Run the building detection logic
        idx = classify_building(img, model)
        label = idx_to_label[idx]

        # Detect bounding box of the building
        x, y, w, h = detect_building_bbox(img)
        base_y = y + h

        # Compute the distance
        dist_m = compute_distance(base_y, img.shape[0], CAMERA_HEIGHT_M)

        # Get latitude and longitude of the building
        latitude, longitude = get_lat_lon(label)

        # Log successful detection
        app.logger.info(f"Detected building: {label}, Distance: {dist_m}, Latitude: {latitude}, Longitude: {longitude}")

        return jsonify({
            'building': label,
            'distance': dist_m,
            'latitude': latitude,
            'longitude': longitude
        })
    
    except ValueError as e:
        app.logger.error(f"ValueError: {str(e)}")
        return jsonify({'error': f'ValueError: {str(e)}'}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': f'Error processing the image: {str(e)}'}), 500

if __name__ == '__main__':
    print("Flask server is running on http://localhost:5000")  # Change port to 5001
    app.run(host='0.0.0.0', port=5001, debug=True)

