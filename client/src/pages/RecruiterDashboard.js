import React, { useState, useEffect } from 'react';
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
  Add,
  Person,
  WorkOutline,
  AssignmentInd,
  Schedule,
  Feedback,
  EventNote,
  VerifiedUser as VerifiedIcon,
  EmojiEvents as ExpertIcon,
  FiberManualRecord as OnlineIcon
} from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import Overview from "../components/Recruiter/Overview";
import "../styles/Recruiter.css";

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const StatCard = ({ icon, title, value, change, color = '#96BEC5' }) => (
    <Zoom in={!loading} style={{ transitionDelay: '200ms' }}>
      <Card className="recruiter-stat-card">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" className="stat-title">
                {title}
              </Typography>
              <Typography variant="h3" className="stat-value" sx={{ color }}>
                {value}
              </Typography>
              <Typography variant="caption" className="stat-change">
                {change}
              </Typography>
            </Box>
            <Box className="stat-icon" sx={{ backgroundColor: alpha(color, 0.1) }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  return (
    <Box className="recruiter-dashboard-container">

      {/* Navigation */}
      <Paper className="recruiter-navigation" elevation={0}>
        <Box className="recruiter-nav-container">
          {[
            {
              id: 'overview',
              label: 'Overview',
              icon: <Person />
            },
            {
              id: 'jobs',
              label: 'Job Posts',
              icon: <WorkOutline />
            },
            {
              id: 'applications',
              label: 'Applications',
              icon: <AssignmentInd />
            },
            {
              id: 'interviews',
              label: 'Interviews',
              icon: <Schedule />
            },
            {
              id: 'feedback',
              label: 'Feedback',
              icon: <Feedback />
            }
          ].map((tab) => (
            <Button
              key={tab.id}
              className={`recruiter-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              startIcon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
              sx={{ position: 'relative' }}
            >
              {tab.label}
              {/* {tab.badge > 0 && (
                <Chip 
                  label={tab.badge} 
                  size="small" 
                  className="nav-badge"
                />
              )} */}
            </Button>
          ))}

          <Button className="new-button nav-short-btn" 
                  variant="contained" 
                  startIcon={<Add />}
                  sx={{ marginLeft: 'auto' }}
          >
            New Job Post
          </Button>
        </Box>
      </Paper>

      {activeTab === 'overview' && <Overview />}
      {/* {activeTab === 'jobs' && renderJobPosts()}
      {activeTab === 'applications' && renderApplications()}
      {activeTab === 'interviews' && renderInterviews()}
      {activeTab === 'feedback' && renderFeedback()} */}

      

    </Box>
  );
};

export default RecruiterDashboard;
