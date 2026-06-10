import cv2


class ImageQuality:

    def is_blurry(self, image_path, threshold=100):

        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Image not found")

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        blur_score = cv2.Laplacian(
            gray,
            cv2.CV_64F
        ).var()

        return blur_score > threshold

    def check_quality(self, image_path):

        if not self.is_blurry(image_path):
            raise ValueError("Image is blurry")

        return True