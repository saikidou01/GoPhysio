import React from "react";
import logo from "../assets/images/logo_pic.png";
import exercise from "../assets/images/exercise.png";
import meditaion from "../assets/images/meditation.png";
import "../App.css";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

export const Home = () => {


  return (
    <div>
      
      <div className="home">
        <div
          style={{
            fontSize: 45,
            "font-family": 'Helvetica Neue',
            fontWeight: "bold",
            flex: 1.5,
            marginLeft: 100,
            marginTop: 150,
          }}
        >
          
          
          <div style={{ display: "flex", textDecorationLine: "none" }}>
            
            
            <Link to="/counter" style={{marginLeft: 75}}>
              <Button
                size="large"
                variant="contained"
                color="yellow"
                startIcon={<Avatar src={exercise} />}
              >
                <b>Exercises</b>
              </Button>
            </Link>
          </div>
        </div>
        <img
          src={logo}
          alt="Logo"
          style={{ flex: 1, width:350, marginRight: 100, marginTop: 50 }}
        ></img>
      </div>
    </div>
  );
};

export default Home;