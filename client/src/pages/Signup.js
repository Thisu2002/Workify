import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/Login.css";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import logo from "../images/logo.png";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time email existence check
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (email) {
        setCheckingEmail(true);
        axios
          .post("http://localhost:5000/auth/check-email", { email })
          .then((res) => {
            setEmailExists(res.data.exists);
          })
          .catch((err) => {
            console.error("Email check failed:", err);
          })
          .finally(() => {
            setCheckingEmail(false);
          });
      }

      if (password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
          setValidPassword(
            "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
          );
        } else {
          setValidPassword("");
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return setErrorMessage("Please fill in all fields.");
    }

    if (emailExists) {
      return setErrorMessage("Email already in use.");
    }

    if (validPassword) {
      return setErrorMessage(validPassword);
    }

    if (password !== confirmPassword) {
      return setErrorMessage("Passwords do not match.");
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      alert("Signup successful!");
      navigate("/login");

      // You can redirect or reset the form here
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-side">
          <img src={logo} alt="Workify Logo" className="logo" />
        </div>
        <div className="right-side">
          <h1 className="login-title">Signup</h1>
          <form onSubmit={handleSubmit} className="login-form">
            {errorMessage && <span className="msg">{errorMessage}</span>}

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {checkingEmail && <span className="msg">Checking email...</span>}
            {emailExists && <span className="msg">Email already exists !</span>}

            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                className="visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            {validPassword && password && (
              <Tooltip title={validPassword} placement="right">
                <ErrorOutlineIcon className="error-icon" />
              </Tooltip>
            )}

            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Retype Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="visibility"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <span className="msg">Passwords do not match !</span>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#96bec5",
                color: "#0F2445",
                marginTop: "20px",
                padding: "10px 30px",
                textTransform: "none",
                fontSize: "16px",
              }}
            >
              Signup
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
