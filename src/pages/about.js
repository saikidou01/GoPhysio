import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import about_us from "../assets/images/about_us.png";
import "./about.css"


const About = () => {
  return (
    <div>
      
      <h1 style={{textAlign: "center", fontSize: 70, marginLeft: 120, marginTop: 50}}>
        Team Go Physio
      </h1>
      <div className="heart">
        <p style={{ marginLeft: 30, fontSize: 40, marginRight: 30, marginTop: 50 }}>

        Krishna Nikhil Mehta<br></br>
          <br></br>Avni Gupta<br></br>
          <br></br>Avanish Bhat<br></br>
          <br></br>Aryansh Bhargavan<br></br>
          <br></br>
        </p>
      
        <img
          src={about_us}
          alt="Logo"
          style={{height:500, marginRight: 250, marginTop: 50 }}
        ></img>
            
      </div>
    
      <div className="bottom-right-corner">
        <Link to="/">
          <Button size="large" variant="contained"  style={{backgroundColor:'#00C2CB',fontWeight:'bold'}}>
            Back
          </Button>
        </Link>
        
      </div>

      
      
    </div>
  );

  
  
};

export default About;

