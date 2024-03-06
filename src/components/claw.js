import { FilesetResolver, HandLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import React, { useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import claw from "../assets/images/claw.png";
const styles = {
    webcam: {
      position: "absolute",
      marginRight: "auto",
      marginLeft: "auto",
      left: 0,
      right: 800,
      top: 200,
      textAlign: "center",
      zIndex: 9,
      width: 860,
      height: 645,
    },
    countBox: {
      position: "absolute",
      marginRight: "auto",
      marginLeft: "auto",
      left: 1100,
      right: 0,
      top: 600,
      width: 400,
      height: 100,
    },
    selectBox: {
      position: "absolute",
      marginRight: "auto",
      marginLeft: "auto",
      left: 900,
      right: 0,
      top: 125,
      textAlign: "center",
      width: 400,
      color: "#00C2CB",
      background: "#FFFDD0",
    },
    back: {
      position: "fixed",
      bottom: 0,
      right: 0
    },
};

let count = 0;
let status= "";
let a = 0;
let lastSpokenMessage = "";

export default function ClawLandmarkDetection() {
    const countTextbox = useRef(null);
    const statusTextbox = useRef(null);
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
        // const calculateDistance = (point1, point2) => {
        //     return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
        // };

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
                    // const thumbTip = handLandmarks[4];
                    const fingers = [
                        [6, 7, 8],
                        [10, 11, 12],
                        [14, 15, 16],
                        [18, 19, 20],
                        [0,9,10],
                    ];

                    const row_data = [];

                    for (const [fingerPip, fingerDip, fingerTip] of fingers) {
                        const knucklePoint = handLandmarks[fingerPip];
                        const middlePoint = handLandmarks[fingerDip];
                        const tipPoint = handLandmarks[fingerTip];

                        const angle = calculateAngle(knucklePoint, middlePoint, tipPoint);
                        // const distance = calculateDistance(thumbTip, tipPoint);
                        row_data.push(angle);
                    }
                    console.log(row_data)


                    if((1>row_data[0]>-3) && (2>row_data[1]>-1) && (5>row_data[2]>0) && (5>row_data[3]>0))
                    {
                        a=1;
                    }
                    if(a===1 && (row_data[0]>30) && (row_data[1]>10) && (row_data[2]>10) && (row_data[3]>20) && (row_data[4]<0))
                    {
                        status = "Correct";
                        count = count + 1;
                        var message = new SpeechSynthesisUtterance();
                        message.text = count;
                        window.speechSynthesis.speak(message);
                        a=0;
                    }
                    else if(row_data[4]>5)
                    {
                        status = "Incorrect!! Please dont bend fingers completely."
                        a=1;
                    }
                    if (status !== lastSpokenMessage) {
                        lastSpokenMessage = status;
                        if (status) {
                          var mes = new SpeechSynthesisUtterance();
                            mes.text = status;
                            window.speechSynthesis.speak(mes);
                        }
                    }
                    statusTextbox.current.value = status;
                    countTextbox.current.value = count;

                    



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
    function resetCount() {
        console.log("clicked");
        count = 0;
        
      }
    return (
        // <div>
            
        //     <div id="liveView" className="videoView">
        //         <button id="webcamButton" style={{marginTop:200, marginLeft:50,marginRight:50}}>
        //             <span>ENABLE WEBCAM</span>
        //         </button>
        //         <div style={{ position: "relative" }}>
        //             <video id="webcam" style={{ width: "1280px", height: "720px", position: "absolute", left: "0px", top: "0px" }} autoPlay playsInline></video>
        //             <canvas className="output_canvas" id="output_canvas" width="1280" height="720" style={{ position: "absolute", left: "0px", top: "0px" }}></canvas>
        //         </div>
        //     </div>
        // </div>
<div>
        <div>
    <div id="liveView" className="videoView">
        <button id="webcamButton" style={{ marginTop: 200, marginLeft: 50, marginRight: 50 }}>
            <span>ENABLE WEBCAM</span>
        </button>
        <div style={{ position: "relative" }}>
            <video id="webcam" style={{ width: "1280px", height: "720px", position: "absolute", left: "0px", top: "0px" }} autoPlay playsInline></video>
            <canvas className="output_canvas" id="output_canvas" width="1280" height="720" style={{ position: "absolute", left: "0px", top: "0px" }}></canvas>
        </div>
    </div>
</div>

<div>
    <div style={styles.selectBox}>
        <p>Please make sure your whole hand is seen in the frame.</p>
        <div>
            <h1>Claw Stretch</h1>
            <p>Instructions: Face the web cam and bend your left hand fingers as shown.</p>
        </div>

        <img src={claw} width="400" alt="bicepimage" />
        <br /><br />
        <div style={{ top: 50 }}>
            <h1>Count</h1>
            <input
                variant="filled"
                ref={countTextbox}
                value={count}
                textAlign="center"
                style={{ height: 50, fontSize: 40, width: 80 }}
            />
            <br /><br />
            <h3>Status: </h3>
            <br />
            <input
                variant="filled"
                ref={statusTextbox}
                value={status}
                textAlign="center"
                style={{ height: 50, fontSize: 40, width: 580 }}
            />
            <br /><br />
            <Button
                style={{ backgroundColor: '#00C2CB', fontWeight: 'bold', top: 15 }}
                size="large"
                variant="contained"
                color="Yellow"
                onClick={resetCount}
            >
                Reset Counter
            </Button>
            <div style={styles.back}>
        <Link to="/counter">
          <Button size="large" variant="contained"  style={{backgroundColor:'#00C2CB',fontWeight:'bold'}}>
            Back
          </Button>
        </Link>
      </div>
        </div>
    </div>
</div>
</div>
        
    )
}