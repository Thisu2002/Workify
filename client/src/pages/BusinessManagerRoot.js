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
  Domain,
  Subscriptions,
  InsertChart as InsertChartIcon,
  Block as BlockIcon,
  VerifiedUser as VerifiedUserIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import ManagerContent from "../components/BusinessManager/ManagerContent";
import "../styles/BusinessManager.css";

const menuTabs = [
  {
    id: "overview",
    label: "Overview",
    path: "/manager/overview",
    icon: <Person />,
  },
  {
    id: "registration-requests",
    label: "Registration Requests",
    path: "/manager/registration-requests",
    icon: <AssignmentInd />,
  },
  {
    id: "companyProfiles",
    label: "Company Profiles",
    path: "/manager/company-profiles",
    icon: <Domain />,
  },
  {
    id: "userAccounts",
    label: "User Accounts",
    path: "/manager/userAccounts",
    icon: <Group />,
  },
  {
    id: "blacklist",
    label: "Candidate Blacklist",
    path: "/manager/blacklist-requests",
    icon: <BlockIcon />,
  },
  {
    id: "mentorVerification",
    label: "Mentor Verification",
    path: "/manager/mentor-verification",
    icon: <VerifiedUserIcon />,
  },
  {
    id: "jobPostings",
    label: "Job Postings",
    path: "/manager/job-postings",
    icon: <WorkOutline />,
  },
  {
    id: "reports",
    label: "Reports",
    path: "/manager/reports",
    icon: <InsertChartIcon />,
  },
  {
    id: "subscription-plans",
    label: "Subscription Plans",
    path: "/manager/subscription-plans",
    icon: <Subscriptions  />,
  },
];

const BusinessManagerRoot = () => {
  const location = useLocation();

  const activeLabel =
    menuTabs.find((tab) => location.pathname.startsWith(tab.path))?.label ||
    "Overview";

  return (
    <Box className="manager-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        isRecruiter={false}
      />

      <Box className="manager-main-content">
        <TopBar
          title={activeLabel}
          onProfileClick={() => {
            // handle profile logic here
          }}
        />

        <Box className="manager-content-area">
          <ManagerContent
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessManagerRoot;
