import React, { useState} from 'react';
import {
  Box
} from "@mui/material";
import {
  Person,
  WorkOutline,
  AssignmentInd,
  Feedback
} from "@mui/icons-material";
import "../styles/Recruiter.css";
import Header from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Candidate/Overview";
import Interviews from "../components/Candidate/Interviews";
import ApplicationTracker from '../components/Candidate/ApplicationTracker';
import FindJobs from '../components/Candidate/FindJobs';
import CareerAdvice from '../components/Candidate/CareerAdvice';

const menuTabs = [
  { id: "overview", label: "Overview", icon: <Person /> },
  { id: "jobs", label: "Find Job", icon: <WorkOutline /> },
  { id: "interviews", label: "Interviews", icon: <AssignmentInd /> },
  { id: "advices", label: "Career Advices", icon: <Feedback /> },
];

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [trackerTab, setTrackerTab] = useState(0);
  const open = Boolean(anchorEl);

  return (
    <Box className="recruiter-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRecruiter={false}
      />
      <Box className="recruiter-main-content">
              {/* Reusable Header */}
              <Header
                title={menuTabs.find((tab) => tab.id === activeTab)?.label}
                onProfileClick={() => {
                  // handle profile logic here
                }}
              />
      
              {/* Page Content */}
              <Box className="recruiter-content-area">
                {activeTab === "overview" && (
                  <>
                    <Overview />
                    <ApplicationTracker
                trackerTab={trackerTab}
                setTrackerTab={setTrackerTab}
              />
                  </>
                )}
                {activeTab === "jobs" && <FindJobs />}
                {activeTab === "interviews" && <Interviews />}
                {activeTab === "advices" && <CareerAdvice />}
              </Box>
            </Box>
    

      
    </Box>
  );
};

export default CandidateDashboard;
