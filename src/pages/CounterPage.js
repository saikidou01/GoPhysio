import React from "react";
import { Button, Hidden } from "@material-ui/core";
import { Link } from "react-router-dom";
import forwardlegraise from "../assets/images/front.gif"
import sidewayslegraise from "../assets/images/side.gif"
import sittostand from "../assets/images/sit.gif"
import claw from "../assets/images/claw.gif"
import ftip from "../assets/images/tipt.gif"


const styles = {
  back: {
    position: "fixed",
    bottom:0,
    right: 0
  },
  select: {
    position: "absolute",
    marginRight: "auto",
    marginLeft: "auto",
    left: 900,
    right: 0,
    top: 200,
    textAlign: "center",
    width: 300,
  },
};

const CounterPage = () => {

  return (
    <div>
      <div
        style={{
          display: "flex",
          direction: "column",
          position: "absolute",
          marginRight: "auto",
          marginLeft: "10",
          top:250,
          left:200,
          textAlign:"center"
        }}
      >
     
        <Link style={{color: '#00C2CB', textDecoration: 'none'}}to="/bicepcurls">
          <img src={sidewayslegraise} alt="bicepimage" width="300" style={{marginLeft:0,marginRight:50}}></img>
          <h1>Sideways leg raises</h1>
        </Link>
        <Link style={{color: '#00C2CB', textDecoration: 'none'}} to="/squats">
          <img src={sittostand} alt="bicepimage" width="200" style={{marginTop:2, marginLeft:50,marginRight:50}}></img>
          <h1>Sit to Stand</h1>
        </Link>
        <Link style={{color: '#00C2CB', textDecoration: 'none'}} to="/pushups">
          <img src={forwardlegraise} alt="bicepimage" width="200" style={{marginTop:0.5, marginLeft:50,marginRight:50}}></img>
          <h1>Forward Leg raises</h1>
        </Link>
        <Link style={{color: '#00C2CB', textDecoration: 'none'}} to="/claw">
          <img src={claw} alt="bicepimage" width="230" style={{marginTop:0.5, marginLeft:50,marginRight:50,marginBottom: 25, transform: 'rotate(90deg)'}}></img>
          <h1>Claw Stretch</h1>
        </Link>
        <Link style={{color: '#00C2CB', textDecoration: 'none'}} to="/fingertip">
          <img src={ftip} alt="bicepimage" width="270" style={{marginTop:0.5, marginLeft:50,marginRight:50}}></img>
          <h1>FingerTip Touch</h1>
        </Link>
       
      </div>

      <div style={styles.back}>
        <Link to="/">
          <Button size="large" variant="contained"  style={{backgroundColor:'#00C2CB',fontWeight:'bold'}}>
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CounterPage;