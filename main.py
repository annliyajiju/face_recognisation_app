from fastapi import FastAPI,UploadFile,File
from verification_service import FaceVerificationService
import os

app = FastAPI()
service = FaceVerificationService()

@app.get("/")
def home():
    return {
        "message": "Face Recognition API Running"
        }

@app.post("/compare")
def compare(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...),
):
    os.makedirs("temp", exist_ok=True)
    path1 = os.path.join("temp", image1.filename)
    path2 = os.path.join("temp", image2.filename)

    with open(path1, "wb") as f:
        f.write(image1.file.read())
    with open(path2, "wb") as f:
        f.write(image2.file.read())

    result = service.verify_faces(path1, path2)
    return result