import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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
  const [role, setRole] = useState("");

  // Common fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Recruiter fields
  const [address, setAddress] = useState("");
  const [companyId, setCompanyId] = useState("");

  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [description, setDescription] = useState("");
  const [passkey, setPasskey] = useState("");
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch subscription plans for company role
  useEffect(() => {
    if (role === "company") {
      axios
        .get("http://localhost:5000/subscription-plans")
        .then((res) => {
          setSubscriptionPlans(res.data);
        })
        .catch((err) => console.error("Failed to load plans:", err));
    }
  }, [role]);

  // Real-time email & password validation
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (email) {
        axios
          .post("http://localhost:5000/auth/check-email", { email })
          .then((res) => setEmailExists(res.data.exists))
          .catch((err) => console.error("Email check failed:", err));
      }

      if (password) {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
          setValidPassword(
            "Password must be at least 8 characters long, contain uppercase, lowercase, and a number."
          );
        } else setValidPassword("");
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [email, password]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!role) return setErrorMessage("Please select a role.");

    // Candidate / Mentor
    if (role === "candidate" || role === "mentor") {
      if (!firstName || !lastName || !email || !password || !confirmPassword)
        return setErrorMessage("Please fill in all fields.");

      if (emailExists) return setErrorMessage("Email already in use.");
      if (validPassword) return setErrorMessage(validPassword);
      if (password !== confirmPassword)
        return setErrorMessage("Passwords do not match.");

      try {
        await axios.post("http://localhost:5000/auth/signup", {
          firstName,
          lastName,
          email,
          password,
          role,
        });
        toast.success("Signup successful!");
        navigate("/login");
      } catch (err) {
        setErrorMessage(err.response?.data?.message || "Signup failed.");
      }
    }

    // Recruiter
    else if (role === "recruiter") {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !address ||
        !companyId
      )
        return setErrorMessage("Please fill all required fields.");

      if (emailExists) return setErrorMessage("Email already in use.");
      if (validPassword) return setErrorMessage(validPassword);
      if (password !== confirmPassword)
        return setErrorMessage("Passwords do not match.");

      try {
        await axios.post("http://localhost:5000/auth/signup", {
          firstName,
          lastName,
          email,
          password,
          role,
          address,
          companyId,
        });
        toast.success("Recruiter signup successful!");
        navigate("/login");
      } catch (err) {
        setErrorMessage(err.response?.data?.message || "Signup failed.");
      }
    }

    // Company
    else if (role === "company") {
      if (
        !companyName ||
        !contactPerson ||
        !email ||
        !password ||
        !confirmPassword ||
        !industry ||
        !companySize ||
        !companyAddress ||
        !passkey ||
        !selectedPlan
      )
        return setErrorMessage("Please fill all required fields.");

      if (emailExists) return setErrorMessage("Email already in use.");
      if (validPassword) return setErrorMessage(validPassword);
      if (password !== confirmPassword)
        return setErrorMessage("Passwords do not match.");

      try {
        await axios.post("http://localhost:5000/company/register", {
          companyName,
          contactPerson,
          email,
          phone,
          website,
          industry,
          companySize,
          address: companyAddress,
          description,
          passkey,
          subscriptionPlan: selectedPlan,
        });
        toast.success("Company registration request submitted!");
        navigate("/login");
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Company registration failed."
        );
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-side">
          <a href="/">
            <img src={logo} alt="Workify Logo" className="logo" />
          </a>
        </div>
        <div className="right-side">
          <h1 className="login-title">Signup</h1>

          <form onSubmit={handleSubmit} className="login-form">
            {errorMessage && <span className="msg">{errorMessage}</span>}

            {/* Role selection */}
            <select
              className="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role*</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
              <option value="company">Company</option>
              <option value="mentor">Mentor</option>
            </select>

            {/* Candidate / Mentor */}
            {(role === "candidate" || role === "mentor") && (
              <>
                <div className="name-inputs">
                  <input
                    type="text"
                    placeholder="First Name*"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name*"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email: john@example.com*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailExists && <span className="msg">Email already exists!</span>}

                {/* Passwords */}
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password*"
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
                    placeholder="Retype Password*"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="visibility"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </>
            )}

            {/* Recruiter */}
            {role === "recruiter" && (
              <>
                <div className="name-inputs">
                  <input
                    type="text"
                    placeholder="First Name*"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name*"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Address*"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Company ID*"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  required
                />
                {/* Passwords */}
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password*"
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
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Retype Password*"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="visibility"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </>
            )}

            {/* Company */}
            {role === "company" && (
              <>
                <input
                  type="text"
                  placeholder="Company Name*"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Person*"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Industry*"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Company Size*"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Address*"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                ></textarea>
                <input
                  type="text"
                  placeholder="Passkey*"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                />

                <div className="subscription-section">
                  <h4>Select Subscription Plan*</h4>
                  {subscriptionPlans.length === 0 ? (
                    <p>Loading plans...</p>
                  ) : (
                    subscriptionPlans.map((plan) => (
                      <label key={plan._id} className="plan-option">
                        <input
                          type="radio"
                          name="subscription"
                          value={plan._id}
                          checked={selectedPlan === plan._id}
                          onChange={() => setSelectedPlan(plan._id)}
                          required
                        />
                        <span>
                          {plan.name} - ₹{plan.price} ({plan.billingCycle})
                        </span>
                      </label>
                    ))
                  )}
                </div>

                {/* Passwords */}
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password*"
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
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Retype Password*"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="visibility"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </>
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

            <p className="redirect-link">
              Already have an account?{" "}
              <a href="/login" className="signup-link">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
