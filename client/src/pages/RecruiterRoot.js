import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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
import TopBar from "../components/Topbar";
import RecruiterContent from "../components/Recruiter/RecruiterContent";
import "../styles/Recruiter.css";

const menuTabs = [
  {
    id: "overview",
    label: "Overview",
    path: "/recruiter/overview",
    icon: <Person />,
  },
  {
    id: "jobs",
    label: "Job Posts",
    path: "/recruiter/job-posts",
    icon: <WorkOutline />,
  },
  {
    id: "applications",
    label: "Applications",
    path: "/recruiter/applications",
    icon: <AssignmentInd />,
  },
  {
    id: "interviews",
    label: "Interviews",
    path: "/recruiter/interviews",
    icon: <Schedule />,
  },
  {
    id: "feedback",
    label: "Feedback",
    path: "/recruiter/feedback",
    icon: <Feedback />,
  },
];

const RecruiterRoot = () => {
  const location = useLocation();
  const [showJobForm, setShowJobForm] = useState(false);

  const activeLabel =
    menuTabs.find((tab) => location.pathname.startsWith(tab.path))?.label ||
    "Overview";

  return (
    <Box className="recruiter-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        isRecruiter={true}
        setShowJobForm={setShowJobForm}
      />

      <Box className="recruiter-main-content">
        <TopBar
          title={activeLabel}
          onProfileClick={() => {
            // handle profile logic here
          }}
        />

        <Box className="recruiter-content-area">
          <RecruiterContent
            showJobForm={showJobForm}
            setShowJobForm={setShowJobForm}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RecruiterRoot;
