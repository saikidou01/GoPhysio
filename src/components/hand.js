import { FilesetResolver, HandLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import React, { useEffect } from "react";

export default function HandLandmarkDetection() {
    useEffect(() => {
        let handLandmarker;
        let runningMode = "IMAGE";
        let enableWebcamButton;
        const videoHeight = "360px";
        const videoWidth = "480px";
        async function runDemo() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task`
                },
                runningMode: runningMode,
                numHands: 2
            });
        }
        runDemo()

        const video = document.getElementById("webcam");
        const canvasElement = document.getElementById("output_canvas");
        const canvasCtx = canvasElement.getContext("2d");

        let webcamRunning = false;

        // Check if webcam access is supported.
        function hasGetUserMedia() {
            return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        }

        // If webcam supported, add event listener to button for when user
        // wants to activate it.
        if (hasGetUserMedia()) {
            enableWebcamButton = document.getElementById("webcamButton");
            enableWebcamButton.addEventListener("click", enableCam);
        } else {
            console.warn("getUserMedia() is not supported by your browser");
        }

        // Enable the live webcam view and start detection.
        function enableCam(event) {
            if (!handLandmarker) {
                console.log("Wait! objectDetector not loaded yet.");
                return;
            }

            if (webcamRunning === true) {
                webcamRunning = false;
                enableWebcamButton.innerText = "ENABLE PREDICTIONS";
            } else {
                console.log("webcam was off");
                webcamRunning = true;
                enableWebcamButton.innerText = "DISABLE PREDICITONS";
            }

            // getUsermedia parameters.
            const constraints = {
                video: true
            };

            // Activate the webcam stream.
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);
            });
        }
        const calculateDistance = (point1, point2) => {
            return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
        };

        const calculateAngle = (basePoint, middlePoint, tipPoint) => {
            const vector1 = [middlePoint.x - basePoint.x, middlePoint.y - basePoint.y];
            const vector2 = [tipPoint.x - middlePoint.x, tipPoint.y - middlePoint.y];
            const angle = Math.atan2(vector2[1], vector2[0]) - Math.atan2(vector1[1], vector1[0]);
            return (angle * 180) / Math.PI;
        };

        async function predictWebcam() {
            // Now let's start detecting the stream.
            if (runningMode === "IMAGE") {
                runningMode = "VIDEO";
                await handLandmarker.setOptions({ runningMode: runningMode });
            }
            let nowInMs = Date.now();
            const results = handLandmarker.detectForVideo(video, nowInMs);

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            const drawingUtils = new DrawingUtils(canvasCtx);
            canvasElement.style.height = videoHeight;
            video.style.height = videoHeight;
            canvasElement.style.width = videoWidth;
            video.style.width = videoWidth;

            if (results.landmarks) {
                for (const landmarks of results.landmarks) {
                    const handLandmarks = results.landmarks[0]; // Assuming only one hand is detected
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
                    console.log(row_data)

                    drawingUtils.drawConnectors(
                        landmarks,
                        HandLandmarker.HAND_CONNECTIONS,
                        {
                            color: "#00FF00",
                            lineWidth: 5
                        }
                    );
                    drawingUtils.drawLandmarks(landmarks, {
                        color: "#FF0000",
                        lineWidth: 2
                    });
                }
            }
            canvasCtx.restore();

            // Call this function again to keep predicting when the browser is ready.
            if (webcamRunning === true) {
                window.requestAnimationFrame(predictWebcam);
            }
        }
    })

    return (
        <div>
            <h1>Hello hand landmark detection</h1>
            <div id="liveView" className="videoView">
                <button id="webcamButton">
                    <span>ENABLE WEBCAM</span>
                </button>
                <div style={{ position: "relative" }}>
                    <video id="webcam" style={{ width: "1280px", height: "720px", position: "absolute", left: "0px", top: "0px" }} autoPlay playsInline></video>
                    <canvas className="output_canvas" id="output_canvas" width="1280" height="720" style={{ position: "absolute", left: "0px", top: "0px" }}></canvas>
                </div>
            </div>
        </div>
    )
}