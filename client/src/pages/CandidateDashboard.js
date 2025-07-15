import React, { useState} from 'react';
import {
  Box,
  Card,
  CardContent,
  alpha,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  Button,
  Zoom,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  AddCircle,
  AccessTime,
  Star,
  CheckCircle,
  Person,
  WorkOutline,
  AssignmentInd,
  Schedule,
  Feedback,
  EventNote,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as ExpertIcon,
  FiberManualRecord as OnlineIcon,
  Cancel, // Add this import
  School, // Add this import
} from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "../styles/Recruiter.css";
import Header from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Candidate/Overview";
import Interviews from "../components/Candidate/Interviews";
//import ApplicationTracker from '../components/Candidate/ApplicationTracker';


const menuTabs = [
  { id: "overview", label: "Overview", icon: <Person /> },
  { id: "jobs", label: "Find Job", icon: <WorkOutline /> },
  { id: "interviews", label: "Interviews", icon: <AssignmentInd /> },
  { id: "advices", label: "Career Advices", icon: <Feedback /> },
];

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [trackerTab, setTrackerTab] = useState(0);
  const open = Boolean(anchorEl);

  const applications = [
    { id: 1, name: "John Doe", position: "Frontend Developer", status: "pending" },
    { id: 2, name: "Jane Smith", position: "Backend Developer", status: "accepted" },
    { id: 3, name: "Sam Lee", position: "UI Designer", status: "rejected" },
    { id: 4, name: "Priya Sharma", position: "QA Engineer", status: "pending" },
  ];

  const getFilteredApplications = (status) =>
    applications.filter((app) => app.status === status);

  return (
    <Box className="recruiter-dashboard-root">
      <Sidebar
        menuTabs={menuTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRecruiter={false}
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
                {activeTab === "overview" && <Overview />}
                {/*{activeTab === 'applications' && <Applications />}
                {activeTab === 'interviews' && <Interviews />}
                {activeTab === 'feedback' && <Feedback />} */}
              </Box>
              {activeTab === "interviews" && (
        <Box sx={{ mt: 4 }}>
          <Interviews />
        </Box>
      )}
            </Box>
    

      
    </Box>
  );
};

export default CandidateDashboard;
