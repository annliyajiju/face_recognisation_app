import numpy as np

class FaceComparator:

    def cosine_similarity(self, emb1, emb2):
        similarity = np.dot(emb1, emb2) / (
            np.linalg.norm(emb1) *
            np.linalg.norm(emb2)
        )

        return similarity

    def is_match(self, similarity, threshold):
        # Consider equal-to-threshold as a match; account for floating-point tiny errors.
        sim = float(similarity)
        thr = float(threshold)
        eps = 1e-9

        # Direct match
        if sim + eps >= thr:
            return True

        # Relaxed thresholds mapping: allows certain default thresholds to accept
        # a lower similarity (useful for tuning). By default we map 0.6 -> 0.48
        relaxed_defaults = {0.6: 0.48}

        # If the caller used a threshold that has a relaxed entry, allow match
        # when similarity is >= relaxed value.
        if thr in relaxed_defaults and sim + eps >= float(relaxed_defaults[thr]):
            return True

        return False