from ultralytics import YOLO
import easyocr as ocr
import cv2
import numpy as np


# Load the models

# YOLO for vechicle detection
Vechicle_detector = YOLO("models/yolo11n.pt")
# YOLO for front glass license plate detection
FrontGlass_licensePlate_detector = YOLO('models/best.pt')
# EasyOCR for license plate numbers detection
reader = ocr.Reader(['en'], gpu=False)


# Vechicle classes for YOLO
Vechicle_classes = [2, 3, 5, 7]
# Allowlist for EasyOCR
allowlist = '0123456789'


def get_vechicles_capture(frame):
    '''
    Get the vechicle capture from the frame
    '''
    
    Vechicles = Vechicle_detector.track(frame, classes=Vechicle_classes, verbose=False, persist=True, conf=0.35)
    
    return Vechicles[0]

def get_frontGlass_licensePlate_capture(vechicle_capture):
    '''
    Get the front glass license plate capture from the vechicle_capture
    '''
    frontGlass_licensePlate_captures = {}
    results = FrontGlass_licensePlate_detector.predict(vechicle_capture, conf=0.25, iou=0.7, verbose=False)
    for result in results:
        boxes = result.boxes
        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                frontGlass_licensePlate_captures[box.cls[0].item()] = {"x1": int(x1),
                                        "y1": int(y1),
                                        "x2": int(x2),
                                        "y2": int(y2)}
    return frontGlass_licensePlate_captures

def get_plate_number_enhanced(license_plate_capture):
    '''
    Enhanced version of get_plate_number with multiple preprocessing techniques
    Optimized for single license plate detection
    '''
    
    # Convert to grayscale
    gray_capture = cv2.cvtColor(license_plate_capture, cv2.COLOR_BGR2GRAY)
    
    # List to store all detected plate numbers
    all_results = []    
    
    # Method 1: Original image
    results1 = reader.readtext(gray_capture, allowlist=allowlist)
    all_results.extend(results1)
    
    # Method 2: Gaussian blur + adaptive threshold
    blurred = cv2.GaussianBlur(gray_capture, (5, 5), 0)
    thresh1 = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    results2 = reader.readtext(thresh1)
    all_results.extend(results2)
    
    # Method 3: Bilateral filter for edge preservation
    bilateral = cv2.bilateralFilter(gray_capture, 9, 75, 75)
    thresh2 = cv2.adaptiveThreshold(bilateral, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
    results3 = reader.readtext(thresh2)
    all_results.extend(results3)
    
    # Method 4: Morphological operations
    kernel = np.ones((2, 2), np.uint8)
    morph = cv2.morphologyEx(gray_capture, cv2.MORPH_CLOSE, kernel)
    results4 = reader.readtext(morph)
    all_results.extend(results4)
    
    # Method 5: Histogram equalization
    equalized = cv2.equalizeHist(gray_capture)
    results5 = reader.readtext(equalized)
    all_results.extend(results5)
    
    # Find the best single result
    best_plate = None
    best_confidence = 0.0
    
    for (bbox, text, confidence) in all_results:
        # Ensure confidence is a float
        confidence = float(confidence)
        
        # Clean the text
        cleaned_text = ''.join(char for char in text if char.isalnum())
        
        # Calculate alphanumeric count
        alphanumeric_count = sum(1 for char in text if char.isalnum())
        
        # License plate validation rules
        if (len(cleaned_text) >= 3 and len(cleaned_text) <= 10 and 
            confidence > 0.3 and  # Minimum confidence threshold
            alphanumeric_count >= len(text) * 0.7):
            
            # Convert to uppercase
            final_text = cleaned_text.upper()
            
            # Keep the result with highest confidence
            if confidence > best_confidence:
                best_plate = final_text
                best_confidence = confidence
    
    return best_plate, best_confidence

def get_vechicle_speed(
    detections,
    frame_idx,
    frame_height,
    vehicle_times,
    real_distance_m=10,
    line1_frac=1/3,
    line2_frac=2/3,
    fps=30
):
    '''
    Update vehicle entry/exit times and estimate speed.

    Args:
        detections: YOLO detections for the current frame (should have .boxes, .boxes.id, .boxes.xyxy).
        frame_idx: Current frame index.
        frame_height: Height of the frame being processed.
        vehicle_times: Dictionary to persist vehicle entry/exit/speed info.
        real_distance_m: Real-world distance between the two lines (meters).
        line1_frac: Fraction of frame height for the first line.
        line2_frac: Fraction of frame height for the second line.
        fps: Video FPS.

    Returns:
        vehicle_times: Updated dictionary with speed estimates.
    '''
    line1_y = int(frame_height * line1_frac)
    line2_y = int(frame_height * line2_frac)

    if detections is not None and hasattr(detections, 'boxes'):
        boxes = detections.boxes
        if boxes is not None and boxes.id is not None:
            for i in range(len(boxes.id)):
                vehicle_id = int(boxes.id[i].item())
                x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                center_y = int((y1 + y2) / 2)

                # Check if vehicle crosses line 1
                if center_y > line1_y and vehicle_id not in vehicle_times:
                    vehicle_times[vehicle_id] = {'entry': frame_idx}

                # Check if vehicle crosses line 2
                if vehicle_id in vehicle_times and 'exit' not in vehicle_times[vehicle_id]:
                    if center_y > line2_y:
                        vehicle_times[vehicle_id]['exit'] = frame_idx
                        # Calculate speed
                        frames_taken = vehicle_times[vehicle_id]['exit'] - vehicle_times[vehicle_id]['entry']
                        time_taken = frames_taken / fps
                        if time_taken > 0:
                            speed_mps = real_distance_m / time_taken
                            speed_kph = speed_mps * 3.6
                            vehicle_times[vehicle_id]['speed'] = speed_kph
                        else:
                            vehicle_times[vehicle_id]['speed'] = 0
    return vehicle_times

def get_red_light_violation(detections, frame_idx, frame_height, vehicle_times, line_y, light_state):
    '''
    Track vehicles that cross the stop line and record violations if the light is red.
    Args:
        detections: YOLO detections for the current frame (should have .boxes, .boxes.id, .boxes.xyxy).
        frame_idx: Current frame index.
        frame_height: Height of the frame being processed.
        vehicle_times: Dictionary to persist vehicle crossing/violation info.
        line_y: Y-coordinate of the stop line.
        light_state: Current state of the light ('red', 'yellow', 'green').
    Returns:
        vehicle_times: Updated dictionary with crossing and violation info.
    '''
    if detections is not None and hasattr(detections, 'boxes'):
        boxes = detections.boxes
        if boxes is not None and boxes.id is not None:
            for i in range(len(boxes.id)):
                vehicle_id = int(boxes.id[i].item())
                x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                center_y = int((y1 + y2) / 2)

                # If vehicle crosses the line (from above to below)
                if center_y > line_y:
                    if vehicle_id not in vehicle_times:
                        vehicle_times[vehicle_id] = {'crossed': frame_idx}
                        if light_state == 'red':
                            vehicle_times[vehicle_id]['violation'] = True
                            vehicle_times[vehicle_id]['violation_frame'] = frame_idx
                        else:
                            vehicle_times[vehicle_id]['violation'] = False
                    # If already crossed, do not overwrite violation status
    return vehicle_times