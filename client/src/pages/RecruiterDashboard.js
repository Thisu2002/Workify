  import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import {
  Person,
  WorkOutline,
  AssignmentInd,
  Schedule,
  Feedback,
  Close as CloseIcon,
} from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import Header from "../components/Topbar"; // <-- new import
import Overview from "../components/Recruiter/Overview";
import JobPosts from "../components/Recruiter/JobPosts";
import PostJobs from "../components/Recruiter/PostJob";
import "../styles/Recruiter.css";

const menuTabs = [
  { id: "overview", label: "Overview", icon: <Person /> },
  { id: "jobs", label: "Job Posts", icon: <WorkOutline /> },
  { id: "applications", label: "Applications", icon: <AssignmentInd /> },
  { id: "interviews", label: "Interviews", icon: <Schedule /> },
  { id: "feedback", label: "Feedback", icon: <Feedback /> },
];

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobForm, setShowJobForm] = useState(false);

  return (
    <Box className="recruiter-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRecruiter={true}
        setShowJobForm={setShowJobForm}
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
          {activeTab === "overview" && <Overview setActiveTab={setActiveTab} />}
          {activeTab === "jobs" ? (
            showJobForm ? (
              <Box
                position="relative"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                }}
              >
                <IconButton
                  onClick={() => setShowJobForm(false)}
                  sx={{ position: "absolute", top: 10, right: 450 }}
                >
                  <CloseIcon />
                </IconButton>
                <PostJobs /> <JobPosts />
              </Box>
            ) : (
              <JobPosts />
            )
          ) : null}
          {/*{activeTab === 'applications' && <Applications />}
          {activeTab === 'interviews' && <Interviews />}
          {activeTab === 'feedback' && <Feedback />} */}
        </Box>
      </Box>
    </Box>
  );
};

export default RecruiterDashboard;
