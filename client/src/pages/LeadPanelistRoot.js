import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import {
  Person,
  Group,
  Assessment,
  Schedule,
  Feedback,
} from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import LeadPanelistContent from "../components/LeadPanelist/LeadPanelistContent";
import "../styles/LeadPanelist.css";

const menuTabs = [
  {
    id: "overview",
    label: "Overview",
    path: "/lead-panelist/overview",
    icon: <Person />,
  },
  {
    id: "panels",
    label: "Panel Management",
    path: "/lead-panelist/panels",
    icon: <Group />,
  },
  {
    id: "interviews",
    label: "Interviews",
    path: "/lead-panelist/interviews",
    icon: <Schedule />,
  },
  {
    id: "evaluations",
    label: "Evaluations",
    path: "/lead-panelist/evaluations",
    icon: <Assessment />,
  },
  {
    id: "feedback",
    label: "Feedback",
    path: "/lead-panelist/feedback",
    icon: <Feedback />,
  },
];

const LeadPanelistRoot = () => {
  const location = useLocation();

  const activeLabel =
    menuTabs.find((tab) => location.pathname.startsWith(tab.path))?.label ||
    "Overview";

  return (
    <Box className="lead-panelist-dashboard-root">
      <Sidebar menuTabs={menuTabs} isLeadPanelist={true} />

      <Box className="lead-panelist-main-content">
        <TopBar
          title={activeLabel}
          onProfileClick={() => {
            // handle profile logic here
          }}
        />

        <Box className="lead-panelist-content-area">
          <LeadPanelistContent />
        </Box>
      </Box>
    </Box>
  );
};

export default LeadPanelistRoot;
