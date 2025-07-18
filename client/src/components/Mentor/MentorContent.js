import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Overview from "./Overview";
import Sessions from "./Sessions";
import Requests from "./Requests";
import History from "./History";
import { Box } from "@mui/material";
import "../../styles/Recruiter.css";

const MentorContent = ({ showSessionForm, setShowSessionForm, setPageTitle }) => {
  const location = useLocation();

  // Update the page title based on the current path
  useEffect(() => {
    if (location.pathname.includes('sessions')) {
      setPageTitle("Mentoring Sessions");
    } else if (location.pathname.includes('requests')) {
      setPageTitle("Mentoring Requests");
    } else if (location.pathname.includes('history')) {
      setPageTitle("Session History");
    } else {
      setPageTitle("Mentor Dashboard");
    }
  }, [location.pathname, setPageTitle]);

  return (
    <Box>
      {location.pathname === "/mentor" && <Overview />}
      {location.pathname === "/mentor/overview" && <Overview />}
      {location.pathname === "/mentor/sessions" && (
        <Sessions setShowSessionForm={setShowSessionForm} showSessionForm={showSessionForm} />
      )}
      {location.pathname === "/mentor/requests" && <Requests />}
      {location.pathname === "/mentor/history" && <History />}
    </Box>
  );
};

export default MentorContent;
