import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from "@mui/material";
import {
  Add,
  Person,
  WorkOutline,
  AssignmentInd,
  Schedule,
  Feedback,
  EventNote,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as ExpertIcon,
  FiberManualRecord as OnlineIcon,
  Close as CloseIcon,
  AccountCircle
} from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import Overview from "../components/Recruiter/Overview";
import "../styles/Recruiter.css";
import logo from "../images/Group 3.png";

const menuTabs = [
  { id: 'overview', label: 'Overview', icon: <Person /> },
  { id: 'jobs', label: 'Job Posts', icon: <WorkOutline /> },
  { id: 'applications', label: 'Applications', icon: <AssignmentInd /> },
  { id: 'interviews', label: 'Interviews', icon: <Schedule /> },
  { id: 'feedback', label: 'Feedback', icon: <Feedback /> }
];

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Box className="recruiter-dashboard-root">
      {/* Sidebar */}
      <Box className="recruiter-sidebar">
        <Box className="sidebar-logo" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, mt: 2 }}>
          <img src={logo} alt="Workify Logo" style={{ width: 80, height: 80, objectFit: 'contain' }} />
        </Box>
        <List>
          {menuTabs.map((tab) => (
            <ListItem
              button
              key={tab.id}
              selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{tab.icon}</ListItemIcon>
              <ListItemText primary={tab.label} />
            </ListItem>
          ))}
        </List>
        <Button
          className="new-button nav-short-btn"
          variant="contained"
          startIcon={<Add sx={{ fontSize: 28, fontWeight: 700 }} />}
          sx={{ mt: 4, width: '90%', alignSelf: 'center' }}
        >
          New Job Post
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box className="recruiter-main-content">
        {/* Header */}
        <Box className="recruiter-header" display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold" className="page-title">
            {menuTabs.find(tab => tab.id === activeTab)?.label}
          </Typography>
          <IconButton
            className="profile-icon-btn"
            size="large"
            sx={{ ml: 2 }}
            onClick={() => {/* handle profile view logic here */}}
          >
            <AccountCircle sx={{ fontSize: 38 }} />
          </IconButton>
        </Box>

        {/* Page Content */}
        <Box className="recruiter-content-area">
          {activeTab === 'overview' && <Overview />}
          {/* {activeTab === 'jobs' && renderJobPosts()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'interviews' && renderInterviews()}
          {activeTab === 'feedback' && renderFeedback()} */}
        </Box>
      </Box>
    </Box>
  );
};

export default RecruiterDashboard;