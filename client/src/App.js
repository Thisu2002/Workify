import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mentor from "./pages/Mentor";
import LeadPanelist from "./pages/LeadPanelist";

import RecruiterDashboard from "./pages/RecruiterDashboard";


import PostJob from "./pages/PostJob";


const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/lead-panelist" element={<LeadPanelist />} />

        <Route path="/recruiter" element={<RecruiterDashboard />} />

        <Route path="/recruiter/post-job" element={<PostJob />} />

      </Routes>
    </Router> 
  );
};

export default App;