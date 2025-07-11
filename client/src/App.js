import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mentor from "./pages/Mentor";
import LeadPanelist from "./pages/LeadPanelist";
import RecruiterDashboard from "./pages/RecruiterDashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/lead-panelist" element={<LeadPanelist />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Routes>
    </Router> 
  );
};

export default App;