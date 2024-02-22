import { Link } from "react-router-dom";
import logo from "../../assets/images/logo_name.png";
import "./Header.css";
import Navbar from "./navbar";

const Header = () => {
 
  return (
    <section className="header">
      <section className="header-top">
        <section className="header-top__logo">
          
          <Link to="/" className="header-logo">
            <img
              style={{ width: 250, marginBottom: 0 }}
              src={logo}
              alt="App-logo"
            ></img>
          </Link>
        </section>
        <section className="header-top__navbar">
          <section className="header-top__navigation">
            <Navbar />
          </section>
          
        </section>
      </section>

      <hr className="header-top__seperator" />
    </section>
  );
};

export default Header;