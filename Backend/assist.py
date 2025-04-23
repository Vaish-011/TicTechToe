
from flask import Flask, Response, jsonify, Blueprint, request
import cv2
import mediapipe as mp
import numpy as np

assist_bp = Blueprint("assist", __name__)

# MediaPipe models
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands

face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5)
pose = mp_pose.Pose(min_detection_confidence=0.5)
hands = mp_hands.Hands(min_detection_confidence=0.5, max_num_hands=2)

# Start webcam
cap = cv2.VideoCapture(0)

def analyze_posture_and_eye(frame):
    h, w, _ = frame.shape
    feedback = {
        "posture": "Good posture",
        "eye_contact": "Maintaining eye contact",
        "hand_gesture": "No clear gesture detected"
    }

    # Face & Pose Detection
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_results = face_mesh.process(rgb)
    pose_results = pose.process(rgb)
    hand_results = hands.process(rgb)

    # Posture Detection
    if pose_results.pose_landmarks:
        left_shoulder = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        shoulder_diff = abs(left_shoulder.y - right_shoulder.y)

        if shoulder_diff > 0.1:
            feedback["posture"] = "Sit straight – shoulders not aligned."

    # Eye Contact Detection
    if face_results.multi_face_landmarks:
        for face_landmarks in face_results.multi_face_landmarks:
            left_eye = [face_landmarks.landmark[i] for i in [33, 159, 145, 133]]
            top = np.linalg.norm(np.array([left_eye[1].x, left_eye[1].y]) - np.array([left_eye[2].x, left_eye[2].y]))
            width = np.linalg.norm(np.array([left_eye[0].x, left_eye[0].y]) - np.array([left_eye[3].x, left_eye[3].y]))
            ear = top / width if width != 0 else 0

            if ear < 0.2:
                feedback["eye_contact"] = "You seem distracted or drowsy – try focusing."

    # Hand Gesture Detection (basic logic: count fingers)
    if hand_results.multi_hand_landmarks:
        for hand_landmarks in hand_results.multi_hand_landmarks:
            fingers_up = 0
            tips_ids = [8, 12, 16, 20]

            for tip in tips_ids:
                if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[tip - 2].y:
                    fingers_up += 1

            if fingers_up == 5:
                feedback["hands"] = "🖐️ Open palm – confident and approachable gesture. Great!"
            elif fingers_up == 0:
                feedback["hands"] = "✊ Fist – may look tense or aggressive. Relax your hands."
            elif fingers_up == 2:
                feedback["hands"] = "✌️ Peace sign – too informal. Avoid in interviews."
            elif fingers_up == 1:
                feedback["hands"] = "👉 Pointing – may seem accusatory. Use open palm instead."
            elif fingers_up == 4:
                feedback["hands"] = "🖖 Four fingers up – unusual. Keep gestures natural and relaxed."
            else:
                feedback["hands"] = f"🖐️ {fingers_up} fingers up – ensure gestures are meaningful and calm."

    return feedback


@assist_bp.route('/video_feed')
def video_feed():
    def generate():
        while True:
            success, frame = cap.read()
            if not success:
                break
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@assist_bp.route('/gesture_feedback')
def get_feedback():
    success, frame = cap.read()
    if not success:
        return jsonify({'error': 'Camera frame not available'}), 500

    feedback = analyze_posture_and_eye(frame)
    return jsonify(feedback)
