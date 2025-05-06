import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from ultralytics import YOLO

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

# Load the classifier model
class Cast(Layer):
    def call(self, inp):
        return tf.cast(inp, tf.float32)

# Initialize models
classifier_model = load_model("model/my_image_classifier.h5", custom_objects={"Cast": Cast})
yolo_model = YOLO('model/yolov8n.pt')  # Using pre-trained YOLOv8 nano model

def classify_building(img, model):
    inp = cv2.resize(img, (224, 224))
    preds = model.predict(np.expand_dims(inp, 0))
    return int(np.argmax(preds, axis=1)[0])

def detect_building_bbox_yolo(img, yolo_model):
    # Convert image to RGB for YOLO (OpenCV uses BGR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Run YOLO prediction
    results = yolo_model(img_rgb)[0]  # Get first result
    h_img = img.shape[0]
    
    # Log all detections
    app.logger.debug("YOLO Detections:")
    for box, conf, cls in zip(results.boxes.xyxy, results.boxes.conf, results.boxes.cls):
        x1, y1, x2, y2 = box.cpu().numpy().astype(int)
        class_name = results.names[int(cls)]
        app.logger.debug(f"Confidence: {conf:.2f}, Box: ({x1}, {y1}, {x2}, {y2}), Class: {class_name}")
    
    # Find valid building bounding box
    valid = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
        w = x2 - x1
        h = y2 - y1
        # Relaxed constraints: height > 10% of image, bottom within bottom 50%
        if h > 0.1 * h_img and y2 >= 0.5 * h_img:
            valid.append((x1, y1, w, h))
    
    if not valid and len(results.boxes) > 0:
        # Fallback: Select box with highest confidence
        max_conf_idx = results.boxes.conf.argmax()
        x1, y1, x2, y2 = results.boxes.xyxy[max_conf_idx].cpu().numpy().astype(int)
        w = x2 - x1
        h = y2 - y1
        valid = [(x1, y1, w, h)]
    
    return valid[0] if valid else None

# Kept as fallback if YOLO fails
def detect_building_bbox_contour(img):
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
        area = w * h
        if h > 0.3 * h_img and y + h >= 0.7 * h_img and area > 0.1 * h_img * img.shape[1]:
            valid.append((x, y, w, h))
    if not valid:
        valid = [max([cv2.boundingRect(c) for c in cnts], key=lambda t: t[2] * t[3])]
    return valid[0]  # x, y, w, h

def compute_distance(base_y, img_h, camera_h):
    f_px = (FOCAL_LENGTH_MM / SENSOR_HEIGHT_MM) * img_h
    dy = base_y - img_h / 2
    app.logger.debug(f"Debug: img_h={img_h}, base_y={base_y}, dy={dy}, f_px={f_px}")
    return (f_px * camera_h) / dy if dy > 0 else None

# Helper function to generate dummy lat/long based on building data
def get_lat_lon(building_name):
    # Dummy function: You could replace this with a real algorithm based on landmarks and distances
    building_coordinates = {
        "Library": (31.481559857421292, 74.30378519760922),
        "New_Building": (31.4805443557776, 74.30417136303642), 
        "CS_Building": (31.481178398975324, 74.30288072461302),
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

        # Run the building classification
        idx = classify_building(img, classifier_model)
        label = idx_to_label[idx]

        # Try YOLO detection first
        bbox = detect_building_bbox_yolo(img, yolo_model)
        
        # Fall back to contour detection if YOLO fails
        if bbox is None:
            app.logger.info("YOLO failed to detect a valid building. Falling back to contour-based detection.")
            bbox = detect_building_bbox_contour(img)
        
        x, y, w, h = bbox
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
    print("Flask server is running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)