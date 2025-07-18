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
import CandidateRoot from "./pages/CandidateRoot";
import MentorRoot from "./pages/MentorRoot"; // Add this import

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
        <Route path="/lead-panelist" element={<LeadPanelist />} />

        {/* Mentor Routes */}
        <Route path="/mentor" element={<MentorRoot />} />
        <Route path="/mentor/overview" element={<MentorRoot />} />
        <Route path="/mentor/sessions" element={<MentorRoot />} />
        <Route path="/mentor/requests" element={<MentorRoot />} />
        <Route path="/mentor/history" element={<MentorRoot />} />
        
        {/* Existing routes */}
        <Route path="/recruiter" element={<RecruiterRoot />} />
        <Route path="/recruiter/overview" element={<RecruiterRoot />} />
        <Route path="/recruiter/job-posts" element={<RecruiterRoot />} />
        <Route path="/recruiter/job-posts/applicants" element={<RecruiterRoot />} />
        <Route path="/recruiter/applications" element={<RecruiterRoot />} />

        <Route path="/candidate" element={<CandidateRoot />} />
        <Route path="/candidate/overview" element={<CandidateRoot />} />
        <Route path="/candidate/findjob" element={<CandidateRoot />} />
        <Route path="/candidate/interviews" element={<CandidateRoot />} />
        <Route path="/candidate/careeradvice" element={<CandidateRoot />} />

        <Route path="/admin" element={<AdminRoot />} />
        <Route path="/admin/overview" element={<AdminRoot />} />
        <Route path="/admin/analytics" element={<AdminRoot />} />
        <Route path="/admin/users" element={<AdminRoot />} />

        <Route path="/manager" element={<BusinessManagerRoot />} />
        <Route path="/manager/overview" element={<BusinessManagerRoot />} />
        <Route path="/manager/company-profiles" element={<BusinessManagerRoot />} />
        <Route path="/manager/userAccounts" element={<BusinessManagerRoot />} />
        <Route path="/manager/registration-requests" element={<BusinessManagerRoot />} />
        <Route path="/manager/mentor-verification" element={<BusinessManagerRoot />} />
        <Route path="/manager/blacklist-requests" element={<BusinessManagerRoot />} />
        {/* <Route path="/recruiter/job-posts" element={<JobPosts />} /> */}

      </Routes>
    </Router> 
  );
};

export default App;