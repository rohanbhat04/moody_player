import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from 'axios';

export default function FacialExpression({ setSongs, onEmotionDetected }) {
  const videoRef = useRef();
  const canvasRef = useRef();

  const handleExpressionDetected = async (expression) => {
    try {
      const response = await fetch(`http://localhost:3000/songs/${expression}`);
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  async function detectMood() {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections || detections.length === 0) return;

    const canvas = canvasRef.current;
    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };

    faceapi.matchDimensions(canvas, displaySize);

    const resized = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceExpressions(canvas, resized);

    let mostProbableExpression = 0;
    let curExpression = "";

    for (const expression of Object.keys(detections[0].expressions)) {
      if (detections[0].expressions[expression] > mostProbableExpression) {
        mostProbableExpression = detections[0].expressions[expression];
        curExpression = expression;
      }
    }

    handleExpressionDetected(curExpression);
    onEmotionDetected(curExpression);
  }

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => (videoRef.current.srcObject = stream))
        .catch((err) => console.error("Error accessing webcam: ", err));
    };

    loadModels().then(startVideo);
  }, []);

  useEffect(() => {
    const detectMoodInterval = setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections && detections.length > 0) {
          let mostProbableExpression = 0;
          let curExpression = "";

          for (const expression of Object.keys(detections[0].expressions)) {
            if (detections[0].expressions[expression] > mostProbableExpression) {
              mostProbableExpression = detections[0].expressions[expression];
              curExpression = expression;
            }
          }

          handleExpressionDetected(curExpression);
          onEmotionDetected(curExpression);
        }
      }
    }, 3000);

    return () => clearInterval(detectMoodInterval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">

      {/* VIDEO BOX */}
      <div className="relative w-full max-w-[550px] aspect-video rounded-xl 
                      overflow-hidden border border-gray-700 shadow-xl 
                      bg-gray-900/40 backdrop-blur-md">

        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="w-full h-full object-cover"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

      </div>

      {/* Right side text + button */}
      <div className="flex flex-col justify-center gap-4 max-w-md">

        <p className="text-gray-300 leading-relaxed">
          Your facial expressions are analyzed in real-time.
          Based on the detected mood, music will be recommended automatically.
        </p>

        <button
          onClick={detectMood}
          className="px-6 py-3 rounded-lg text-lg font-semibold 
                     bg-indigo-500 hover:bg-indigo-600 
                     transition-all duration-200 shadow-lg"
        >
          Detect Mood
        </button>

        <div className="mt-2 text-sm text-gray-400">
          Tip: Smile, frown, surprise → get different playlists!
        </div>
      </div>
    </div>
  );
}
