import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { Person, WorkOutline, AssignmentInd, Feedback } from "@mui/icons-material";

import "../styles/Candidate.css";
import TopBar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import CandidateContent from "../components/Candidate/CandidateContent";

const menuTabs = [
  { id: "overview", label: "Overview", path: "/candidate/overview", icon: <Person /> },
  { id: "jobs", label: "Find Job", path: "/candidate/findjob", icon: <WorkOutline /> },
  { id: "interviews", label: "Interviews", path: "/candidate/interviews", icon: <AssignmentInd /> },
  { id: "advices", label: "Career Advices", path: "/candidate/careeradvice", icon: <Feedback /> },
];

const CandidateRoot = () => {
  const location = useLocation();

  let activeLabel;
  if (location.pathname === "/candidate/profile") {
    activeLabel = "My Profile";
  } else {
    // This is the original logic for other pages
    activeLabel =
      menuTabs.find((tab) => location.pathname.startsWith(tab.path))?.label || "Overview";
  }

  return (
    <Box className="recruiter-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        isRecruiter={false}
      />
      <Box className="recruiter-main-content">
              <TopBar
          title={activeLabel}
          onProfileClick={() => {
            // handle profile logic here
          }}
            />

              <Box className="recruiter-content-area">
          <CandidateContent />
              </Box>
      </Box>
    </Box>
  );
};

export default CandidateRoot;
