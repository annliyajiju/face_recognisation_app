from detector import FaceDetector
from embedder import FaceEmbedder
from comparator import FaceComparator

class FaceVerificationService:

    def __init__(self):
        self.detector = FaceDetector()
        self.embedder = FaceEmbedder()
        self.comparator = FaceComparator()
    def verify_faces(self, image_path1, image_path2, threshold=0.6):
        try:
            face1 = self.detector.detect_face(image_path1)
            face2 = self.detector.detect_face(image_path2)

            emb1 = self.embedder.generate_embedding(face1)
            emb2 = self.embedder.generate_embedding(face2)
            similarity = self.comparator.cosine_similarity(emb1, emb2)
            # Debug: show similarity and threshold to help tune matching
            print(f"DEBUG: similarity={similarity}, threshold={threshold}")
            result = self.comparator.is_match(similarity, threshold)
            return {
                "similarity": float(similarity),
                "match": bool(result),
                "message": "Same person matched" if result else "Different person"
            }

        except ValueError as e:
            return {
                "similarity": 0.0,
                "match": False,
                "message": str(e)
            }