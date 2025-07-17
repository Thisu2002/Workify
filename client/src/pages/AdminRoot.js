import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import {
  Person,
  WorkOutline,
  AssignmentInd,
  Schedule,
  Feedback,
  Group,
  Close as CloseIcon,
} from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import AdminContent from "../components/Admin/AdminContent";
import "../styles/Admin.css";

const menuTabs = [
  {
    id: "overview",
    label: "Overview",
    path: "/admin/overview",
    icon: <Person />,
  },
  {
    id: "users",
    label: "User Managemnet",
    path: "/admin/users",
    icon: <Group />,
  },
  {
    id: "reports",
    label: "Reports",
    path: "/admin/reports",
    icon: <AssignmentInd />,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/admin/analytics",
    icon: <Schedule />,
  },
  {
    id: "feedback",
    label: "Feedback",
    path: "/admin/feedback",
    icon: <Feedback />,
  },
];

const AdminRoot = () => {
  const location = useLocation();

  const activeLabel =
    menuTabs.find((tab) => location.pathname.startsWith(tab.path))?.label ||
    "Overview";

  return (
    <Box className="admin-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        isRecruiter={false}
      />

      <Box className="admin-main-content">
        <TopBar
          title={activeLabel}
          onProfileClick={() => {
            // handle profile logic here
          }}
        />

        <Box className="admin-content-area">
          <AdminContent
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminRoot;
