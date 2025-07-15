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
  ListItemText,
  Menu,
  MenuItem,
  IconButton
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
import InterviewsTab from '../components/Candidate/Interviews';

const StatCard = ({ icon, title, value, change, color = '#96BEC5', loading }) => (
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

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [trackerTab, setTrackerTab] = useState(0);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Sample application data
  const applications = [
    { id: 1, name: "John Doe", position: "Frontend Developer", status: "pending" },
    { id: 2, name: "Jane Smith", position: "Backend Developer", status: "accepted" },
    { id: 3, name: "Sam Lee", position: "UI Designer", status: "rejected" },
    { id: 4, name: "Priya Sharma", position: "QA Engineer", status: "pending" },
  ];

  const getFilteredApplications = (status) =>
    applications.filter((app) => app.status === status);

  return (
    <Box className="recruiter-dashboard-container" sx={{ position: "relative" }}>
      {/* Profile Icon Top Right */}
      <Box sx={{ position: "absolute", top: 6, right: 30, zIndex: 10 }}>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleProfileClick}
        >
          <AccountCircle fontSize="large" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Box>

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
              label: 'Find Jobs',
              icon: <WorkOutline />
            },
            {
              id: 'interviews',
              label: 'Interviews',
              icon: <AssignmentInd />
            },
            {
              id: 'advices',
              label: 'Career Advices',
              icon: <School />
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
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Top Welcome Section
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Avatar
            alt="Recruiter"
            src="https://randomuser.me/api/portraits/men/75.jpg"
            sx={{ width: 80, height: 80 }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h5">
            Welcome <strong>back, Recruiter!</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiring Manager • 5 years experience
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip label="Verified" color="success" size="small" sx={{ mr: 1 }} />
            <Chip label="Recruiter" color="info" size="small" />
          </Box>
        </Grid>

        {/* Summary Stat Cards 
        <Grid item container xs={12} md={4} spacing={2}>
          <Grid item xs={4}>
            <Paper className="recruiter-stat-card">
              <Typography variant="body2">Total Job Posts</Typography>
              <Typography variant="h6">28</Typography>
              <Typography variant="caption" color="success.main">+5 this month</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="recruiter-stat-card">
              <Typography variant="body2">Applications Received</Typography>
              <Typography variant="h6">102</Typography>
              <Typography variant="caption">New this week</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className="recruiter-stat-card">
              <Typography variant="body2">Interviews Scheduled</Typography>
              <Typography variant="h6">14</Typography>
              <Typography variant="caption">Ongoing</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid> */}

      <Paper className="recruiter-dashboard-header" elevation={0}>
        <Box className="recruiter-header-content">
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
                sx={{ width: 80, height: 80, border: '3px solid #96BEC5' }}
              />
              <OnlineIcon 
                className="online-indicator"
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  right: 5,
                  color: '#10b981',
                  backgroundColor: '#0F2445',
                  borderRadius: '50%',
                  fontSize: 16,
                  padding: '2px'
                }}
              />
            </Box>
            <Box>
              <Typography variant="h4" className="recruiter-welcome-text">
                Welcome back, Nethumini Lankathilaka!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Software Engineer • 3 years experience
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Verified" 
                  size="small" 
                  className="verified-badge"
                />
                <Chip 
                  icon={<ExpertIcon />} 
                  label="Job Seeker" 
                  size="small" 
                  className="expert-badge"
                />
              </Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Grid container spacing={2} wrap="nowrap">
              <Grid item xs={4}>
                <StatCard 
                  loading={loading}
                  icon={<WorkOutline />}
                  title="Jobs Applied"
                  value="28"
                  // change="+5 this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  loading={loading}
                  icon={<EventNote />}
                  title="Upcoming Interviews"
                  value="11"
                  // change="New this month"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      {/* Overview Cards
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Open Job Posts</Typography>
            <Typography variant="h5">8</Typography>
            <Chip icon={<AddCircle />} label="2 new this week" size="small" />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Pending Applications</Typography>
            <Typography variant="h5">35</Typography>
            <Chip icon={<AddCircle />} label="+7 this week" size="small" />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Shortlisted Candidates</Typography>
            <Typography variant="h5">12</Typography>
            <Chip icon={<Star />} label="Promising profiles" size="small" />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="recruiter-overview-card">
            <Typography variant="body2">Upcoming Interviews</Typography>
            <Typography variant="h5">5</Typography>
            <Chip icon={<AccessTime />} label="Next at 3PM" size="small" />
          </Paper>
        </Grid>
      </Grid> */}

      {/* Recent Activity
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
        <List>
          <ListItem sx={{ mb: 1 }}>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText
              primary="Interview feedback submitted for James Miller"
              secondary="1 hour ago"
            />
          </ListItem>
          <ListItem sx={{ mb: 1 }}>
            <ListItemIcon><AddCircle color="primary" /></ListItemIcon>
            <ListItemText
              primary="New job post: Senior UI/UX Designer"
              secondary="Today at 9:00 AM"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><EventNote color="warning" /></ListItemIcon>
            <ListItemText
              primary="Interview scheduled with Priya Sharma"
              secondary="Tomorrow at 11:00 AM"
            />
          </ListItem>
        </List>
      </Box> */}

      <Box
        sx={{
          mt: 4,
          mb: 2,
          maxWidth: 1300,
          mx: "auto",
          p: 3,
          borderRadius: 3,
          boxShadow: 2,
          background: "rgba(240,245,255,0.7)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}>
          Application Tracker
        </Typography>
        <Tabs
          value={trackerTab}
          onChange={(_, newValue) => setTrackerTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': { fontWeight: 500, fontSize: 16 },
          }}
        >
          <Tab icon={<AccessTime color="warning" />} iconPosition="start" label="Pending" />
          <Tab icon={<CheckCircle color="success" />} iconPosition="start" label="Accepted" />
          <Tab icon={<Cancel color="error" />} iconPosition="start" label="Rejected" />
        </Tabs>
        <List>
          {(trackerTab === 0 ? getFilteredApplications("pending")
            : trackerTab === 1 ? getFilteredApplications("accepted")
            : getFilteredApplications("rejected")
          ).map((app) => (
            <ListItem
              key={app.id}
              divider
              sx={{
                bgcolor: trackerTab === 0
                  ? 'warning.50'
                  : trackerTab === 1
                  ? 'success.50'
                  : 'error.50',
                borderRadius: 2,
                mb: 1,
                boxShadow: 1,
              }}
              secondaryAction={
                <Chip
                  label={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  color={
                    trackerTab === 0
                      ? "warning"
                      : trackerTab === 1
                      ? "success"
                      : "error"
                  }
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              }
            >
              <ListItemIcon>
                {trackerTab === 0 && <AccessTime color="warning" />}
                {trackerTab === 1 && <CheckCircle color="success" />}
                {trackerTab === 2 && <Cancel color="error" />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {app.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {app.position}
                  </Typography>
                }
              />
            </ListItem>
          ))}
          {(
            (trackerTab === 0 && getFilteredApplications("pending").length === 0) ||
            (trackerTab === 1 && getFilteredApplications("accepted").length === 0) ||
            (trackerTab === 2 && getFilteredApplications("rejected").length === 0)
          ) && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No applications in this category.
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>

      {activeTab === "interviews" && (
        <Box sx={{ mt: 4 }}>
          <InterviewsTab />
        </Box>
      )}
    </Box>
  );
};

export default CandidateDashboard;
