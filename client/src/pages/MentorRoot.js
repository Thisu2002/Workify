import React, { useState } from "react";
import { Box } from "@mui/material";
import { Dashboard, People, School, History } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MentorContent from "../components/Mentor/MentorContent"; // Make sure capitalization matches disk

const MentorRoot = () => {
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [pageTitle, setPageTitle] = useState("Mentor Dashboard");
  
  const mentorTabs = [
    {
      id: 1,
      label: "Overview",
      path: "/mentor/overview",
      icon: <Dashboard />,
    },
    {
      id: 2,
      label: "Sessions",
      path: "/mentor/sessions",
      icon: <School />,
    },
    {
      id: 3,
      label: "Requests",
      path: "/mentor/requests",
      icon: <People />,
    },
    {
      id: 4,
      label: "History",
      path: "/mentor/history",
      icon: <History />,
    },
  ];

  return (
    <Box sx={{ 
      display: "flex", 
      width: "100%", 
      height: "100vh",
      backgroundColor: "#f6f8fb"
    }}>
      <Sidebar 
        menuTabs={mentorTabs} 
        isMentor={true} 
        setShowSessionForm={setShowSessionForm} 
      />
      <Box sx={{ 
        flexGrow: 1, 
        overflow: "auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        <Topbar title={pageTitle} />
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <MentorContent 
            showSessionForm={showSessionForm}
            setShowSessionForm={setShowSessionForm}
            setPageTitle={setPageTitle}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MentorRoot;
