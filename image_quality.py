import cv2
import numpy as np
from detector import FaceDetector


def compute_sharpness(image: np.ndarray) -> float:
    """Return variance of Laplacian (sharpness measure). Higher is sharper."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def compute_brightness(image: np.ndarray) -> float:
    """Return mean V channel from HSV (0-255)."""
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    return float(np.mean(hsv[:, :, 2]))


def compute_face_area_ratio(image: np.ndarray, face_bbox: tuple) -> float:
    """Compute area ratio of face bbox to full image. bbox = (x1, y1, x2, y2)."""
    h, w = image.shape[:2]
    if not face_bbox:
        return 0.0
    x1, y1, x2, y2 = [int(c) for c in face_bbox]
    face_area = max(0, x2 - x1) * max(0, y2 - y1)
    return float(face_area) / float(max(1, w * h))


def assess_image_quality(image_path: str,
                         min_sharpness: float = 100.0,
                         min_brightness: float = 50.0,
                         max_brightness: float = 220.0,
                         min_face_area_ratio: float = 0.02) -> dict:
    """
    Assess whether an image is high-quality for face verification.

    Returns a dict with keys: `sharpness`, `brightness`, `face_area_ratio`, `high_quality`, `reasons`.

    Parameters are tunable for your dataset.
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Image not found")

    sharpness = compute_sharpness(image)
    brightness = compute_brightness(image)

    # try to detect face to compute area ratio; if detection fails, ratio=0
    face_area_ratio = 0.0
    reasons = []
    try:
        detector = FaceDetector()
        face = detector.detect_face(image_path)
        bbox = face.bbox
        face_area_ratio = compute_face_area_ratio(image, bbox)
    except Exception:
        # keep face_area_ratio as 0.0 if detection failed
        pass

    if sharpness < min_sharpness:
        reasons.append(f"low_sharpness:{sharpness:.1f}<{min_sharpness}")
    if not (min_brightness <= brightness <= max_brightness):
        reasons.append(f"bad_brightness:{brightness:.1f} not in [{min_brightness},{max_brightness}]")
    if face_area_ratio < min_face_area_ratio:
        reasons.append(f"small_face:{face_area_ratio:.4f}<{min_face_area_ratio}")

    high_quality = len(reasons) == 0

    return {
        "sharpness": sharpness,
        "brightness": brightness,
        "face_area_ratio": face_area_ratio,
        "high_quality": high_quality,
        "reasons": reasons,
    }
    