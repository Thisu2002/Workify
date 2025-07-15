import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import {
  Person,
  WorkOutline,
  AssignmentInd,
  Schedule,
  Feedback,
  Close as CloseIcon,
  Group,
} from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import Header from "../components/Topbar"; // <-- new import
import Overview from "../components/Admin/Overview";

import "../styles/Admin.css";

const menuTabs = [
  { id: "overview", label: "Overview", icon: <Person /> },
    { id: 'users', label: 'User Management', icon: <Group /> },
    { id: 'reports', label: 'Reports', icon: <AssignmentInd /> },
    { id: 'analytics', label: 'Analytics', icon: <Schedule /> },
    { id: 'feedback', label: 'Feedback', icon: <Feedback /> }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobForm, setShowJobForm] = useState(false);

  return (
    <Box className="admin-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Box className="admin-main-content">
        {/* Reusable Header */}
        <Header
          title={menuTabs.find((tab) => tab.id === activeTab)?.label}
          onProfileClick={() => {
            // handle profile logic here
          }}
        />

        {/* Page Content */}
        <Box className="admin-content-area">
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

export default AdminDashboard;
