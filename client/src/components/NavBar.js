import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import logo from "../images/logo.png";
import Button from "@mui/material/Button";
import "../styles/NavBar.css";
const NavBar = () => {
  return (
    <nav>
      <Link to="/#home">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-links">
        <li>
          <Link to="/#home">Home</Link>
        </li>
        <li>
          <Link to="/#about-us">About Us</Link>
        </li>
        <li>
          <Link to="/#services">Services</Link>
        </li>
        <li>Companies</li>
        <li>
          <Link to="/#contact-us">Contact Us</Link>
        </li>
        <li>
          <Link to="/login">
            <Button
              variant="outlined"
              color="black"
              sx={{
                borderRadius: "20px",
              }}
            >
              Login
            </Button>
          </Link>
        </li>
        <li>
          <Link to="">
            <Button
              variant="contained"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#0F2445",
              }}
            >
              Register
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
