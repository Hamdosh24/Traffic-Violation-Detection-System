import json
import cv2
from util import (
    get_vechicles_capture,
    get_frontGlass_licensePlate_capture,
    get_plate_number_enhanced,
    get_vechicle_speed,
    get_red_light_violation
)

class CameraFeed:
    def __init__(self, source, speed_limit=60, red_light_line_frac=0.8, speed_line1_frac=1/3, speed_line2_frac=2/3):
        self.source = source
        self.cap = cv2.VideoCapture(source)
        self.speed_limit = speed_limit
        self.vehicle_times = {}
        self.violations = {}
        self.plate_numbers = {}
        self.frame_idx = 0
        self.red_light_line_frac = red_light_line_frac
        self.speed_line1_frac = speed_line1_frac
        self.speed_line2_frac = speed_line2_frac
        self.light_state = 'green'  # Default, can be changed externally

    def set_light_state(self, state):
        if state in ['red', 'yellow', 'green']:
            self.light_state = state

    def process_frame(self, frame):
        detections = get_vechicles_capture(frame)
        height, width, _ = frame.shape

        # License Plate & Windshield (first, to filter vehicles)
        valid_vehicle_ids = set()
        if detections is not None and hasattr(detections, 'boxes'):
            boxes = detections.boxes
            if boxes is not None and boxes.id is not None:
                for i in range(len(boxes.id)):
                    vehicle_id = int(boxes.id[i].item())
                    x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    vehicle_img = frame[y1:y2, x1:x2]
                    # Only process if vehicle image is clear (large enough)
                    if vehicle_img.shape[0] * vehicle_img.shape[1] < 11000:
                        continue
                    fg_captures = get_frontGlass_licensePlate_capture(vehicle_img)
                    found_plate = False
                    if fg_captures:
                        for cls_id, box in fg_captures.items():
                            x1p, y1p, x2p, y2p = box['x1'], box['y1'], box['x2'], box['y2']
                            license_plate_img = vehicle_img[y1p:y2p, x1p:x2p]
                            plate_number, _ = get_plate_number_enhanced(license_plate_img)
                            if plate_number:
                                self.plate_numbers[vehicle_id] = plate_number
                                valid_vehicle_ids.add(vehicle_id)
                                found_plate = True
                                break  # Only use the first detected plate
                    if not found_plate:
                        continue  # Skip further processing for this vehicle

        # Speed Violation (only for vehicles with a plate)
        filtered_vehicle_times = {vid: info for vid, info in self.vehicle_times.items() if vid in valid_vehicle_ids}
        self.vehicle_times = get_vechicle_speed(
            detections, self.frame_idx, height, filtered_vehicle_times,
            line1_frac=self.speed_line1_frac, line2_frac=self.speed_line2_frac
        )
        for vid, info in self.vehicle_times.items():
            plate = self.plate_numbers.get(vid)
            if not plate:
                continue
            if 'speed' in info and info['speed'] > self.speed_limit:
                self.log_violation(plate, 'speeding', info['speed'])

        # Red Light Violation (only for vehicles with a plate)
        line_y = int(height * self.red_light_line_frac)
        self.vehicle_times = get_red_light_violation(
            detections, self.frame_idx, height, self.vehicle_times, line_y, self.light_state
        )
        for vid, info in self.vehicle_times.items():
            plate = self.plate_numbers.get(vid)
            if not plate:
                continue
            if info.get('violation', False):
                self.log_violation(plate, 'red_light', info.get('violation_frame'))

        self.frame_idx += 1

    def log_violation(self, plate_number, violation_type, value=None):
        if plate_number not in self.violations:
            self.violations[plate_number] = []
        if violation_type not in [v[0] for v in self.violations[plate_number]]:
            self.violations[plate_number].append((violation_type, value))

    def run(self, light_state_source=None, output_path='violations_summary.json'):
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            # Update light state from external source if provided
            if light_state_source is not None:
                new_state = light_state_source()
                self.set_light_state(new_state)
            else:
                # For demo: allow user to change light state with keys
                key = cv2.waitKey(1) & 0xFF
                if key == ord('r'):
                    self.set_light_state('red')
                elif key == ord('y'):
                    self.set_light_state('yellow')
                elif key == ord('g'):
                    self.set_light_state('green')
                elif key == ord('q'):
                    break
            self.process_frame(frame)

            # Draw lines for red light and speed detection
            height, width, _ = frame.shape
            # Red light line
            line_y = int(height * self.red_light_line_frac)
            if self.light_state == 'red':
                line_color = (0, 0, 255)
            elif self.light_state == 'yellow':
                line_color = (0, 255, 255)
            else:
                line_color = (0, 255, 0)
            cv2.line(frame, (0, line_y), (width, line_y), line_color, 3)
            cv2.putText(frame, f'Light: {self.light_state.upper()}', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, line_color, 1)
            # Speed detection lines
            speed_line1_y = int(height * self.speed_line1_frac)
            speed_line2_y = int(height * self.speed_line2_frac)
            cv2.line(frame, (0, speed_line1_y), (width, speed_line1_y), (255, 0, 0), 1)  # Blue
            cv2.line(frame, (0, speed_line2_y), (width, speed_line2_y), (0, 255, 255), 1)  # Yellow

            # Show the stream
            cv2.imshow('Camera Stream', frame)
            # Write/update the JSON summary after each frame
            self.write_summary_json(output_path)
        self.cap.release()
        cv2.destroyAllWindows()
        print(f"Summary written to {output_path}")

    def write_summary_json(self, output_path='violations_summary.json'):
        summary = {}
        for vid, violations in self.violations.items():
            plate = self.plate_numbers.get(vid)
            key = plate if plate else f'vehicle_{vid}'
            summary[key] = []
            for vtype, value in violations:
                # For red_light, value is frame index (time), for speeding it's speed
                entry = {'violation': vtype}
                if vtype == 'red_light':
                    entry['frame'] = value
                elif vtype == 'speeding':
                    entry['speed'] = value
                summary[key].append(entry)
        with open(output_path, 'w') as f:
            json.dump(summary, f, indent=2)
        print(f"Summary written to {output_path}")

if __name__ == '__main__':
    # Example: change the line positions as needed
    cam1 = CameraFeed(
        'samples/carsOnHighway.mp4',
        speed_limit=60,
        red_light_line_frac=0.8,      # 80% of frame height
        speed_line1_frac=0.3,         # 30% of frame height
        speed_line2_frac=0.6          # 60% of frame height
    )
    # For demo: change light state with keys (r/y/g), or pass a function to cam1.run(light_state_source=...) for external control
    cam1.run()