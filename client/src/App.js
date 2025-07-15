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
import CandidateDashboard from "./pages/CandidateDashboard";


import AdminDashboard from "./pages/AdminDashboard";
=======
import JobPosts from "./components/Recruiter/JobPosts";



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
        <Route path="/candidate" element={<CandidateDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />


        {/* <Route path="/recruiter/job-posts" element={<JobPosts />} /> */}

      </Routes>
    </Router> 
  );
};

export default App;