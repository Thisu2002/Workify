import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mentor from "./pages/Mentor";
import LeadPanelist from "./pages/LeadPanelist";

import RecruiterRoot from "./pages/RecruiterRoot";
import CandidateDashboard from "./pages/CandidateDashboard";


import AdminRoot from "./pages/AdminRoot";

import BusinessManagerRoot from "./pages/BusinessManagerRoot";

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

        <Route path="/recruiter" element={<RecruiterRoot />} />
        <Route path="/recruiter/overview" element={<RecruiterRoot />} />
        <Route path="/recruiter/job-posts" element={<RecruiterRoot />} />
        <Route path="/candidate" element={<CandidateDashboard />} />

        <Route path="/admin" element={<AdminRoot />} />
        <Route path="/admin/overview" element={<AdminRoot />} />
        <Route path="/admin/analytics" element={<AdminRoot />} />
        <Route path="/admin/users" element={<AdminRoot />} />

        <Route path="/manager" element={<BusinessManagerRoot />} />
        <Route path="/manager/overview" element={<BusinessManagerRoot />} />
        <Route path="/manager/company-profiles" element={<BusinessManagerRoot />} />

        {/* <Route path="/recruiter/job-posts" element={<JobPosts />} /> */}

      </Routes>
    </Router> 
  );
};

export default App;