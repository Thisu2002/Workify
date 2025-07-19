import React from "react";
import { useLocation } from "react-router-dom";
import Overview from "./Overview";
import PanelManagement from "./PanelManagement";
import Interviews from "./Interviews";
import Evaluations from "./Evaluations";
import Feedback from "./Feedback";
import { Box } from "@mui/material";
import "../../styles/LeadPanelist.css";

const LeadPanelistContent = () => {
  const location = useLocation();

  return (
    <Box>
      {location.pathname === "/lead-panelist" && <Overview />}
      {location.pathname === "/lead-panelist/overview" && <Overview />}
      {location.pathname === "/lead-panelist/panels" && <PanelManagement />}
      {location.pathname === "/lead-panelist/interviews" && <Interviews />}
      {location.pathname === "/lead-panelist/evaluations" && <Evaluations />}
      {location.pathname === "/lead-panelist/feedback" && <Feedback />}
    </Box>
  );
};

export default LeadPanelistContent;
