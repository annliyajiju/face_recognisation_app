from verification_service import FaceVerificationService

service = FaceVerificationService()

result = service.verify_faces(
    "dq3.jpg",
    "dq2.jpg",
)

print(result)
