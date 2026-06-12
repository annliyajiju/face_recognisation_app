# Face Recognition System

## Overview

A full-stack face verification application built using React and FastAPI. The system compares two uploaded face images and returns a similarity score along with a match result.

## Features

* Face Detection using InsightFace
* Face Verification using Face Embeddings
* Similarity Comparison using Cosine Similarity
* Image Quality Validation
* FastAPI REST API Backend
* React Frontend Interface
* Match Percentage Result Display

## Tech Stack

### Frontend

* React
* JavaScript
* Fetch API

### Backend

* FastAPI
* Python
* Uvicorn

### AI / Computer Vision

* InsightFace
* OpenCV
* NumPy

## Project Structure

### Backend

backend/

* main.py
* detector.py
* embedder.py
* comparator.py
* verification_service.py
* image_quality.py

### Frontend

frontend/

* App.js

## How It Works

1. User uploads two face images.
2. Images are sent to the FastAPI backend.
3. Backend validates image quality.
4. Faces are detected and embeddings are generated.
5. Cosine similarity is calculated.
6. Match result and similarity percentage are returned.
7. Frontend displays the final verification result.

## API Endpoint

### POST /compare

#### Request

* image1
* image2

#### Response

```json
{
  "similarity": 0.87,
  "match": true,
  "message": "Same person matched"
}
```

## Installation

### Backend

```bash
cd backend
pip install fastapi uvicorn insightface opencv-python numpy python-multipart
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Future Improvements

* Webcam-based face verification
* User registration and authentication
* Database integration
* Advanced image quality assessment
* Enhanced result visualization

## Author

Developed as a Full-Stack AI Internship Project using React, FastAPI, and InsightFace.
