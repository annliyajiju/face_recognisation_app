import cv2
from insightface.app import FaceAnalysis

class FaceDetector:
    def __init__(self):
        self.app = FaceAnalysis(name="buffalo_l")
        self.app.prepare(ctx_id=0, det_size=(640, 640))

    def detect_face(self, image_path):
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Image not found")

        faces = self.app.get(image)

        if len(faces) == 0:
            raise ValueError("No face detected")

        if len(faces) > 1:
            raise ValueError("Multiple faces detected")

        return faces[0]

    def crop_face(self, image_path):
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Image not found")

        face = self.detect_face(image_path)
        x1, y1, x2, y2 = [int(coord) for coord in face.bbox]
        cropped = image[y1:y2, x1:x2]

        if cropped.size == 0:
            raise ValueError("Failed to crop face")

        return cropped