import {React, useState} from "react";
import { Hands } from "@mediapipe/hands";
import * as cam from "@mediapipe/camera_utils";
import angleBetweenThreePoints from "./angle";
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";
import { Button } from "@material-ui/core";
import claw from "../assets/images/claw.png";
import { Link } from "react-router-dom";



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
      top: 200,
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


const ex = {
    claw: {
      index: [6,7,8],
      middle: [10,11,12],
      ring: [14,15,16],
      pinky: [18,19,20],
      bad: [0,9,10],
    },
};

let count = 0;
let dir = 0;
let index_angle= 0;
let middle_angle=0;
let ring_angle=0;
let pinky_angle=0;
let bad_angle = 0;
let status = "";
let a=0;
let lastSpokenMessage = "";
function Handex(props) {
 
    // const [status, setStatus] = useState("");
     let imgSource;
     if (props.exercise === "claw") {
       imgSource = claw;
     }
   
     const webcamRef = useRef(null);
     const canvasRef = useRef(null);
   
     let camera = null;
     const countTextbox = useRef(null);
     const statusTextbox = useRef(null);
   
     function onResult(results) {
       if (results.handLandmarks) {
         const position = results.handLandmarks;
   
         // set height and width of canvas
         canvasRef.current.width = webcamRef.current.video.videoWidth;
         canvasRef.current.height = webcamRef.current.video.videoHeight;
   
         const width = canvasRef.current.width;
         const height = canvasRef.current.height;
   
         //ratios between 0-1, covert them to pixel positions
         const upadatedPos1 = [];
         const upadatedPos2 = [];
         const upadatedPos3 = [];
         const upadatedPos4 = [];
         const upadatedBadPos = [];
         const indexArray = ex[props.exercise].index;
         const middleArray = ex[props.exercise].middle;
         const ringArray = ex[props.exercise].ring;
         const pinkyArray = ex[props.exercise].pinky;
         const badIndexArray = ex[props.exercise].bad;
   
   
         for (let i = 0; i < 3; i += 1) {
           upadatedPos1.push({
             x: position[indexArray[i]].x * width,
             y: position[indexArray[i]].y * height,
           });

           upadatedPos2.push({
            x: position[middleArray[i]].x * width,
            y: position[middleArray[i]].y * height,
          });

          upadatedPos3.push({
            x: position[ringArray[i]].x * width,
            y: position[ringArray[i]].y * height,
          });

          upadatedPos4.push({
            x: position[pinkyArray[i]].x * width,
            y: position[pinkyArray[i]].y * height,
          });
         }
   
         for (let i = 0; i < 3; i += 1) {
           upadatedBadPos.push({
             x: position[badIndexArray[i]].x * width,
             y: position[badIndexArray[i]].y * height,
           });
         }
         
        index_angle = Math.round(angleBetweenThreePoints(upadatedPos1));
        middle_angle = Math.round(angleBetweenThreePoints(upadatedPos2));
        ring_angle = Math.round(angleBetweenThreePoints(upadatedPos3));
        pinky_angle = Math.round(angleBetweenThreePoints(upadatedPos4));
        bad_angle = Math.round(angleBetweenThreePoints(upadatedBadPos));
        // console.log(bad_angle)

       if (props.exercise === "claw") {
         if (bad_angle < 160) {
             a = 0;
             status = "Please straighten your back";
         } else {
             a = 1;
             status = "correct";
         }
     }
   
     // Speak the message if it's different from the last spoken message
     if (status !== lastSpokenMessage) {
         lastSpokenMessage = status;
         if (status) {
           var mes = new SpeechSynthesisUtterance();
             mes.text = status;
             window.speechSynthesis.speak(mes);
         }
     }
   
   
         if (index_angle > ex[props.exercise].ul) {
           
           if (dir === 0) {
             console.log(count, " ", dir, " decrement ", index_angle);
             dir = 1;
           }
         }
         if (index_angle < ex[props.exercise].ll && status === "correct") {
            if (dir === 1 ) {
             count = count + 1;
             var message = new SpeechSynthesisUtterance();
             message.text = count;
             window.speechSynthesis.speak(message);
             console.log(count, " ", dir, " increment ", index_angle);
             dir = 0;
           }
         }
         
   
   
         
         const canvasElement = canvasRef.current;
         const canvasCtx = canvasElement.getContext("2d");
         canvasCtx.save();
   
         canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
         
   
         for (let i = 0; i < 2; i++) {
           canvasCtx.beginPath();
           canvasCtx.moveTo(upadatedPos1[i].x, upadatedPos1[i].y);
           canvasCtx.lineTo(upadatedPos1[i + 1].x, upadatedPos1[i + 1].y);
           canvasCtx.lineWidth = 2;
           canvasCtx.strokeStyle = "white";
           canvasCtx.stroke();
         }
         for (let i = 0; i < 3; i++) {
           canvasCtx.beginPath();
           canvasCtx.arc(upadatedPos1[i].x, upadatedPos1[i].y, 10, 0, Math.PI * 2);
           canvasCtx.fillStyle = "#AAFF00";
           canvasCtx.fill();
         }
         canvasCtx.font = "40px aerial";
         canvasCtx.fillText(index_angle, upadatedPos1[1].x + 10, upadatedPos1[1].y + 40);
         canvasCtx.restore();
       }
     }
   
     useEffect(() => {
       console.log("rendered");
       count = 0;
       dir = 0;
       status = "";
      
    //    const pose = new Pose({
    //      locateFile: (file) => {
    //        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/${file}`;
    //      },
    //    });
    const hand = new Hands({
        locateFile: () => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js}`;
        },
      });
      
       hand.setOptions({
         modelComplexity: 1,
         smoothLandmarks: true,
         minDetectionConfidence: 0.6,
         minTrackingConfidence: 0.5,
       });
   
       hand.onResults(onResult);
   
       if (
         typeof webcamRef.current !== "undefined" &&
         webcamRef.current !== null
       ) {
         camera = new cam.Camera(webcamRef.current.video, {
           onFrame: async () => {
             if(countTextbox.current) countTextbox.current.value = count;
             if(statusTextbox.current) statusTextbox.current.value = status;
   
             if(webcamRef.current) await hand.send({ image: webcamRef.current.video });
           },
           width: 640,
           height: 480,
         });
         camera.start();
       }
     });
    
     function resetCount() {
       console.log("clicked");
       count = 0;
       dir = 0;
     }
   
     return (
       <div>
         <div style={styles.selectBox}>
           <p>Please make sure your whole hand is seen in the frame.</p>
         {(() => {
           if (props.exercise === "claw") {
             return (
               <div>
               <h1>Claw Stretch</h1>
               <p>Instructions: Face the web cam and bend your left hand fingers as shown.</p>
               </div>
             )
           } 
         })()}

        <img src={imgSource} width="400" alternate="bicepimage"></img>
           <br></br>
           <div style={{ top: 50 }}>
             <h1>Count</h1>
             <input
               variant="filled"
               ref={countTextbox}
               value={count}
               textAlign="center"
               style={{ height: 50, fontSize: 40, width: 80 }}
             />
             <br></br>
             <br></br>
             <h3>Status: </h3>
             <br />
             {/* <p>{status}</p> */}
             <input  variant="filled"
               ref={statusTextbox}
               value={status}
               textAlign="center"
               style={{ height: 50, fontSize: 40, width: 580 }}></input>
             <br></br>
             <br></br>
             <Button
               style={{ backgroundColor:'#00C2CB',fontWeight:'bold', top: 15 }}
               size="large"
               variant="contained"
               color="Yellow"
               onClick={resetCount}
             >
               Reset Counter
             </Button>
           </div>
         </div>
         <Webcam ref={webcamRef} style={styles.webcam} />
         <canvas ref={canvasRef} style={styles.webcam} />
         <div style={styles.back}>
           <Link to="/counter">
             <Button size="large" variant="contained"  style={{backgroundColor:'#00C2CB',fontWeight:'bold'}}>
               Back
             </Button>
           </Link>
         </div>
       </div>
     );
}

export default Handex;