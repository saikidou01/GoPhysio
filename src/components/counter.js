import {React, useState} from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";
import angleBetweenThreePoints from "./angle";
import { Button } from "@material-ui/core";
import sidewayslegraise from "../assets/images/sideways.jpeg"
import sittostand from "../assets/images/sit-to-stand.png"
import forwardlegraise from "../assets/images/forward-leg-raises.jpeg"

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

const exrInfo = {
  sidewaysLegRaise: {
    index: [27, 23, 28],
    ul: 35,
    ll: 15,
    bad_index: [ 11,23,27],
  },
  sitToStand: {
    index: [24, 26, 28],
    ul: 165,
    ll: 85,
    bad_index: [12,24,26],
  },
  forwardLegRaise: {
    index: [27,23,28],
    ul: 35,
    ll: 15,
    bad_index: [23,25,27],
  },
 
};


let count = 0;
let dir = 0;
let angle = 0;
let bad_angle = 0;
let status = "";
let a = 0;
let lastSpokenMessage = "";
function Counter(props) {
 
 // const [status, setStatus] = useState("");
  let imgSource;
  if (props.exercise === "sidewaysLegRaise") {
    imgSource = sidewayslegraise;
  } else if (props.exercise === "sitToStand") {
    imgSource = sittostand;
  } else if (props.exercise === "forwardLegRaise") {
    imgSource = forwardlegraise;
  }

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  let camera = null;
  const countTextbox = useRef(null);
  const statusTextbox = useRef(null);

  function onResult(results) {
    if (results.poseLandmarks) {
      const position = results.poseLandmarks;

      // set height and width of canvas
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      //ratios between 0-1, covert them to pixel positions
      const upadatedPos = [];
      const upadatedBadPos = [];
      const indexArray = exrInfo[props.exercise].index;
      const badIndexArray = exrInfo[props.exercise].bad_index;


      for (let i = 0; i < 3; i += 1) {
        upadatedPos.push({
          x: position[indexArray[i]].x * width,
          y: position[indexArray[i]].y * height,
        });
      }

      for (let i = 0; i < 3; i += 1) {
        upadatedBadPos.push({
          x: position[badIndexArray[i]].x * width,
          y: position[badIndexArray[i]].y * height,
        });
      }
      
      angle = Math.round(angleBetweenThreePoints(upadatedPos));
      bad_angle = Math.round(angleBetweenThreePoints(upadatedBadPos));
      // console.log(bad_angle)
      
    

  //   if (props.exercise === "sidewaysLegRaise"){
  //     if(bad_angle<160){
  //         //console.log("Anomaly");
  //         status = "Please straighten your back";
          
  //     }
  //     else{
  //      status = "correct";
  //     }
  //     console.log(status);
  //   }

  //   if (status !== lastSpokenMessage) {
  //     lastSpokenMessage = status;
  //     if (status) {
  //       var mes = new SpeechSynthesisUtterance();
  //         mes.text = status;
  //         window.speechSynthesis.speak(mes);
  //     }
  // }

    // if (props.exercise === "sitToStand"){
    //   if(bad_angle<60){
    //       console.log("Anomaly");
    //      // setStatus("Please correct posture");
    //       status = "Please keep your back straight";
    //      // console.log(status);
    //       var mes2 = new SpeechSynthesisUtterance();
    //       mes2.text = "Please keep your back straight";
    //       window.speechSynthesis.speak(mes2);
    //   }
    //   else{
    //    // setStatus("correct");
    //    status = "correct";
    //   }
    // }
    // if (props.exercise === "forwardLegRaise"){
    //   if(bad_angle<140){
    //       console.log("Anomaly");
    //      // setStatus("Please correct posture");
    //       status = "Please straighten your leg";
    //       //console.log(status);
    //       var mes3 = new SpeechSynthesisUtterance();
    //       mes3.text = "Please straighten your leg";
    //       window.speechSynthesis.speak(mes3);
    //   }
    //   else{
    //    // setStatus("correct");
    //    status = "correct";
    //   }
    // }
    if (props.exercise === "sidewaysLegRaise") {
      if (bad_angle < 160) {
          a = 0;
          status = "Please straighten your back";
      } else {
          a = 1;
          status = "correct";
      }
  } else if (props.exercise === "sitToStand") {
      if (bad_angle < 60) {
        a=0;
        status = "Please keep your back straight";
      } else {
          a = 1;
          status = "correct";
      }
  } else if (props.exercise === "forwardLegRaise") {
      if (bad_angle < 140) {
        a=0;
          status = "Please straighten your leg";
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


      if (angle > exrInfo[props.exercise].ul) {
        
        if (dir === 0) {
          console.log(count, " ", dir, " decrement ", angle);
          dir = 1;
        }
      }
      if (angle < exrInfo[props.exercise].ll && status == "correct") {
         if (dir === 1 ) {
          count = count + 1;
          var message = new SpeechSynthesisUtterance();
          message.text = count;
          window.speechSynthesis.speak(message);
          console.log(count, " ", dir, " increment ", angle);
          dir = 0;
        }
      }
      


      
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      

      for (let i = 0; i < 2; i++) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(upadatedPos[i].x, upadatedPos[i].y);
        canvasCtx.lineTo(upadatedPos[i + 1].x, upadatedPos[i + 1].y);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "white";
        canvasCtx.stroke();
      }
      for (let i = 0; i < 3; i++) {
        canvasCtx.beginPath();
        canvasCtx.arc(upadatedPos[i].x, upadatedPos[i].y, 10, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#AAFF00";
        canvasCtx.fill();
      }
      canvasCtx.font = "40px aerial";
      canvasCtx.fillText(angle, upadatedPos[1].x + 10, upadatedPos[1].y + 40);
      canvasCtx.restore();
    }
  }

  useEffect(() => {
    console.log("rendered");
    count = 0;
    dir = 0;
    status = "";
   
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResult);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if(countTextbox.current) countTextbox.current.value = count;
          if(statusTextbox.current) statusTextbox.current.value = status;

          if(webcamRef.current) await pose.send({ image: webcamRef.current.video });
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
        <p>Please make sure your whole body is seen in the frame.</p>
      {(() => {
        if (props.exercise === "sidewaysLegRaise") {
          return (
            <div>
            <h1>Sideways Leg Raise</h1>
            <p>Instructions: Face the web cam and raise ur right leg</p>
            </div>
          )
        } else if (props.exercise === "sitToStand") {
          return (
            <div>
            <h1>Sit To Stand</h1>
            <p>Instructions: Take a chair, turn to the side which shows your right leg to the web cam</p>
            </div>
          )
        } else {
          return (
            <div>
            <h1>Forward Leg Raises</h1>
            <p>Instructions: Raise left leg while you stand sideways.</p>
            </div>
          )
        } 
      })()}

      {/* Different img properties for large width images */}
      {(() => {
        if (props.exercise === "forwardLegRaise" || props.exercise === "crunches") {
          return (
            <img src={imgSource} width="450" style={{ marginTop:100}} alternate="bicepimage"></img>
          )
        } else {
          return (
            <img src={imgSource} width="200" alternate="bicepimage"></img>
          )
        }
      })()}
     
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

export default Counter;
