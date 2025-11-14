import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from 'axios';

export default function FacialExpression({setSongs}) {
  const videoRef = useRef();
  const canvasRef = useRef();

  const handleExpressionDetected = async (expression) => {
    try {
      console.log('Detected expression:', expression);
      const response = await fetch(`http://localhost:3000/songs/${expression}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched songs:', data);
      setSongs(data); // Make sure this is the songs array
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  async function detectMood() {
    console.log("detectMood function executed");
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      console.log("no face detected!");
      return;
    }

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

    console.log(curExpression);

    handleExpressionDetected(curExpression);
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
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam: ", err));
    };

    loadModels().then(startVideo);
  }, []);

  // Modify detectMood to run less frequently
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
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(detectMoodInterval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
      {/* Video + Canvas */}
      <div className="relative rounded-xl overflow-hidden w-full max-w-[514px] aspect-video">
        <video ref={videoRef} autoPlay muted className="w-full h-auto" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      {/* Text + Button */}
      <div className="text-center lg:text-left max-w-lg">
        <h1 className="text-2xl mb-4">Live Mood Detection</h1>
        <p className="mb-4">
          Your current mood will be analysed in real-time. Enjoy the music
          tailored to your feeling. Just click the button to detect your mood.
        </p>
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
          onClick={detectMood}
        >
          Detect Mood
        </button>
      </div>
    </div>
  );
}
