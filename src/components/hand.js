import React from "react";
import { useRef, useEffect, useState } from "react";
import * as hands from "@mediapipe/hands"; 
import * as tf from '@tensorflow/tfjs';

const HandTrackingComponent = () => {
    const videoRef = useRef(null);
    const [model, setModel] = useState(null);
    const [handDetection, setHandDetection] = useState(null);
    const [predictedVerdict, setPredictedVerdict] = useState('');

    useEffect(() => {
        // Load your ML model
        const loadModel = async () => {
            // Load the .pkl model using the appropriate library
           // const loadedModel = await nodePickle.load('../assets/models/randomforestclassifier_hand_verdict_model.pkl');
            const loadedModel = await tf.loadGraphModel('../assets/models/model.json');
            setModel(loadedModel);
        };

        loadModel();

        // Load the hand detection model
        const handDetectionModel = new hands.Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        handDetectionModel.setOptions({
            maxNumHands: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        setHandDetection(handDetectionModel);

        // Cleanup
        return () => {
            handDetectionModel.close();
        };
    }, []);

    useEffect(() => {
        if (!handDetection || !model) return;

        const runHandTracking = async () => {
            handDetection.onResults(handleHandResults);

            const videoElement = videoRef.current;
            if (videoElement) {
                videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
            }
        };

        runHandTracking();

        return () => {
            handDetection.close();
        };
    }, [handDetection, model]);

    const calculateDistance = (point1, point2) => {
        return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    };

    const calculateAngle = (basePoint, middlePoint, tipPoint) => {
        const vector1 = [middlePoint.x - basePoint.x, middlePoint.y - basePoint.y];
        const vector2 = [tipPoint.x - middlePoint.x, tipPoint.y - middlePoint.y];
        const angle = Math.atan2(vector2[1], vector2[0]) - Math.atan2(vector1[1], vector1[0]);
        return (angle * 180) / Math.PI;
    };

    const handleHandResults = (results) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            // No hands detected
            setPredictedVerdict('No hands detected');
            return;
        }

        const handLandmarks = results.multiHandLandmarks[0]; // Assuming only one hand is detected
        const thumbTip = handLandmarks[4];
        const fingers = [
            [5, 6, 8],
            [9, 10, 12],
            [13, 14, 16],
            [17, 18, 20],
        ];

        const row_data = [];

        for (const [fingerKnuckle, fingerMiddle, fingerTip] of fingers) {
            const knucklePoint = handLandmarks[fingerKnuckle];
            const middlePoint = handLandmarks[fingerMiddle];
            const tipPoint = handLandmarks[fingerTip];

            const angle = calculateAngle(knucklePoint, middlePoint, tipPoint);
            const distance = calculateDistance(thumbTip, tipPoint);
            row_data.push(distance, angle);
        }

        // Create a TensorFlow.js tensor from row_data
        const tensor = tf.tensor2d([row_data]);

        // Use your loaded ML model to make predictions
        const predictions = model.predict(tensor);

        // Process predictions and update predictedVerdict state accordingly
        // This part depends on your specific ML model and its output format
        // For example, if your model predicts a binary classification (0 or 1),
        // you might use something like:
        const predictedClass = predictions.argMax(1).dataSync()[0];
        const predictedVerdict = predictedClass === 1 ? 'Correct' : 'Incorrect';
        setPredictedVerdict(predictedVerdict);
    };

    return (
        <div>
            <video ref={videoRef} width="640" height="480" autoPlay></video>
            <p>Predicted Verdict: {predictedVerdict}</p>
        </div>
    );
};

export default HandTrackingComponent;