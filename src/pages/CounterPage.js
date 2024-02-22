import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import forwardlegraise from "../assets/images/forward-leg-raises.jpeg"
import sidewayslegraise from "../assets/images/sideways.jpeg"
import sittostand from "../assets/images/sit-to-stand.png"


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
          marginLeft: "auto",
          top:250,
          left:200,
          textAlign:"center"
        }}
      >
     
        <Link style={{color: '#b3a69f', textDecoration: 'none'}}to="/bicepcurls">
          <img src={sidewayslegraise} alt="bicepimage" width="190" style={{marginLeft:0,marginRight:50}}></img>
          <h1>Sideways leg raises</h1>
        </Link>
        <Link style={{color: '#b3a69f', textDecoration: 'none'}} to="/squats">
          <img src={sittostand} alt="bicepimage" width="250" style={{marginTop:2, marginLeft:50,marginRight:50}}></img>
          <h1>Sit to Stand</h1>
        </Link>
        <Link style={{color: '#b3a69f', textDecoration: 'none'}} to="/pushups">
          <img src={forwardlegraise} alt="bicepimage" width="200" style={{marginTop:0.5, marginLeft:50,marginRight:50}}></img>
          <h1>Forward Leg raises</h1>
        </Link>
       
      </div>

      <div style={styles.back}>
        <Link to="/">
          <Button size="large" variant="contained"  style={{backgroundColor:'#b3a69f',fontWeight:'bold'}}>
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CounterPage;