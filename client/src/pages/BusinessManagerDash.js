import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import {
  Person,
  WorkOutline,
  AssignmentInd,
  Feedback,
  Group,
  Domain,
  BarChart as BarChartIcon,
  InsertChart as InsertChartIcon,
  Block as BlockIcon,
  VerifiedUser as VerifiedUserIcon,
  Gavel as GavelIcon
} from "@mui/icons-material";


import Sidebar from "../components/Sidebar";
import Header from "../components/Topbar"; // <-- new import
import Overview from "../components/BusinessManager/Overview";

import "../styles/Admin.css";

const menuTabs = [
  { id: "overview", label: "Overview", icon: <Person /> },
  { id: "registrationRequests", label: "Registration Requests", icon: <AssignmentInd /> },
  { id: "companyProfiles", label: "Company Profiles", icon: <Domain /> },
  { id: "userAccounts", label: "User Accounts", icon: <Group /> },
  { id: "blacklist", label: "Candidate Blacklist", icon: <BlockIcon /> },
  { id: "mentorVerification", label: "Mentor Verification", icon: <VerifiedUserIcon /> },
  { id: "jobPostings", label: "Job Postings", icon: <WorkOutline /> },
  { id: "reports", label: "Reports", icon: <InsertChartIcon /> }
];


const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobForm, setShowJobForm] = useState(false);

  return (
    <Box className="manager-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Box className="manager-main-content">
        {/* Reusable Header */}
        <Header
          title={menuTabs.find((tab) => tab.id === activeTab)?.label}
          onProfileClick={() => {
            // handle profile logic here
          }}
        />

        {/* Page Content */}
        <Box className="manager-content-area">
          {activeTab === "overview" && <Overview />}
          {activeTab === "jobs" ? (
              <Box
                position="relative"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                }}
              >
                
              </Box>
          ) : null}
          {/*{activeTab === 'applications' && <Applications />}
          {activeTab === 'interviews' && <Interviews />}
          {activeTab === 'feedback' && <Feedback />} */}
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
