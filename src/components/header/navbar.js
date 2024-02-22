import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <section className="navbar">
      
      <Link to="/" className="navbar-item">
        Home
      </Link>
      <Link to="/counter" className="navbar-item">
        Exercises
      </Link>
      <Link to="/about" className="navbar-item">
        About
      </Link>

    </section>
  );
}

export default Navbar;